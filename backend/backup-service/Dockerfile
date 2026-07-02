# backend/backup-service/Dockerfile

# Stage 1: Build binary
FROM golang:1.26-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -o backup-service ./cmd/worker/main.go

# Stage 2: Runtime minimal environment
FROM alpine:latest

# Essential: Install postgresql-client to have access to 'pg_dump' utility tool
RUN apk --no-cache add postgresql-client

WORKDIR /root/

COPY --from=builder /app/backup-service .

# Create volume folder for backups directory persistency
RUN mkdir backups

CMD ["./backup-service"]