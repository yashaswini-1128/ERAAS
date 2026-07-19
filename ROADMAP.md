# ERAAS — Professional Upgrade Roadmap

This roadmap takes you from "working prototype" to "production-grade platform". Each section includes effort estimate, tech choices, and why it matters for a professional review/viva.

## 1. Architecture & System Design (Highest ROI)

| Upgrade | Why | Tech / Pattern | Effort |
| :--- | :--- | :--- | :--- |
| Event-Driven Core | Decouple ingestion, classification, allocation, notification. Enables replay, scaling, multi-consumer. | Apache Kafka / Redpanda (local via Docker) or NATS JetStream (lighter). Topics: incidents.raw, incidents.classified, incidents.allocated, audit.log. | Medium |
| CQRS + Event Sourcing | Audit log becomes source of truth; read models (dashboard, reports) projected asynchronously. | Kafka + Kafka Streams / Flink or EventStoreDB. | High |
| Domain-Driven Design (DDD) | Replace anemic models with rich aggregates: Incident, DispatchUnit, Zone. Encapsulate business rules. | Python: eventsourcing lib or manual aggregates + repositories. | Medium |
| Multi-Tenancy / Agency Support | Real dispatch centers serve multiple agencies (Fire, EMS, Police) with separate rules. | agency_id on every entity; policy engine per agency. | Medium |
| Plugin Architecture for Allocators | Swap rule-based → OR-Tools → ML optimizer without touching core loop. | Strategy Pattern + Entry Points (setuptools.entry_points). | Low |

## 2. AI / Agentic Layer (The "Agentic" Differentiator)

| Upgrade | Why | Implementation |
| :--- | :--- | :--- |
| LangGraph / LangChain Agent | Explicit Perceive→Reason→Act→Reflect graph with state, retries, human-in-the-loop nodes, observability. | Replace agent_loop.py with StateGraph; nodes: fetch_new, classify_llm, allocate, persist, notify. |
| Structured Output + Validation | Guarantee schema compliance; auto-retry on parse failure. | Instructor (Pydantic) or google-genai response_schema (already used) + Pydantic v2 validation. |
| RAG for Contextual Reasoning | LLM sees relevant SOPs, zone hazards, unit capabilities → better recommendations. | Chroma / pgvector + embeddings of SOPs; retrieve top-k per incident type/zone. |
| Multi-Agent Swarm | Specialist agents: TriageAgent, FireDispatchAgent, EMSDispatchAgent, SupervisorAgent. | LangGraph Send API or AutoGen / CrewAI for handoffs. |
| Feedback Loop / Online Learning | Capture dispatcher overrides → fine-tune / few-shot prompt tuning nightly. | Store (incident, agent_decision, human_override) → nightly DSPy / OpenAI fine-tune / Gemini prompt optimization. |
| Explainability Dashboard | Show why (attention, retrieved docs, rule scores) not just reasoning string. | SHAP for rule scores; LangSmith / Langfuse for LLM traces. |

## 3. Backend Hardening (FastAPI → Production)

| Area | Current | Professional Standard |
| :--- | :--- | :--- |
| Database | SQLite (file) | PostgreSQL 16+ + PostGIS (geo queries), asyncpg + SQLAlchemy 2.0 async. |
| Migrations | create_all | Alembic (versioned, reviewable, CI-gated). |
| AuthZ/AuthN | None | OAuth2/OIDC (Keycloak / Auth0 / Dex) + RBAC (Dispatcher, Supervisor, Admin, Auditor). |
| API Layer | Raw FastAPI | FastAPI + Pydantic v2 + OpenAPI 3.1 + Generated TypeScript client (openapi-typescript-codegen). |
| Rate Limiting / Quotas | None | SlowAPI (Redis-backed) per role/IP. |
| Observability | print / logging | OpenTelemetry (traces, metrics, logs) → Grafana Tempo + Loki + Prometheus; Sentry for errors. |
| Background Jobs | asyncio loop | Celery + Redis/RabbitMQ or Dramatiq (retries, DLQ, scheduling, priority queues). |
| Configuration | .env | Pydantic Settings + 1Password / Vault / AWS Secrets Manager; feature flags (Unleash / LaunchDarkly). |
| Testing | None | pytest + pytest-asyncio (unit), Testcontainers (integration), Locust (load), Contract tests (Pact). |

## 4. Frontend — From "Dashboard" to "Dispatch Console"

