// backend/audit-service/internal/adapters/kafka/consumer.go
package kafka

import (
	"context"
	"log"
	"time"

	"github.com/google/uuid"
	kafkaGo "github.com/segmentio/kafka-go"
	
	"cap/audit-service/internal/core/domain"
	"cap/audit-service/internal/core/ports"
)

// AuditConsumer handles incoming Kafka messages
type AuditConsumer struct {
	reader *kafkaGo.Reader
	repo   ports.AuditRepository
}

// NewAuditConsumer creates a new Kafka consumer adapter
func NewAuditConsumer(brokers []string, topic string, groupID string, repo ports.AuditRepository) *AuditConsumer {
	reader := kafkaGo.NewReader(kafkaGo.ReaderConfig{
		Brokers: brokers,
		Topic:   topic,
		GroupID: groupID,
	})

	return &AuditConsumer{
		reader: reader,
		repo:   repo,
	}
}

// Start begins listening for messages on the configured Kafka topic
func (c *AuditConsumer) Start(ctx context.Context) {
	log.Println("🎧 Kafka Consumer started, listening for audit events...")

	for {
		msg, err := c.reader.ReadMessage(ctx)
		if err != nil {
			// If context is canceled, exit the loop cleanly
			if ctx.Err() != nil {
				return
			}
			log.Printf("❌ Error reading message from Kafka: %v", err)
			continue
		}

		log.Printf("📥 Event received on topic [%s]", msg.Topic)

		auditLog := &domain.AuditLog{
			ID:        uuid.New().String(),
			EventType: msg.Topic,
			Payload:   string(msg.Value),
			Timestamp: time.Now(),
			Source:    "kafka-event-bus",
		}

		// Use the injected port to save the log (Hexagonal Architecture)
		err = c.repo.SaveLog(ctx, auditLog)
		if err != nil {
			log.Printf("❌ Failed to persist audit log: %v", err)
		} else {
			log.Printf("✅ Audit log persisted successfully: %s", auditLog.ID)
		}
	}
}