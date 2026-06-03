# 🎓 CAP - Classroom Assignment Platform

[English Version](#-english-version) | [Versión en Español](#-versión-en-español)

---

## 🇺🇸 English Version

### About the Project
**CAP (Classroom Assignment Platform)** is an enterprise-level distributed system designed to manage and optimize classroom and laboratory reservations within a university campus. Built with a Cloud-Native approach, this platform ensures high availability, scalability, and strict data consistency.

### 🏗️ System Architecture
The platform is built upon a **Polyglot Microservices Architecture**, integrated with a custom Reverse Proxy, automated CI/CD pipelines, and orchestrated by Kubernetes.

* **Auth Service (Node.js/Express):** Designed using **Hexagonal Architecture** (Ports and Adapters) for loose coupling. Handles JWT-based authentication and user authorization.
* **Room Service (Python/FastAPI):** High-performance service responsible for managing classroom inventory, scheduling, and conflict resolution.
* **API Gateway (Nginx):** Custom reverse proxy configured to route incoming external traffic (`/api/auth`, `/api/rooms`) securely to the isolated internal container network.
* **Database:** Isolated PostgreSQL instances.
* **CI/CD Pipeline:** Fully automated workflow using **GitHub Actions**. Automatically builds and pushes Docker images to Docker Hub upon new commits to specific branches.
* **Orchestration (Kubernetes):** Deployment manifests (`Deployment`, `Service`, `NodePort`) ensuring zero-downtime, self-healing capabilities, and dynamic replica scaling.

### 💻 Tech Stack
* **Backend:** Node.js, Python 3.10, FastAPI, Express
* **Database:** PostgreSQL
* **Infrastructure:** Docker, Docker Compose, Nginx
* **DevOps & Cloud:** GitHub Actions, Docker Hub, Kubernetes (K8s)

### 🚀 Getting Started (Kubernetes)
To run this project locally using Kubernetes:

1. Enable Kubernetes in Docker Desktop.
2. Apply the deployment manifests:
   ```bash
   kubectl apply -f infrastructure/kubernetes/postgres.yaml
   kubectl apply -f infrastructure/kubernetes/auth-service.yaml