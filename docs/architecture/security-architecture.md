# 🔒 Security Architecture & Identity Management

> Security is not an afterthought; it's baked into the core of CoreSupply.

This document outlines how we handle Authentication (Who are you?), Authorization (What can you do?), and Secrets Management in a distributed microservices environment.

---

## 🏗️ Identity Service (The Security Center)

We have a dedicated microservice (`CoreSupply.Identity.API`) responsible for all user management. No other service touches the user database directly.

### Key Features
*   **ASP.NET Core Identity:** Industry-standard library for user management.
*   **PostgreSQL:** Robust storage for user credentials and roles.
*   **JWT (JSON Web Tokens):** Stateless authentication mechanism signed with HMAC-SHA256.

---

## 🔄 Secure Token Flow (RefreshToken Pattern)

To balance security and user experience, we implement the **Refresh Token Rotation** pattern. This is critical for preventing token theft.

### The Workflow
1.  **Login:** User sends credentials.
    *   Server returns:
        *   `AccessToken` (Short-lived: 15 mins).
        *   `RefreshToken` (Long-lived: 7 days, stored in DB).
2.  **Access Resource:** Client sends `AccessToken` in Header.
3.  **Token Expired:** Client gets `401 Unauthorized`.
4.  **Refresh:** Client sends expired `AccessToken` + `RefreshToken` to `/refresh-token`.
5.  **Rotation:** Server validates DB record, invalidates the old RefreshToken, and issues a **NEW pair** (Access + Refresh).

### Why this is secure?
*   If an `AccessToken` is stolen, it expires quickly.
*   If a `RefreshToken` is stolen, it can be revoked by the admin (or automatic reuse detection).

---

## 🛡️ Authorization (RBAC)

We use **Role-Based Access Control**.
*   **Claims:** The JWT contains claims like `Role: Admin` or `Role: User`.
*   **Enforcement:** Each microservice (e.g., Ordering API) validates the token signature and checks claims using `[Authorize(Roles = "Admin")]`.
*   **Shared Secret:** Services share the validation key securely via Environment Variables.

---

## 🔐 Secrets Management Strategy

We follow the **12-Factor App** methodology for configuration.

### 🚫 No Hardcoded Secrets
*   `appsettings.json` contains only placeholders (e.g., `[SECRET_LOADED_FROM_ENV]`).
*   `docker-compose.yml` uses variable substitution (e.g., `${DB_PASSWORD}`).

### ✅ Environment Variables
*   **Local Dev:** Secrets are loaded from a `.env` file (which is git-ignored).
*   **Production:** Secrets are injected via the container orchestrator (Kubernetes Secrets / Azure Key Vault).

### 🛡️ Git Security
*   The `.env` file is strictly excluded via `.gitignore`.
*   Git history is clean of any sensitive data.


