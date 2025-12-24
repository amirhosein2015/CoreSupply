# ADR 0001: Use Orchestration-based Saga for Order Fulfillment

## Status
Accepted

## Context
In our distributed system, a single user action (Checkout) involves multiple services: Ordering, Inventory, and Payment. We need a way to ensure data consistency across these services. If payment fails, we must automatically roll back the inventory reservation.

## Decision
We decided to implement the **Orchestration-based Saga Pattern** using MassTransit State Machines and RabbitMQ.

## Rationale (Why?)
1. **Centralized Logic:** In industrial B2B systems, business rules are complex. Having a central "Orchestrator" (Ordering.API) makes the workflow easier to audit and debug.
2. **Predictability:** Orchestration provides a clear state-management flow, which is critical for logistics tracking.
3. **Loose Coupling:** The Inventory and Payment services remain thin and focused; they only respond to commands without knowing about each other.

## Consequences
- **Pros:** High visibility of transaction states, easier to implement complex rollbacks (Compensating Transactions).
- **Cons:** The Orchestrator itself becomes a critical component that must be highly available.
