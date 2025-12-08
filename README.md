
# 🏭 CoreSupply | Cloud-Native Industrial Supply Chain Platform

[![.NET](https://img.shields.io/badge/.NET-8.0-512bd4?style=flat-square&logo=dotnet)](https://dotnet.microsoft.com/)
[![Docker](https://img.shields.io/badge/Docker-Containerized-2496ed?style=flat-square&logo=docker)](https://www.docker.com/)
[![CI Pipeline](https://github.com/amirhosein2015/CoreSupply/actions/workflows/dotnet-ci.yml/badge.svg)](https://github.com/amirhosein2015/CoreSupply/actions/workflows/dotnet-ci.yml)
[![Architecture](https://img.shields.io/badge/Architecture-Event--Driven_Microservices-blue?style=flat-square)](https://github.com/amirhosein2015/CoreSupply)
[![Quality](https://img.shields.io/badge/Tests-Integration_%26_Unit-green?style=flat-square)](https://xunit.net/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

> **Enterprise-grade B2B solution for the DACH market, built with modern .NET 8 standards.**

**CoreSupply** is not just an e-commerce backend; it is a distributed system architected to solve complex industrial procurement challenges. Unlike traditional monoliths, it leverages **Microservices**, **Event-Driven Architecture**, and **Domain-Driven Design (DDD)** to ensure loose coupling, high scalability, and fault tolerance.

The primary goal of this project is to demonstrate **Principal-level** engineering practices, including robust observability, resiliency patterns, and automated integration testing.

![Microservice Diagram](https://github.com/user-attachments/assets/77fc23ec-1806-4fd9-bb76-f8b93d1b0e78)

---

## 🏗️ High-Level Architecture

The system follows **Clean Architecture** principles and uses a hybrid communication strategy (**Sync gRPC** for speed, **Async Messaging** for consistency).

```mermaid
graph TD
    Client[Web/Mobile Client] --> Gateway[Ocelot API Gateway :9000]
    
    subgraph "Internal Network (Docker)"
        Gateway --> Identity[Identity API]
        Gateway --> Catalog[Catalog API]
        Gateway --> Basket[Basket API]
        Gateway --> Ordering[Ordering API]
        
        %% Synchronous Communication
        Basket -- gRPC (HTTP/2) --> Discount[Discount gRPC]
        Discount --> SQLite[(SQLite)]

        %% Asynchronous Communication
        Basket -- Publishes Checkout Event --> EventBus[RabbitMQ / MassTransit]
        EventBus -- Consumes Event --> Ordering
        
        %% Data Stores
        Identity --> AuthDB[(PostgreSQL)]
        Catalog --> CatDB[(MongoDB)]
        Basket --> Redis[(Redis Cache)]
        Ordering --> OrderDB[(SQL Server)]
        
        %% Observability
        Ordering -.-> Seq[Seq Logging Server]
        Basket -.-> Seq
        Identity -.-> Seq
        Gateway -.-> Seq
        Discount -.-> Seq
    end
    
    subgraph "Quality Assurance"
        Tests[Integration Tests] -.-> Ordering
    end
```

---

## 🚀 Engineering Excellence & Patterns

This project demonstrates mastery of advanced software engineering concepts required for **Senior/Principal** roles.

### **1. Architecture & Design**
*   **Microservices:** Fully autonomous services with **Polyglot Persistence** (Mongo, SQL Server, Postgres, Redis, SQLite).
*   **Domain-Driven Design (DDD):** Rich domain models, Aggregates, and Value Objects implemented in the *Ordering Service*.
*   **CQRS:** Command Query Responsibility Segregation using **MediatR** to separate read/write concerns.
*   **Clean Architecture:** Strict separation of concerns (Domain, Application, Infrastructure, API).

### **2. Communication & Messaging**
*   **Event-Driven Architecture:** Asynchronous inter-service communication using **RabbitMQ** and **MassTransit**.
*   **Synchronous gRPC:** High-performance inter-service communication between *Basket* and *Discount* using ProtoBuf and HTTP/2.
*   **API Gateway:** Unified entry point using **Ocelot** for routing and aggregation.
*   **Resilient Connectivity:** Retry policies and circuit breakers (via MassTransit & Polly).

### **3. Observability & DevOps**
*   **Centralized Logging:** Structured logging aggregation using **[Serilog configuration](./CoreSupply.BuildingBlocks/Logging/LoggingExtensions.cs)** and **Seq**.
*   **Docker Compose:** Zero-config deployment via [docker-compose.yml](./docker-compose.yml).
*   **Port Management:** Strategic port mapping to avoid Windows Hyper-V conflicts (Safe Ports 6000+ for Infra). 
*   **Deep Dive:** 👉 **[Read the Observability Guide](./docs/observability/observability-guide.md)**.

### **4. System Resilience**
*   **Fault Tolerance:** Implemented **Polly** retry policies inside [Ordering Program.cs](./CoreSupply.Ordering.API/Program.cs).
*   **Performance Monitoring:** Custom **[LoggingBehavior.cs](./CoreSupply.BuildingBlocks/Behaviors/LoggingBehavior.cs)** in MediatR pipeline to track slow commands.
*   **Self-Healing:** Database migration and seeding strategies that handle container restarts gracefully.
*   **Deep Dive:** 👉 **[Read the Resilience & Fault Tolerance Guide](./docs/architecture/resilience-patterns.md)**.

### **5. Quality Assurance**
*   **Integration Testing:** Automated end-to-end testing using **[Testcontainers implementation](./CoreSupply.IntegrationTests/Fixtures/IntegrationTestWebAppFactory.cs)**.
*   **Unit/Integration Scenarios:** See **[OrderTests.cs](./CoreSupply.IntegrationTests/Fixtures/OrderTests.cs)** for real-world testing examples.
*   **Deep Dive:** 👉 **[Read the full Testing Strategy Guide](./docs/architecture/testing-strategy.md)** to understand how we handle CI/CD vs Local environments.

### **6. Security Architecture**
*   **Identity & Access:** Centralized JWT authentication with Refresh Token Rotation and RBAC authorization.
*   **Secrets Management:** Environment-based configuration following 12-Factor App principles (no hardcoded secrets).
*   **Deep Dive:** 👉 **[Read the Security Architecture Guide](./docs/architecture/security-architecture.md)**.

---

## 🧩 Microservices Breakdown

| Service | Responsibility | Tech Stack | Database | Port |
| :--- | :--- | :--- | :--- | :--- |
| **Identity API** | Centralized Authentication (**JWT + Refresh Token**) | .NET 8, Identity Core | **PostgreSQL** | 9003 |
| **Catalog API** | Product Inventory Management | .NET 8, Repository Pattern | **MongoDB** | 9001 |
| **Discount gRPC** | Coupon & Discount Logic (Internal Service) | .NET 8, **gRPC**, ProtoBuf | **SQLite** | 9005 |
| **Quote API** | Basket & B2B Quote Management | .NET 8, **gRPC Client**, MassTransit | **Redis** | 9002 |
| **Ordering API** | Order Lifecycle (Core Domain) | .NET 8, **DDD**, **CQRS**, **Saga** | **SQL Server** | 9004 |
| **API Gateway** | Unified Routing & Security | Ocelot, **Polly** | - | 9000 |
| **Seq** | **Centralized Log Dashboard** | Datalust Seq | - | 5340 |

### **Shared Kernel (BuildingBlocks)**
A centralized class library that enforces standards across all microservices:
*   **CQRS Abstractions:** `ICommand`, `IQuery`, `ICommandHandler`.
*   **DDD Base Classes:** `Entity`, `AggregateRoot`, `IDomainEvent`.
*   **Cross-Cutting Concerns:** `LoggingExtensions` (Serilog config), `ValidationBehavior`, `LoggingBehavior`.

---

## 🛠️ How to Run (Zero-Config)

You don't need to install SQL Server, RabbitMQ, or Mongo locally. Docker handles everything.

### Prerequisites
*   [Docker Desktop](https://www.docker.com/products/docker-desktop) (Linux Containers mode)

### Installation
1.  **Clone the repository:**
    ```bash
    git clone https://github.com/amirhosein2015/CoreSupply.git
    cd CoreSupply
    ```
2.  **Launch the Platform:**
    ```bash
    docker-compose up -d --build
    ```
    *Wait ~30 seconds for databases to initialize.*

3.  **Access the System:**
    *   **Unified API Gateway:** `http://localhost:9000/catalog`
    *   **Log Dashboard (Seq):** `http://localhost:5340` (admin / Password12!)
    *   **RabbitMQ Dashboard:** `http://localhost:16672` (guest/guest)
    *   **Swagger UI:** Available on ports 9001-9005.

---

## 🔮 Roadmap (Principal Level Goals)

| Phase | Status | Feature | Details |
| :--- | :--- | :--- | :--- |
| **1. Foundation** | ✅ Done | Microservices & Infrastructure | Docker, Polyglot Persistence, Event Bus setup. |
| **2. Security** | ✅ Done | Advanced Auth | Refresh Tokens, RBAC, Secrets Management. |
| **3. Communication** | ✅ Done | gRPC Integration | Synchronous, high-performance link between Basket & Discount. |
| **4. Orchestration** | ⏳ Next | **Saga Pattern** | Implementing Distributed Transactions (Order -> Inventory -> Payment). |
| **5. Observability** | 🚧 60% | Distributed Tracing | Adding OpenTelemetry for full request tracing. |
| **6. Deployment** | ⏳ Pending | Kubernetes (K8s) | Deploying to AKS/Local K8s with Helm Charts. |

---

## 👨‍💻 Author

**Abdollah Mohajeri**
*   *Senior Software Engineer & Cloud Architect*
*   Focus: Distributed Systems, .NET Ecosystem, Cloud-Native Solutions.
*   GitHub: [amirhosein2015](https://github.com/amirhosein2015)

---
*Designed with ❤️ for the Industrial Sector.*
```
