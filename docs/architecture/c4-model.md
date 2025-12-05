# Architecture Diagrams (C4 Model)

## Level 1: System Context
```mermaid
C4Context
  title System Context Diagram
  Person(customer, "Customer", "Industrial Buyer")
  System(core, "CoreSupply", "B2B Platform")
  System_Ext(payment, "Payment Gateway", "Stripe/PayPal")
  
  Rel(customer, core, "Uses")
  Rel(core, payment, "Processes payments")
