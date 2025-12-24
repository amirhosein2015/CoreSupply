# ADR 0003: Industrial Command-Center UI Architecture

## Status
Accepted

## Context
The platform targets the B2B industrial sector (Manufacturing/Logistics). A standard e-commerce UI (like Amazon) does not meet the needs of an operations operator who requires high data density and real-time monitoring.

## Decision
We implemented a **Cyber-Industrial UI** using React 18, TypeScript, and a custom-engineered Material UI theme with zero-border-radius and high-contrast telemetry.

## Rationale (Why?)
1. **Domain Alignment:** The UI reflects the "Mission-Critical" nature of the backend (Sagas and Microservices).
2. **Operational Efficiency:** High-density DataGrids and real-time "Heartbeat" monitors allow operators to spot system anomalies instantly.
3. **Professionalism:** For the DACH/Netherlands market, a specialized industrial look conveys reliability and technical depth.

## Consequences
- **Pros:** Unique brand identity, improved focus on logistics data.
- **Cons:** Requires more custom CSS/Theming work compared to standard templates.
