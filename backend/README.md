# CAP Backend: Distributed Microservices Architecture

## Executive Summary
This repository contains the backend ecosystem for the Classroom Assignment Platform (CAP). The system is designed as a Cloud-Native, polyglot microservices architecture utilizing Event-Driven communication and Hexagonal Architecture (Ports and Adapters) principles. The infrastructure relies on containerized deployments, an Nginx API Gateway for ingress routing, and Apache Kafka for asynchronous inter-service communication.

## Architectural Patterns Implemented
1. **Hexagonal Architecture**: Business logic is strictly isolated within the `application` and `domain` layers. External concerns (HTTP routing, database drivers, Kafka adapters) are decoupled via the `infrastructure` layer.
2. **Event-Driven Architecture (EDA)**: Decoupled services communicate via Apache Kafka topics to ensure non-blocking operations and high availability.
3. **Polyglot Ecosystem**: Services are built using the most efficient technology for their specific workload (Node.js for asynchronous I/O and event consumption; Python/FastAPI for highly structured, compute-ready data modeling).
4. **API Gateway Pattern**: A centralized Nginx reverse proxy abstracts internal service topologies from client applications.

## Service Catalog

| Service Name | Stack | Internal Port | Description |
| :--- | :--- | :--- | :--- |
| **Auth Service** | Node.js, Express, bcryptjs | `3001` | Manages user identities, authentication, and Role-Based Access Control (RBAC) via JWT generation. |
| **Room Service** | Python, FastAPI, SQLAlchemy | `8002` | Handles CRUD operations for physical infrastructure (Faculties, Rooms, Campuses). Implements strict data validation via Pydantic. |
| **Reservation Service** | Node.js, Express, KafkaJS | `3002` | Processes booking commands. Persists data to PostgreSQL and publishes `RESERVATION_CREATED` events to Kafka. |
| **Notification Service** | Node.js, KafkaJS | `3003` | Headless Kafka consumer. Subscribes to the `reservations` topic to dispatch asynchronous email/push alerts. |

## Core Infrastructure
* **API Gateway**: Nginx Alpine (`:8000`). Handles global CORS policies and proxies traffic (`/api/auth/*`, `/api/rooms/*`, `/api/reservations/*`).
* **Relational Database**: PostgreSQL 15 (`:5432`). Centralized persistence layer with mapped Docker volumes (`pgdata`) for data integrity.
* **Message Broker**: Apache Kafka & Zookeeper (Confluent CP 7.4.0) (`:9092`). Facilitates pub/sub messaging patterns.

## Local Environment Setup

### Prerequisites
* Docker Engine (v24+)
* Docker Compose (v2+)
* Node.js 20 LTS & Python 3.10 (for local uncontainerized debugging)

### Environment Variables
Each microservice requires a `.env` file at its root directory. Standard local configuration:

```env
# Shared Database Configuration
DB_HOST=
DB_PORT=5432
DB_USER=
DB_PASSWORD=<your_local_db_password>
DB_NAME=cap_db

# Security (Auth Service)
JWT_SECRET=<your_secure_jwt_secret>
JWT_EXPIRES_IN=24h

# Messaging (Reservation & Notification Services)
KAFKA_BROKER=kafka:29092
