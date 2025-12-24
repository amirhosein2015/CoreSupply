# ADR 0002: Polyglot Persistence Strategy

## Status
Accepted

## Context
Different microservices have different data requirements. A one-size-fits-all database approach would lead to performance bottlenecks or rigid schemas.

## Decision
We adopted a **Polyglot Persistence** strategy:
- **MongoDB:** For Catalog/Component Registry (Schema-less, fast reads).
- **SQL Server:** For Ordering (Strict ACID compliance, complex relations).
- **Redis:** For Basket/Quote (Extremely low latency, key-value storage).
- **PostgreSQL:** For Identity (Standard for robust Auth providers).

## Rationale (Why?)
- **Catalog** components change frequently; MongoDB allows for flexible attributes.
- **Orders** must never be lost or corrupted; SQL Server's transactional integrity is vital.
- **Baskets** are transient and require sub-millisecond response times; Redis is the optimal choice.

## Consequences
- **Pros:** Optimized performance and scalability for each domain.
- **Cons:** Increased operational complexity (managing multiple database engines).
