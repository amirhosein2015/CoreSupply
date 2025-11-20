# 🏭 CoreSupply - B2B Industrial Supply Chain Microservices

## 📝 Overview
CoreSupply is a comprehensive backend solution designed for the complex needs of Industrial and Automotive B2B Supply Chains.

Unlike traditional monolithic e-commerce platforms, CoreSupply is architected as a distributed system using **Microservices Architecture**.  
The primary goal of this project is to demonstrate enterprise-grade patterns such as **loose coupling**, **independent scalability**, and **resilient infrastructure** using Docker Compose.

> 🚧 **Project Status:**  
> This project is currently under active development.  
> The core infrastructure and foundational services (**Catalog & Quote**) are fully operational.  
> Advanced features like **Event Bus (RabbitMQ)** and **API Gateway** are currently being implemented.

---

## 🏗️ Architecture & Tech Stack

The solution follows a microservices architectural style where each business capability is a self-contained service with its own database (**Polyglot Persistence**).

### 🔧 Technologies Used
- **Core Framework:** ASP.NET Core 8.0 Web API  
- **Containerization:** Docker & Docker Compose (Linux Containers)  
- **Databases:**
  - **MongoDB** – Product Catalog & Quote persistence  
  - **Redis** – High-performance distributed basket/quote management  
  - **PostgreSQL & SQL Server** – Pricing & Procurement  
- **DevOps & Orchestration:**
  - Orchestration via docker-compose with health checks and dependency control  
  - Resilient startup strategies (wait-for-service patterns)  
- **Documentation:** Swagger UI / OpenAPI  

---

## 🧩 Microservices Breakdown

| Service        | Responsibility                                        | Tech / Database            | Status                  |
|----------------|--------------------------------------------------------|-----------------------------|--------------------------|
| **Catalog API** | Manages industrial parts, specs & inventory data      | ASP.NET Core / MongoDB      | ✅ Completed             |
| **Quote API**   | Handles baskets & B2B quote requests                  | ASP.NET Core / Redis/Mongo  | ✅ Completed             |
| **Pricing API** | Complex pricing rules (volume & customer tiers)       | ASP.NET Core / PostgreSQL   | 🔄 Infra Ready          |
| **Procurement API** | Order processing & fulfillment workflow          | ASP.NET Core / SQL Server   | 🔄 Infra Ready          |
| **API Gateway** | Unified entry using Ocelot                            | .NET Core                   | 📅 Planned              |

---

## 🚀 How to Run

This project is fully containerized. You can run the entire infrastructure and services with a single command.

### **Prerequisites**
- Docker Desktop (Linux mode)
- .NET 8.0 SDK (optional, for local development)

### **Installation Steps**

Clone the repository:
```bash
git clone https://github.com/your-username/CoreSupply.git
cd CoreSupply
```

Run the application:
```bash
docker-compose up -d --build
```


This will provision MongoDB, Redis, SQL Server, RabbitMQ, and all microservices.
Access Swagger

    Catalog API → http://localhost:8000/swagger


    Quote API → http://localhost:8001/swagger

## 🔮 Roadmap
Project Setup & Docker Infrastructure
Catalog Microservice (MongoDB)
Quote/Basket Microservice (Redis + MongoDB)
Container Orchestration & Health Checks
API Gateway (Ocelot)
Pricing Service (gRPC Communication)
Event-Driven Architecture (RabbitMQ Integration)
Aggregator Service (BFF Pattern)


## 👤 Author

### Abdollah Mohajeri
Software Engineer | ASP.NET Core & Microservices Enthusiast




