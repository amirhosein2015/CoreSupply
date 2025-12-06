
# 👁️ Observability & Monitoring Guide

> "You can't fix what you can't see."

In CoreSupply, we treat logs as **Event Streams**, not just text files. We utilize **Structured Logging** to enable powerful querying, filtering, and alerting across all microservices.

---

## 🏗️ Architecture

We use a centralized logging architecture to aggregate logs from all 5 microservices into a single dashboard.

*   **Log Producer:** [Serilog](https://serilog.net/) (Running inside each container).
*   **Log Aggregator & UI:** [Seq](https://datalust.co/seq) (Running as a Docker container).
*   **Transport:** HTTP (Port 5341).

---

## 🚀 Structured Logging Standard

We enforce a strict logging standard via `BuildingBlocks/Logging/LoggingExtensions.cs` to ensure consistency.

### Enriched Properties
Every log entry automatically includes:
*   `ApplicationName`: The name of the microservice (e.g., `CoreSupply.Ordering.API`).
*   `MachineName`: The container ID (useful for scaling).
*   `CorrelationId`: To trace a request across multiple services (Gateway -> Basket -> Ordering).
*   `Environment`: (Development/Production).

### Example Log Entry (JSON)
```json
{
  "@t": "2025-12-01T10:00:00.000Z",
  "@l": "Information",
  "@m": "Order created successfully with Id: 8fd735d4...",
  "ApplicationName": "CoreSupply.Ordering.API",
  "OrderId": "8fd735d4-6e95-4873-0241-08de31278fd0",
  "UserId": "Abdollah"
}
```

---

## 📊 Performance Monitoring

We use a custom `LoggingBehavior` in the MediatR pipeline to automatically track slow requests.

*   **Threshold:** Any command taking > 3 seconds.
*   **Level:** Warning.
*   **Message:** `[PERFORMANCE] The command CreateOrderCommand took 5 seconds`.

This allows us to set up alerts in Seq to notify the team immediately when performance degrades.

---

## 🛠️ How to Access Logs

1.  Ensure the stack is running: `docker-compose up -d`.
2.  Open the **Seq Dashboard**: `http://localhost:5340`.
3.  Login with default credentials (or the ones set in docker-compose).

### Useful Seq Queries
*   **Find all errors:** `ToHexString(@l) = 'Error'`
*   **Trace a specific user:** `UserId = 'Abdollah'`
*   **Find slow queries:** `TimeTaken > 3000`
```

---