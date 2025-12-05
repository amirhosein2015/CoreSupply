# ADR 001: Microservices Architecture Adoption

*   **Status:** Accepted
*   **Date:** 2025-12-01
*   **Deciders:** Technical Lead

## Context
We need to build a scalable B2B platform. A monolith would be hard to scale and maintain.

## Decision
We will use a **Microservices Architecture** with .NET 8 and Docker. Communication will be asynchronous (RabbitMQ) for writes and synchronous (HTTP) for reads.

## Consequences
*   (+) Independent deployment and scaling.
*   (+) Technology diversity (Polyglot Persistence).
*   (-) Increased operational complexity (requires observability).
