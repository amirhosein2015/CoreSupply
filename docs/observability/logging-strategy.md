
# Observability Strategy

## Logging Standard
We use **Structured Logging** with Serilog across all services.

### Log Levels
*   **Information:** Business events (e.g., "Order Created").
*   **Warning:** Transient failures (e.g., "DB Retry").
*   **Error:** System failures requiring intervention.

### Centralized Dashboard
All logs are aggregated in **Seq** (running on port 5340). Trace IDs are propagated through MassTransit headers for distributed tracing.
