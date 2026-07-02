// backend/audit-service/internal/adapters/rest/handler.go
package rest

import (
	"encoding/json"
	"net/http"

	"cap/audit-service/internal/core/domain"
	"cap/audit-service/internal/core/ports"
)

// AuditHandler handles HTTP requests for audit logs
type AuditHandler struct {
	repo ports.AuditRepository
}

// NewAuditHandler creates a new HTTP adapter
func NewAuditHandler(repo ports.AuditRepository) *AuditHandler {
	return &AuditHandler{repo: repo}
}

// HandleGetLogs processes the GET request and returns logs as JSON
func (h *AuditHandler) HandleGetLogs(w http.ResponseWriter, r *http.Request) {
	// Enable CORS for the frontend
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")

	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	logs, err := h.repo.GetLogs(r.Context())
	if err != nil {
		http.Error(w, "Failed to fetch logs", http.StatusInternalServerError)
		return
	}

	// If logs is nil (empty DB), return an empty array instead of null
	if logs == nil {
		logs = []domain.AuditLog{}
	}

	json.NewEncoder(w).Encode(logs)
}