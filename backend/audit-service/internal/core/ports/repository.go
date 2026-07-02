// backend/audit-service/internal/core/ports/repository.go
package ports

import (
	"context"
	"cap/audit-service/internal/core/domain"
)

// AuditRepository defines the contract for storing and retrieving audit logs.
type AuditRepository interface {
	SaveLog(ctx context.Context, log *domain.AuditLog) error
	GetLogs(ctx context.Context) ([]domain.AuditLog, error) 
}