| Upgrade | Stack / Approach | Impact |
| :--- | :--- | :--- |
| Build System | Vite + React 18 + TypeScript + Tailwind | Type safety, HMR, tree-shaking, code-splitting, PWA. |
| State Management | TanStack Query (React Query) + Zustand/Jotai | Server state caching, optimistic updates, deduping; global UI state. |
| Real-time | Socket.io (fallback, rooms, ack) or Native WS + TanStack Query useQuery + subscribe | Reliable reconnection, presence, multi-tab sync. |
| Map | MapLibre GL / Mapbox GL JS + Protocol Buffers (MVT) | Vector tiles, 60fps, custom styles, clustering, 3D, offline. |
| Components | Radix UI / shadcn-ui + Tailwind | Accessible (WAI-ARIA), composable, dark mode, theming. |
| Forms | React Hook Form + Zod | Validation, performance, DX. |
| Testing | Vitest (unit), Playwright (e2e), Storybook (visual regression) | CI confidence. |
| PWA / Offline | Workbox + IndexedDB (Dexie) | Works in dead zones; sync on reconnect. |
| Accessibility | axe-core in CI, eslint-plugin-jsx-a11y | Legal compliance (Section 508 / WCAG 2.1 AA). |
| Internationalization | i18next | Multi-language dispatch centers. |

## 5. GIS & Routing (Core Domain)

| Feature | Library / Service | Note |
| :--- | :--- | :--- |
| Real Routing ETA | OSRM (self-hosted Docker) or Valhalla | /route/v1/driving/{lon,lat};{lon,lat}?overview=false |
| Turn-by-Turn Navigation | MapLibre Navigation SDK or OSRM + Mapbox GL Directions | For mobile unit MDTs. |
| Zone / Polygon Management | PostGIS + GeoJSON admin UI | Draw zones, station coverage, hazard polygons. |
| Live Traffic | TomTom / HERE / Mapbox Traffic (paid) or OpenTraffic (free) | Dynamic ETA adjustment. |
| AVL (Automatic Vehicle Location) | MQTT (units publish GPS) → Kafka → PostGIS + WebSocket | Real-time unit tracking on map. |

## 6. DevOps & Platform Engineering

| Layer | Tooling | Goal |
| :--- | :--- | :--- |
| Containerization | Dockerfile (multi-stage) + docker-compose.yml (dev) + Helm charts (K8s) | Reproducible builds, local parity. |
| CI/CD | GitHub Actions / GitLab CI → ArgoCD / Flux (GitOps) | Automated test → build → scan → deploy. |
| Secrets | Sealed Secrets / External Secrets Operator | No secrets in git. |
| Infrastructure | Terraform / OpenTofu (AWS/GCP/Azure) | Versioned infra. |
| Service Mesh | Istio / Linkerd (mTLS, retries, canary) | Zero-trust network. |
| Logging | Vector / Fluent Bit → Loki / Elastic | Structured JSON logs, correlation IDs. |
| Metrics | Prometheus + Grafana (RED + USE dashboards) | SLO/SLI alerting. |
| Tracing | OpenTelemetry Collector → Tempo / Jaeger | End-to-end latency breakdown. |
| Chaos Engineering | LitmusChaos / Gremlin | Validate resilience. |

## 7. Security & Compliance (Non-Negotiable for Real Deployments)

| Control | Implementation |
| :--- | :--- |
| Data Classification | Tag PII (caller name, address) → Encryption at rest (TDE) + in transit (TLS 1.3). |
| Audit Integrity | Immutable append-only log (WORM S3 / CloudTrail / Trillian / Qldb). |
| Access Control | ABAC (attribute-based) via OPA (Open Policy Agent) + Cedar. |
| Vulnerability Management | Trivy / Grype in CI; Dependabot / Renovate auto-PR. |
| Pen Testing | Annual OWASP ZAP scan + manual review. |
| Incident Response | Runbooks (runbook.md) + PagerDuty / Opsgenie integration. |
| Compliance Mapping | NIST 800-53 / CJIS / GDPR control matrix in docs. |

## 8. Product Features (Dispatcher-Centric)

