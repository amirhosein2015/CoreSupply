# System Requirements

## Functional Requirements
*   **Catalog:** Users can browse and search industrial parts.
*   **Basket:** Users can maintain a temporary cart (Redis backed).
*   **Ordering:** Orders are processed asynchronously via Event Bus.
*   **Identity:** Secure JWT authentication with Role-Based Access Control (RBAC).

## Non-Functional Requirements
*   **Scalability:** Horizontal scaling via Kubernetes (Simulated with Docker Compose).
*   **Observability:** Centralized logging with Serilog & Seq.
*   **Resilience:** Retry and Circuit Breaker policies using Polly.
