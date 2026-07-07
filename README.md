# CAP - Classroom Assignment Platform

## English Version

### About the Project
CAP (Classroom Assignment Platform) is an enterprise-level distributed system designed to manage and optimize classroom and laboratory reservations within a university campus. Built with a Cloud-Native and Event-Driven approach, this platform ensures high availability, scalability, and strict data consistency across polyglot environments.

### System Architecture
The platform leverages a Polyglot Microservices Architecture, asynchronous messaging, a custom Reverse Proxy, automated CI/CD pipelines, and container orchestration.

* **Frontend Web Application (React):** A modern, responsive SPA built with React, Vite, Tailwind CSS v4, and Shadcn/ui. Handles user interactions and communicates exclusively through the API Gateway.
* **API Gateway (Nginx):** Custom reverse proxy configured to route incoming external traffic securely to the isolated internal container network, mitigating CORS issues and abstracting service topologies.
* **Auth Service (Node.js):** Designed using Hexagonal Architecture. Handles JWT-based authentication and user authorization.
* **Room Service (Python/FastAPI):** High-performance synchronous service responsible for managing physical infrastructure inventory (Faculties, Rooms) with Pydantic validation.
* **Reservation Service (Node.js):** Core transactional service. Persists booking commands to PostgreSQL and publishes `RESERVATION_CREATED` events to the message broker.
* **Notification Service (Node.js):** Headless Kafka consumer. Subscribes to the event stream to dispatch asynchronous alerts without blocking the main transactional flow.
* **Message Broker (Apache Kafka):** Facilitates Event-Driven Architecture (EDA) for decoupled, resilient inter-service communication.
* **Database (PostgreSQL):** Isolated relational data persistence layer with robust volume management.
* **CI/CD Pipeline (GitHub Actions):** Automated workflows for code linting, building, and pushing Docker images to Docker Hub upon merges to the `develop` and `main` branches.

### Architecture Stack Update
* **Notification Service:** Migrated from **Go** to **Node.js (Express & ws)**.
  * **Rationale:** Time-to-market optimization and rapid prototyping. Node.js provides a robust, native asynchronous event-driven ecosystem that integrates seamlessly with our WebSocket requirements and Kafka consumer logic, ensuring real-time capabilities without compromising delivery deadlines.

### Tech Stack
* **Frontend:** React 19, Vite, Tailwind CSS v4, Shadcn/ui, React Router
* **Backend:** Node.js (Express), Python 3.10 (FastAPI), Pydantic, SQLAlchemy
* **Database & Messaging:** PostgreSQL 15, Apache Kafka, Zookeeper
* **Infrastructure & DevOps:** Docker, Docker Compose, Nginx, GitHub Actions, Kubernetes

### Local Development Setup (Docker Compose MVP)
To provision the entire distributed ecosystem locally:

1. Clone the repository and configure `.env` files for each service based on the provided architecture.
2. Execute the orchestration command from the root directory:
   ```bash
   docker-compose up --build -d