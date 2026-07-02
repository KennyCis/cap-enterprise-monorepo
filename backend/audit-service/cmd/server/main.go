// backend/audit-service/cmd/server/main.go
package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"

	"cap/audit-service/internal/adapters/cassandra"
	kafkaAdapter "cap/audit-service/internal/adapters/kafka"
)

func main() {
	log.Println("🚀 Starting CAP Audit Service in Golang...")

	// 1. Initialize Cassandra Adapter (Right side of the Hexagon)
	log.Println("⚡ Preparing connection to DataStax Cassandra...")
	// NOTE: In production, these values will come from .env
	cassandraHosts := []string{"127.0.0.1"} 
	keyspace := "cap_audit"
	
	repo, err := cassandra.NewCassandraRepository(cassandraHosts, keyspace)
	if err != nil {
		// For now we just log the error but don't crash, because you might not have Cassandra running locally yet
		log.Printf("⚠️ Warning: Could not connect to Cassandra (is it running?): %v", err)
	}

	// 2. Initialize Kafka Adapter and inject the Repository (Left side of the Hexagon)
	log.Println("🎧 Connecting to Apache Kafka broker...")
	kafkaBrokers := []string{"localhost:9092"}
	topic := "booking.created" // Example topic to listen to
	groupID := "audit-service-group"

	consumer := kafkaAdapter.NewAuditConsumer(kafkaBrokers, topic, groupID, repo)

	// 3. Start consuming events in a separate goroutine
	ctx, cancel := context.WithCancel(context.Background())
	go consumer.Start(ctx)

	// 4. Graceful shutdown handler
	stopChan := make(chan os.Signal, 1)
	signal.Notify(stopChan, syscall.SIGINT, syscall.SIGTERM)

	log.Println("✅ Audit Service is fully operational. Press Ctrl+C to exit.")
	<-stopChan // Block here until Ctrl+C

	log.Println("🛑 Shutting down Audit Service gracefully...")
	cancel() // Stop the Kafka consumer
}