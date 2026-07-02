package rabbit

import (
	"log"
	amqp "github.com/rabbitmq/amqp091-go"
	"cap/backup-service/internal/core/domain" // Asegúrate de que "cap/backup-service" coincida con tu go.mod
)

type RabbitConsumer struct {
	conn    *amqp.Connection
	channel *amqp.Channel
	useCase domain.BackupUseCase // Inyectamos el caso de uso
}

func NewRabbitConsumer(rabbitURL string, useCase domain.BackupUseCase) *RabbitConsumer {
	conn, err := amqp.Dial(rabbitURL)
	if err != nil {
		log.Fatalf("❌ Fallo al conectar con RabbitMQ: %v", err)
	}

	ch, err := conn.Channel()
	if err != nil {
		log.Fatalf("❌ Fallo al abrir canal RabbitMQ: %v", err)
	}

	return &RabbitConsumer{
		conn:    conn,
		channel: ch,
		useCase: useCase,
	}
}

func (r *RabbitConsumer) StartListening(queueName string) {
	q, _ := r.channel.QueueDeclare(queueName, true, false, false, false, nil)

	msgs, err := r.channel.Consume(q.Name, "backup-worker", true, false, false, false, nil)
	if err != nil {
		log.Fatalf("❌ Fallo al registrar consumidor: %v", err)
	}

	log.Printf("🐇 Escuchando eventos en la cola [%s]...", queueName)

	go func() {
		for d := range msgs {
			log.Printf("📥 Comando recibido: %s", d.Body)
			if string(d.Body) == "TRIGGER_POSTGRES_BACKUP" {
				// Ejecutamos la lógica de negocio a través del puerto
				_, err := r.useCase.ExecuteDatabaseDump()
				if err != nil {
					log.Printf("⚠️ Error ejecutando backup: %v", err)
				}
			}
		}
	}()
}

func (r *RabbitConsumer) Close() {
	r.channel.Close()
	r.conn.Close()
}