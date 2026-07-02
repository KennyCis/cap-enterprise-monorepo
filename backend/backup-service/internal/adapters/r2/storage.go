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

// R2Adapter implementa domain.StoragePort
type R2Adapter struct {
	client     *s3.Client
	bucketName string
}

// NewR2Adapter inicializa la conexión con Cloudflare R2 o AWS S3
func NewR2Adapter(accountId, accessKey, secretKey, bucketName string) *R2Adapter {
	// Cloudflare R2 usa esta estructura de URL: https://<ACCOUNT_ID>.r2.cloudflarestorage.com
	r2Resolver := aws.EndpointResolverWithOptionsFunc(func(service, region string, options ...interface{}) (aws.Endpoint, error) {
		return aws.Endpoint{
			URL: fmt.Sprintf("https://%s.r2.cloudflarestorage.com", accountId),
		}, nil
	})

	cfg, err := config.LoadDefaultConfig(context.TODO(),
		config.WithEndpointResolverWithOptions(r2Resolver),
		config.WithCredentialsProvider(credentials.NewStaticCredentialsProvider(accessKey, secretKey, "")),
		config.WithRegion("auto"), // R2 usa 'auto' como región
	)
	if err != nil {
		log.Fatalf("❌ Error cargando configuración de R2: %v", err)
	}

	return &R2Adapter{
		client:     s3.NewFromConfig(cfg),
		bucketName: bucketName,
	}
}

// UploadBackup sube el archivo .sql a la nube
func (r *R2Adapter) UploadBackup(filePath string, fileName string) error {
	file, err := os.Open(filePath)
	if err != nil {
		return fmt.Errorf("no se pudo abrir el archivo de backup: %v", err)
	}
	defer file.Close()

	log.Printf("☁️ Subiendo [%s] a Cloudflare R2...", fileName)

	_, err = r.client.PutObject(context.TODO(), &s3.PutObjectInput{
		Bucket: aws.String(r.bucketName),
		Key:    aws.String("postgres-backups/" + fileName),
		Body:   file,
	})

	if err != nil {
		return fmt.Errorf("error subiendo a R2: %v", err)
	}

	log.Println("✅ Backup subido exitosamente a la nube R2")
	return nil
}