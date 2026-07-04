package domain

// BackupResult representa el estado final de una tarea de respaldo
type BackupResult struct {
	FileName string
	FileSize int64
	Status   string
}

// StoragePort es el "Puerto" de salida. 
// Al dominio no le importa si es R2, S3 o Google Cloud. Solo sabe que puede subir archivos.
type StoragePort interface {
	UploadBackup(filePath string, fileName string) error
}

// BackupUseCase es el "Puerto" de entrada.
// Define lo que nuestro servicio principal sabe hacer.
type BackupUseCase interface {
	ExecuteDatabaseDump() (*BackupResult, error)
}