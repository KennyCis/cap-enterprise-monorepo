package domain

type BackupResult struct {
	FileName string
	FileSize int64
	Status   string
}

type StoragePort interface {
	UploadBackup(filePath string, fileName string) error
}

type BackupUseCase interface {
	ExecuteDatabaseDump() (*BackupResult, error)
}