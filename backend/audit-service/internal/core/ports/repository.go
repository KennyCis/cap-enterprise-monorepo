// backend/audit-service/internal/core/ports/repository.go
package ports

import (
	"context"

	"cap/audit-service/internal/core/domain"
)

// AuditRepository defines the contract for storing audit logs.
type AuditRepository interface {
	SaveLog(ctx context.Context, log *domain.AuditLog) error
}