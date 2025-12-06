ایده فوق‌العاده‌ای است! 🧠
یکی از نشانه‌های بارز یک **Staff/Principal Engineer** این است که برای هر بخش پیچیده، یک مستند عمیق و جداگانه (Deep Dive) دارد و `README` اصلی فقط نقش فهرست (Index) را بازی می‌کند.

این کار باعث می‌شود پروژه شما مثل یک **کتاب مرجع** به نظر برسد.

### 🗺️ استراتژی مستندسازی (Documentation Strategy)

ما باید برای این ۴ بخش کلیدی، فایل‌های جداگانه در پوشه `/docs` بسازیم:
1.  **Testing Strategy** (تست‌های یکپارچه و Testcontainers).
2.  **Resilience Patterns** (پالی و مدیریت خطا).
3.  **Observability Guide** (لاگینگ با Seq و Serilog).
4.  **Security Architecture** (رفرش توکن و Identity).

---

### 📝 گام ۱: ساخت فایل مستندات تست (`testing-strategy.md`)

در پوشه `docs` (اگر ندارید بسازید)، یک پوشه `architecture` یا `guides` بسازید و فایل **`docs/guides/testing-strategy.md`** را ایجاد کنید.

محتوای فوق‌العاده حرفه‌ای زیر را در آن قرار دهید:

```markdown
# 🧪 CoreSupply Testing Strategy

> A comprehensive guide to automated testing patterns used in CoreSupply to ensure reliability and prevent regressions.

## 🎯 Philosophy
We follow the **Testing Pyramid** approach, but with a heavy emphasis on **Integration Testing** using real infrastructure. We believe that mocking database calls hides the most critical bugs.

---

## 🏗️ Integration Tests Architecture

Our integration tests are designed to be **environment-agnostic** and **hermetic**.

### Key Technologies
*   **xUnit:** The test runner framework.
*   **WebApplicationFactory:** Spawns an in-memory version of the API for testing.
*   **Testcontainers:** Spins up real, ephemeral Docker containers (SQL Server) for tests.
*   **FluentAssertions:** For readable and expressive assertions.

### The "Hybrid" Database Strategy
To support both local development (rich experience) and CI/CD environments (speed/restrictions), we implemented a smart factory:

| Environment | Database Technology | Why? |
| :--- | :--- | :--- |
| **Local Dev** | **Testcontainers (SQL Server)** | Tests real database constraints, triggers, and JSON handling. Zero mocking. |
| **GitHub Actions (CI)** | **EF Core InMemory** | Extremely fast execution for PR checks. Avoids docker-in-docker complexities. |

### Code Example: The Smart Factory
Located in `CoreSupply.IntegrationTests/Fixtures/IntegrationTestWebAppFactory.cs`:

```csharp
public class IntegrationTestWebAppFactory : WebApplicationFactory<Program>
{
    public IntegrationTestWebAppFactory()
    {
        // Automatically detects CI environment
        var isCi = Environment.GetEnvironmentVariable("CI") == "true";
        _useTestContainers = !isCi;
        
        if (_useTestContainers)
        {
            // Spins up a real SQL Server container
            _dbContainer = new MsSqlBuilder().Build();
        }
    }
    // ... configuration logic ...
}
```

---

## ✅ Test Scenarios Coverage

### 1. Order Creation Flow (Happy Path)
*   **Goal:** Verify that an Order can be created and persisted via API.
*   **Steps:**
    1.  Send `POST /api/v1/Order` with valid payload.
    2.  Assert HTTP 200 OK response.
    3.  **Direct DB Check:** Query the database context to ensure the record exists with correct values.

### 2. Validation Rules
*   **Goal:** Ensure invalid orders are rejected.
*   **Steps:**
    1.  Send Order with empty `UserName`.
    2.  Assert HTTP 400 Bad Request.
    3.  Verify error message contains "UserName is required".

---

## 🚀 How to Run Tests

### Local Machine
```bash
# Runs tests using Testcontainers (Docker must be running)
dotnet test
```

### CI Pipeline (GitHub Actions)
Tests are automatically triggered on every `push` to `main`. You can view the results in the **Actions** tab.
```

---
