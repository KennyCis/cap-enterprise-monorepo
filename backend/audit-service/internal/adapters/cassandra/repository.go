// backend/audit-service/internal/adapters/cassandra/repository.go
package cassandra

import (
	"context"
	"log"

	"github.com/gocql/gocql"
	"cap/audit-service/internal/core/domain"
	"cap/audit-service/internal/core/ports"
)

type cassandraRepository struct {
	session *gocql.Session
}

// NewCassandraRepository creates a new instance of AuditRepository using Cassandra.
func NewCassandraRepository(hosts []string, keyspace string) (ports.AuditRepository, error) {
	cluster := gocql.NewCluster(hosts...)
	cluster.Keyspace = keyspace
	cluster.Consistency = gocql.Quorum

	session, err := cluster.CreateSession()
	if err != nil {
		return nil, err
	}

	log.Println("✅ Successfully connected to DataStax Cassandra cluster")
	return &cassandraRepository{session: session}, nil
}

// SaveLog inserts an immutable audit record into the Cassandra database.
func (r *cassandraRepository) SaveLog(ctx context.Context, auditLog *domain.AuditLog) error {
	query := `INSERT INTO audit_logs (id, event_type, payload, timestamp, source) VALUES (?, ?, ?, ?, ?)`
	
	err := r.session.Query(query,
		auditLog.ID,
		auditLog.EventType,
		auditLog.Payload,
		auditLog.Timestamp,
		auditLog.Source,
	).WithContext(ctx).Exec()

	if err != nil {
		log.Printf("❌ Failed to save audit log [%s]: %v", auditLog.ID, err)
		return err
	}

	return nil
}

// GetLogs retrieves the most recent audit logs from the Cassandra database.
func (r *cassandraRepository) GetLogs(ctx context.Context) ([]domain.AuditLog, error) {
	var logs []domain.AuditLog
	
	// Query to get the latest logs (in production, add pagination or LIMIT)
	query := `SELECT id, event_type, payload, timestamp, source FROM audit_logs LIMIT 50`
	scanner := r.session.Query(query).WithContext(ctx).Iter().Scanner()

	for scanner.Next() {
		var log domain.AuditLog
		err := scanner.Scan(&log.ID, &log.EventType, &log.Payload, &log.Timestamp, &log.Source)
		if err != nil {
			return nil, err
		}
		logs = append(logs, log)
	}

	if err := scanner.Err(); err != nil {
		return nil, err
	}

	return logs, nil
}