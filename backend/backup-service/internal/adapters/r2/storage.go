package r2

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

// R2Adapter implements domain.StoragePort
type R2Adapter struct {
	client     *s3.Client
	bucketName string
	accountID  string
}

// NewR2Adapter initializes the connection with Cloudflare R2 or AWS S3
func NewR2Adapter(accountId, accessKey, secretKey, bucketName string) *R2Adapter {
	r2Resolver := aws.EndpointResolverWithOptionsFunc(func(service, region string, options ...interface{}) (aws.Endpoint, error) {
		return aws.Endpoint{
			URL: fmt.Sprintf("https://%s.r2.cloudflarestorage.com", accountId),
		}, nil
	})

	cfg, err := config.LoadDefaultConfig(context.TODO(),
		config.WithEndpointResolverWithOptions(r2Resolver),
		config.WithCredentialsProvider(credentials.NewStaticCredentialsProvider(accessKey, secretKey, "")),
		config.WithRegion("auto"), // R2 uses 'auto' as region
	)
	if err != nil {
		log.Fatalf("❌ Error loading R2 configuration: %v", err)
	}

	return &R2Adapter{
		client:     s3.NewFromConfig(cfg),
		bucketName: bucketName,
		accountID:  accountId,
	}
}

// UploadBackup uploads the .sql file to the cloud
func (r *R2Adapter) UploadBackup(filePath string, fileName string) error {
	if r.accountID == "local_account_id" {
		log.Println("⚠️ [Mock Mode] Local environment detected. Bypassing real AWS/R2 network call.")
		log.Printf("☁️ Uploading [%s] to mock Cloudflare R2 bucket...", fileName)
		log.Println("✅ Backup uploaded successfully to Cloud storage (Simulated)")
		return nil
	}
	file, err := os.Open(filePath)
	if err != nil {
		return fmt.Errorf("could not open backup file: %v", err)
	}
	defer file.Close()

	log.Printf("☁️ Uploading [%s] to Cloudflare R2...", fileName)

	_, err = r.client.PutObject(context.TODO(), &s3.PutObjectInput{
		Bucket: aws.String(r.bucketName),
		Key:    aws.String("postgres-backups/" + fileName),
		Body:   file,
	})

	if err != nil {
		return fmt.Errorf("error uploading to R2: %v", err)
	}

	log.Println("✅ Backup uploaded successfully to R2 cloud")
	return nil
}