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