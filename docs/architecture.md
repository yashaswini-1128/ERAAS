# ERAAS Architecture

This document describes the upgraded ERAAS system architecture using the C4 Container Model.

## Context and Container Diagram

```mermaid
graph TD
    User([Emergency Dispatcher]) -->|HTTPS / WSS| WebApp[Dashboard - Single Page App]
    SensorFeed([Mock Incident Feed]) -->|HTTP POST /simulate| API[FastAPI Web Server]
    
    subgraph "ERAAS Backend Container"
        API -->|JSON/REST| DB[(SQLite / PostgreSQL)]
        API -->|WebSockets| WebApp
        
        AgentLoop[Agent Loop Process] -->|Polls Unclassified| DB
        AgentLoop -->|Classifies & Allocates| Agent[Gemini AI Agent]
        AgentLoop -->|Writes State & Logs| DB
    end

    Agent -->|Gemini API| GeminiService[Google AI Studio / Vertex AI]
```

## Upgraded Components

1. **Configuration Management**: Uses `pydantic-settings` to enforce schema validation on startup for environmental variables like `DATABASE_URL` and `GOOGLE_API_KEY`.
2. **Database Layer**: Standardized SQLAlchemy 2.0-style declarative mapping with optimal connection pooling configurations, maintained in `database.py`.
3. **Observability & Logging**: Centralized logging via `loguru`. The API features a custom Starlette Middleware to inject a unique `X-Correlation-ID` across HTTP requests and contextual thread execution.
4. **Agentic Core Hardening**: The agent integration uses `pydantic` schemas natively mapped to the Gemini API's structured JSON output mode, removing fragile regex-based parsing. The core loop features exponential backoff retry-and-recovery handlers.
5. **Automated Testing Suite**: A robust `pytest` suite tests LLM response parsing, allocation routing algorithms, and API endpoints ensuring no regressions occur in production environments.
