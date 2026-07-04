package services

import (
	"fmt"
	"os"
	"path/filepath"
	"time"

	"cap/backup-service/internal/core/domain"
)

// backupService implements the BackupUseCase interface from the domain
type backupService struct {
	storagePort domain.StoragePort
}

// NewBackupService is the constructor where we inject the dependency
func NewBackupService(storage domain.StoragePort) domain.BackupUseCase {
	return &backupService{
		storagePort: storage,
	}
}

// ExecuteDatabaseDump contains the core orchestrating logic
func (s *backupService) ExecuteDatabaseDump() (*domain.BackupResult, error) {
	fmt.Println("[Backup Service] Starting database dump...")

	// 1. Generate a unique file name based on date and time
	timestamp := time.Now().Format("20060102_150405")
	fileName := fmt.Sprintf("db_backup_%s.sql", timestamp)
	filePath := filepath.Join(os.TempDir(), fileName)

	// 2. SIMULATED POSTGRESQL DUMP
	dummyData := []byte("-- Simulated PostgreSQL SQL Backup for UCE\nCREATE TABLE classrooms (id INT);\n")
	err := os.WriteFile(filePath, dummyData, 0644)
	if err != nil {
		return nil, fmt.Errorf("error generating local backup file: %w", err)
	}

	// 3. Ensure the temporary file is deleted from the server when finished
	defer func() {
		os.Remove(filePath)
		fmt.Printf("[Backup Service] Temporary file %s deleted from the server.\n", filePath)
	}()

	// 4. Upload to the cloud using our Port
	fmt.Printf("[Backup Service] Uploading %s to the cloud...\n", fileName)
	err = s.storagePort.UploadBackup(filePath, fileName)
	if err != nil {
		return &domain.BackupResult{
			FileName: fileName,
			Status:   "FAILED",
		}, fmt.Errorf("error uploading backup to the cloud: %w", err)
	}

	// 5. Get file size for the final report
	fileInfo, _ := os.Stat(filePath)
	fileSize := fileInfo.Size()

	// 6. Return successful result
	fmt.Println("[Backup Service] Backup completed successfully!")
	return &domain.BackupResult{
		FileName: fileName,
		FileSize: fileSize,
		Status:   "COMPLETED",
	}, nil
}