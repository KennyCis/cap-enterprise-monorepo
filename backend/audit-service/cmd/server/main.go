// backend/audit-service/cmd/server/main.go
package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"cap/audit-service/internal/adapters/cassandra"
	kafkaAdapter "cap/audit-service/internal/adapters/kafka"
	"cap/audit-service/internal/adapters/rest"
)

func main() {
	log.Println("🚀 Starting CAP Audit Service in Golang...")

	// 1. Initialize Cassandra Adapter (Right side of the Hexagon - storage)
	log.Println("⚡ Preparing connection to DataStax Cassandra...")
	cassandraHosts := []string{"127.0.0.1"}
	keyspace := "cap_audit"

	repo, err := cassandra.NewCassandraRepository(cassandraHosts, keyspace)
	if err != nil {
		log.Printf("⚠️ Warning: Could not connect to Cassandra (is it running?): %v", err)
	}

	// 2. Initialize Kafka Adapter (Left side of the Hexagon - consuming events)
	log.Println("🎧 Connecting to Apache Kafka broker...")
	kafkaBrokers := []string{"localhost:9092"}
	topic := "booking.created" // Example topic to listen to
	groupID := "audit-service-group"

	consumer := kafkaAdapter.NewAuditConsumer(kafkaBrokers, topic, groupID, repo)
	
	// Context to handle graceful shutdown of the consumer
	ctx, cancel := context.WithCancel(context.Background())
	go consumer.Start(ctx)

	// 3. Start REST API Adapter (Right side of the Hexagon - serving data)
	log.Println("🌐 Starting REST API on port 8080...")
	httpHandler := rest.NewAuditHandler(repo)
	http.HandleFunc("/api/audit", httpHandler.HandleGetLogs)

	go func() {
		if err := http.ListenAndServe(":8080", nil); err != nil {
			log.Fatalf("❌ Failed to start HTTP server: %v", err)
		}
	}()

	// 4. Graceful shutdown handler
	stopChan := make(chan os.Signal, 1)
	signal.Notify(stopChan, syscall.SIGINT, syscall.SIGTERM)

	log.Println("✅ Audit Service is fully operational. Press Ctrl+C to exit.")
	<-stopChan // Block here until Ctrl+C

	log.Println("🛑 Shutting down Audit Service gracefully...")
	cancel() // Stop the Kafka consumer safely
}