# ERAAS — Emergency Response Agentic AI System (MVP)

A working prototype of the ERAAS project from `PS186`: a simulated real-time
incident feed, an LLM-driven agent that classifies severity and recommends
resource allocation, and a live map dashboard with human-in-the-loop override.

This is the **scoped-down MVP** described in the build guide — same agentic
concepts as the full synopsis (Perceive → Reason → Act → Reflect, severity
classification, resource allocation, audit trail, human override), built with
tools one person can run locally in a semester, instead of Kafka/Kubernetes.

## Project Structure

```
eraas_project/
├── backend/
│   ├── models.py        # DB tables: Incident, AuditLog
│   ├── mock_feed.py      # PERCEIVE: generates simulated incidents
│   ├── agent.py           # REASON: Gemini-based severity classifier
│   ├── allocation.py       # ACT: resource allocation logic
│   ├── agent_loop.py        # ties REASON + ACT into a continuous loop
│   └── main.py               # FastAPI app: REST + WebSocket + dashboard host
├── frontend/
│   └── index.html              # Leaflet map dashboard, live via WebSocket
├── tests/
│   └── test_*.py               # Automated pytest suite
├── docs/
│   └── architecture.md         # C4 Architecture documentation
├── requirements.txt
├── .env.example
└── README.md
```

## Setup

```bash
# 1. Create and activate a virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Set up your API key
cp .env.example .env
# then edit .env and paste your real Gemini API key
# (get one for free at https://aistudio.google.com -> "Get API key")
```

## Running the Full System

You need **three terminals** open at once, all from the project root
(with the virtual environment activated in each):

**Terminal 1 — the mock incident feed** (simulates sensors/call centres):
```bash
cd backend
python mock_feed.py
```

**Terminal 2 — the agent loop** (classifies + allocates new incidents):
```bash
cd backend
python agent_loop.py
```

**Terminal 3 — the API + dashboard server**:
```bash
uvicorn backend.main:app --reload
```

Then open **http://127.0.0.1:8000/** in your browser. You should see incidents
appear on the map every 5–15 seconds, get color-coded by severity within a
few seconds of appearing (Critical = red, High = orange, Medium = amber,
Low = green), and show the agent's recommended unit + reasoning in the side
panel. Use the **Dispatch** / **Resolve** buttons to test the human override
path — check `GET /audit-log` (via http://127.0.0.1:8000/docs) to see every
decision, agent or human, logged with a timestamp.

## Quick Sanity Checks

Before running the full system, verify each piece works in isolation:

```bash
# 1. Does the database get created correctly?
cd backend && python models.py

# 2. Does your Gemini API key work? (free tier, no card required)
python agent.py
# should print a JSON object with "severity", "reasoning", "recommended_action"
```

## Automated Testing Suite

We provide a robust `pytest` suite covering the LLM agent, allocation logic, and API endpoints.

```bash
# Ensure you are in the project root and venv is activated
pytest backend/tests/
```

## Configuration & Settings
ERAAS uses `pydantic-settings` to validate configuration on startup. Ensure `.env` is populated correctly. The system will fail fast if mandatory settings (like `GOOGLE_API_KEY`) are missing or incorrectly typed.

## Architecture

See [docs/architecture.md](docs/architecture.md) for the C4 context and container diagrams of the upgraded application.

## Where to Go From Here

- **Real routing**: replace the flat `ETA_MINUTES_PER_PRIORITY_LEVEL` estimate
  in `allocation.py` with a real call to OSRM for genuine driving-time ETAs.
- **Multi-zone conflict resolution**: extend `resolve_zone_conflicts()` in
  `allocation.py` into a proper solver when two incidents compete for the
  same unit.
- **Natural language query interface** (Objective 6): add an endpoint that
  takes a dispatcher's plain-English question, and uses the LLM with the
  current incident list as context to answer it.
- **Swap SQLite for PostgreSQL**: change the `DATABASE_URL` in `models.py` —
  everything else stays the same because SQLAlchemy abstracts the database.
- **Swap the mock feed for Kafka**: once you have real sensor/call-centre
  integrations, replace `mock_feed.py`'s loop with a Kafka consumer that
  writes to the same `Incident` table — nothing downstream needs to change.

See `ERAAS_Build_Guide.md` for the full week-by-week build plan this code
maps to.