| Feature | User Story | Complexity |
| :--- | :--- | :--- |
| Multi-Incident Triage View | "Show me all Critical + High side-by-side with unit recommendations." | Low |
| Pre-Plan / Run Cards | "Auto-load hydrant locations, building floor plans, hazmat sheets for this address." | Medium |
| Unit Status Mobile App | Firefighter sees "En Route → On Scene" button; GPS auto-updates. | Medium (React Native / Flutter + Capacitor). |
| CAD Integration | Import NENA NG9-1-1 / NIEM / EDXL feeds. | High (standard parsing). |
| Inter-Agency Mutual Aid | "Request Engine from neighboring county; auto-validate capabilities." | High (federated auth + policy). |
| After-Action Report Generator | One-click PDF: timeline, decisions, audio transcripts, maps. | Medium (Jinja2 + WeasyPrint). |
| Predictive Staffing | "Next Tue 14:00: 30% more cardiac calls → suggest +1 ALS unit." | Medium (Prophet / Chronos + scheduler). |

## 9. Suggested 3-Month "Professionalize" Sprint Plan

| Sprint | Focus | Deliverable |
| :--- | :--- | :--- |
| 0 | Foundation | Repo restructure (monorepo: apps/api, apps/web, libs/shared), PostgreSQL + PostGIS + Alembic, Docker Compose dev stack, GitHub Actions CI (lint, typecheck, test, build). |
| 1 | Auth + API Hardening | OIDC (Keycloak), RBAC, Rate limiting, OpenAPI spec + TS client, Structured logging + Correlation IDs, Unit/Integration tests (80%+). |
| 2 | Event-Driven Core | Kafka (Redpanda) topics, Producer/Consumer services, Outbox Pattern for DB→Kafka reliability, Dead Letter Queue handling. |
| 3 | Agentic Upgrade | LangGraph loop, RAG (SOPs), Langfuse tracing, Human-in-the-loop node (pause graph → UI modal → resume). |
| 4 | Frontend Rewrite | Vite + TS + React Query + shadcn-ui, MapLibre GL + Vector Tiles, Real-time WS + Optimistic Updates, PWA + Offline Queue. |
| 5 | GIS & Routing | OSRM self-hosted, PostGIS zones, AVL (MQTT sim), Turn-by-turn for units. |
| 6 | Observability & Hardening | OpenTelemetry → Grafana Stack, Load Test (Locust 500 concurrent), Chaos Tests, Security Scan (Trivy, OWASP ZAP), Runbooks. |
| 7 | Compliance & Docs | ADR log, Architecture diagrams (C4 model), Threat Model (STRIDE), API Docs (Redocly), User/Operator Manuals. |

## 10. Immediate "Weekend Wins" (Do These First)

| Task | Time | Value |
| :--- | :--- | :--- |
| Add Alembic + PostgreSQL + docker-compose.yml | 2 hrs | Real DB, migrations, team dev parity. |
| Wrap agent_loop.py in Dramatiq actor + Redis | 1 hr | Retries, visibility, scaling. |
| Add Pydantic Settings + .env.example with validation | 30 min | Config professionalism. |
| Integrate Loguru + JSON logs + correlation-id middleware | 1 hr | Debuggability. |
| Write 5 unit tests (classification, allocation, override) | 2 hrs | CI gate. |
| Create C4 Context/Container diagrams (Mermaid) | 1 hr | Architecture credibility. |
| Add Sentry SDK (free tier) | 15 min | Error visibility. |
| Enable Dependabot + CodeQL | 5 min | Supply chain security. |

## 11. How to Pitch This in Your Viva/Report

"The prototype demonstrates the agentic loop end-to-end. The roadmap above shows exactly how each component maps to production-grade patterns: event-driven architecture for resilience, LangGraph for observable agent reasoning, PostGIS/OSRM for domain-correct geospatial logic, and a full observability stack for SLO-driven operations. Every 'TODO' in the codebase has a corresponding ticket in this plan with tech selection rationale."

## 12. Recommended Reading / Standards

| Domain | Reference |
| :--- | :--- |
| Emergency Services | NENA NG9-1-1 i3 Standard, NFPA 1221, NIEM IEPD |
| Agentic AI | LangGraph Docs, "Building LLM Applications for Production" (Huyen Chip), DSPy Paper |
| Architecture | Enterprise Integration Patterns (Hohpe/Woolf), Designing Event-Driven Systems (Ben Stopford) |
| Observability | Google SRE Book (Ch. 6, 7), OpenTelemetry Spec |
| Security | OWASP Top 10, NIST 800-53 Rev 5, CJIS Security Policy upgrade |
