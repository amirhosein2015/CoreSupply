
# 🛡️ Resilience & Fault Tolerance Strategy

> "Everything fails, all the time." — Werner Vogels, CTO Amazon

In a distributed microservices architecture like CoreSupply, network glitches and database timeouts are not anomalies; they are expected behaviors. This document details how we use **Polly** to make our system robust.

---

## 🎯 Resilience Policies

We apply different policies depending on the operation type (Database vs HTTP).

### 1. Database Connectivity (EF Core + Polly)
**Target:** SQL Server (Ordering), PostgreSQL (Identity).

**Problem:** Transient errors (e.g., network blip, database failover) cause immediate crash.
**Solution:** `EnableRetryOnFailure` execution strategy.

*   **Policy:** Exponential Backoff Retry.
*   **Config:**
    *   **Max Retries:** 10 attempts.
    *   **Max Delay:** 30 seconds.
    *   **Logic:** Automatically detects transient SQL error codes.

**Implementation:**
Located in `Program.cs`:
```csharp
sqlOptions.EnableRetryOnFailure(
    maxRetryCount: 10, 
    maxRetryDelay: TimeSpan.FromSeconds(30), 
    errorNumbersToAdd: null);
```

---

### 2. Service-to-Service Communication (HTTP Circuit Breaker)
**Target:** Communication between `Ordering.API` and `Catalog.API`.

**Problem:** If Catalog service is down, Ordering service shouldn't hammer it with requests (Cascading Failure).
**Solution:** Circuit Breaker Pattern.

*   **Policy:** Break the circuit after failures.
*   **Config:**
    *   **Threshold:** 5 consecutive errors.
    *   **Break Duration:** 30 seconds (Open state).
    *   **Reset:** Half-Open state to test if service is back.

**Implementation:**
```csharp
builder.Services.AddHttpClient("CatalogClient")
    .AddTransientHttpErrorPolicy(p => 
        p.CircuitBreakerAsync(5, TimeSpan.FromSeconds(30)));
```

---

## 🚦 Failure Scenarios Handling

| Scenario | Component | System Behavior | User Experience |
| :--- | :--- | :--- | :--- |
| **SQL Server Restart** | Ordering API | Retries the query for up to 30s. | Request takes longer but succeeds (200 OK). |
| **RabbitMQ Down** | MassTransit | Internal buffer holds messages + Retry. | Message delivered once broker is up. |
| **Catalog Service Down** | Gateway | Circuit Breaker Opens. | Fast failure (503) instead of hanging timeout. |

---

## 📊 Monitoring Resilience
All Polly events (Retry triggered, Circuit Broken) are logged to **Seq** with `Warning` level, allowing us to visualize system stability over time.
```

---
