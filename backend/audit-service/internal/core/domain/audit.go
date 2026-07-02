// backend/audit-service/internal/core/domain/audit.go
package domain

import "time"

// AuditLog represents an immutable record of an event in the CAP system.
type AuditLog struct {
	ID        string    `json:"id"`
	EventType string    `json:"event_type"` // e.g., "booking.created", "user.login"
	Payload   string    `json:"payload"`    // the exact JSON of the event
	Timestamp time.Time `json:"timestamp"`
	Source    string    `json:"source"`     // e.g., "booking-service", "auth-service"
}