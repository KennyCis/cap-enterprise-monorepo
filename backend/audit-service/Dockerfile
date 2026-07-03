# backend/audit-service/Dockerfile

# Stage 1: Build the application
FROM golang:1.23-alpine AS builder

WORKDIR /app

# Copy dependency files first (to cache layers)
COPY go.mod go.sum ./
RUN go mod download

# Copy the rest of the source code
COPY . .

# Compile the Go binary statically
RUN CGO_ENABLED=0 GOOS=linux go build -o audit-service ./cmd/server/main.go

# Stage 2: Create the minimal production image
FROM alpine:latest

WORKDIR /root/

# Copy the compiled binary from the builder stage
COPY --from=builder /app/audit-service .

# Command to run the executable
CMD ["./audit-service"]