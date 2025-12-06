# 🔒 Security Architecture & Identity Management

> Security is not an afterthought; it's baked into the core of CoreSupply.

This document outlines how we handle Authentication (Who are you?) and Authorization (What can you do?) in a distributed microservices environment.

---

## 🏗️ Identity Service (The Security Center)

We have a dedicated microservice (`CoreSupply.Identity.API`) responsible for all user management. No other service touches the user database directly.

### Key Features
*   **ASP.NET Core Identity:** Industry-standard library for user management.
*   **PostgreSQL:** Robust storage for user credentials and roles.
*   **JWT (JSON Web Tokens):** Stateless authentication mechanism.

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
*   **Claims:** The JWT contains claims like `Role: Admin` or `Role: Buyer`.
*   **Gateway Enforcement:** The Ocelot Gateway can inspect tokens before forwarding requests (future enhancement).
*   **Service Enforcement:** Each microservice validates the token locally using the shared Secret Key.

---

## 🔐 Secrets Management

*   **Development:** Secrets are stored in `docker-compose.yml` (for ease of setup).
*   **Production:** Secrets must be injected via **Environment Variables** or **Azure Key Vault**.
*   **Database:** Connection strings use standard credentials protection.

