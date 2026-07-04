package main

import (
	"log"
	"os"
	"os/signal"
	"syscall"

	"cap/backup-service/internal/adapters/r2"
	"cap/backup-service/internal/adapters/rabbitmq"
	"cap/backup-service/internal/core/services"
)

func main() {
	log.Println("🗄️ Starting CAP Backup Service (Hexagonal Architecture)...")

	// 1. Load Environment Variables (Fallback to defaults for local dev)
	rabbitURL := getEnv("RABBITMQ_URL", "amqp://admin:adminpassword@localhost:5672/")
	r2AccountID := getEnv("R2_ACCOUNT_ID", "local_account_id")
	r2AccessKey := getEnv("R2_ACCESS_KEY", "local_access_key")
	r2SecretKey := getEnv("R2_SECRET_KEY", "local_secret_key")
	r2Bucket := getEnv("R2_BUCKET_NAME", "cap-backups")

	// 2. Instantiate Driven Adapters (Outbound to Cloudflare R2)
	storageAdapter := r2.NewR2Adapter(r2AccountID, r2AccessKey, r2SecretKey, r2Bucket)

	// 3. Instantiate Core Services (Injecting the Storage Adapter)
	backupUseCase := services.NewBackupService(storageAdapter)

	// 4. Instantiate Driving Adapters (Inbound from RabbitMQ, injecting Use Case)
	rabbitConsumer, err := rabbitmq.NewRabbitMQConsumer(rabbitURL, backupUseCase)
	if err != nil {
		log.Fatalf("❌ Failed to initialize RabbitMQ consumer: %v", err)
	}
	defer rabbitConsumer.Close()

	// 5. Start listening to events
	err = rabbitConsumer.Start()
	if err != nil {
		log.Fatalf("❌ Failed to start RabbitMQ consumer: %v", err)
	}

	// 6. Graceful Shutdown listener to prevent zombie processes
	stopChan := make(chan os.Signal, 1)
	signal.Notify(stopChan, syscall.SIGINT, syscall.SIGTERM)
	<-stopChan

	log.Println("🛑 Shutting down Backup Service gracefully...")
}

// getEnv is a helper function to read environment variables with a fallback value
func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}