package rabbitmq

import (
	"log"

	"cap/backup-service/internal/core/domain"
	amqp "github.com/rabbitmq/amqp091-go"
)

// Consumer acts as the primary entry point (Driving Adapter) for incoming events
type Consumer struct {
	conn    *amqp.Connection
	channel *amqp.Channel
	useCase domain.BackupUseCase
}

// NewRabbitMQConsumer initializes the RabbitMQ connection and binds the use case
func NewRabbitMQConsumer(rabbitURL string, useCase domain.BackupUseCase) (*Consumer, error) {
	conn, err := amqp.Dial(rabbitURL)
	if err != nil {
		return nil, err
	}

	ch, err := conn.Channel()
	if err != nil {
		return nil, err
	}

	// Ensure the backup queue exists
	_, err = ch.QueueDeclare(
		"backup_tasks_queue", // name
		true,                 // durable
		false,                // delete when unused
		false,                // exclusive
		false,                // no-wait
		nil,                  // arguments
	)
	if err != nil {
		return nil, err
	}

	return &Consumer{
		conn:    conn,
		channel: ch,
		useCase: useCase,
	}, nil
}

// Start begins listening to the queue asynchronously
func (c *Consumer) Start() error {
	msgs, err := c.channel.Consume(
		"backup_tasks_queue",
		"backup-worker",
		true,  // auto-ack
		false, // exclusive
		false, // no-local
		false, // no-wait
		nil,
	)
	if err != nil {
		return err
	}

	log.Println("🐰 [RabbitMQ] Listening for backup trigger events on 'backup_tasks_queue'...")

	// Listen for messages in a background goroutine
	go func() {
		for d := range msgs {
			log.Printf("📥 [RabbitMQ] Command received: %s", d.Body)

			if string(d.Body) == "TRIGGER_POSTGRES_BACKUP" {
				// Trigger the core business logic via the Domain Port
				result, err := c.useCase.ExecuteDatabaseDump()
				if err != nil {
					log.Printf("❌ [RabbitMQ] Error executing backup: %v", err)
					continue
				}
				if result != nil {
					log.Printf("✅ [RabbitMQ] Backup Task Completed. File: %s | Size: %d bytes", result.FileName, result.FileSize)
				}
			} else {
				log.Printf("⚠️ [RabbitMQ] Unknown command instruction: %s", d.Body)
			}
		}
	}()

	return nil
}

// Close terminates the RabbitMQ connections gracefully
func (c *Consumer) Close() {
	if c.channel != nil {
		c.channel.Close()
	}
	if c.conn != nil {
		c.conn.Close()
	}
}