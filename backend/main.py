"""
main.py
-------
The FastAPI application: REST endpoints for the dashboard to read incident
data, a WebSocket endpoint that pushes live updates every few seconds, and
a human-in-the-loop override endpoint so a dispatcher can change an
incident's status regardless of what the agent decided.

Run with:
    uvicorn backend.main:app --reload
Then open:
    http://127.0.0.1:8000/            (dashboard)
    http://127.0.0.1:8000/docs        (interactive API docs)
"""

import asyncio
import datetime
from typing import Optional
from pathlib import Path

from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from models import AuditLog, Incident, SessionLocal, init_db
from mock_feed import generate_incident
from agent_loop import process_new_incidents
from logger import correlation_id, logger
import uuid
import jwt
import os

SECRET_KEY = os.environ.get("JWT_SECRET", "super-secret-key-for-eraas-prod")
ALGORITHM = "HS256"

class LoginRequest(BaseModel):
    username: str
    password: str
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from typing import List

app = FastAPI(title="ERAAS API")

# --- WebSocket Connection Manager ---
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast_json(self, data: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(data)
            except:
                pass

manager = ConnectionManager()

class CorrelationIdMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        req_id = request.headers.get("X-Correlation-ID", str(uuid.uuid4()))
        token = correlation_id.set(req_id)
        
        logger.info(f"Incoming request: {request.method} {request.url.path}")
        try:
            response = await call_next(request)
            response.headers["X-Correlation-ID"] = req_id
            return response
        except Exception as e:
            logger.error(f"Error handling request: {e}")
            raise
        finally:
            correlation_id.reset(token)

app.add_middleware(CorrelationIdMiddleware)

# Allow the frontend (even if served from a different port during dev) to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

FRONTEND_DIR = Path(__file__).resolve().parent.parent / "frontend"
app.mount("/static", StaticFiles(directory=str(FRONTEND_DIR)), name="static")


async def run_agent_loop():
    logger.info("Starting embedded AI Agent loop...")
    while True:
        try:
            # Run in a threadpool so it doesn't block the FastAPI event loop
            await asyncio.to_thread(process_new_incidents)
        except Exception as e:
            logger.error(f"Embedded agent loop error: {e}")
        await asyncio.sleep(5)

@app.on_event("startup")
async def on_startup():
    init_db()
    asyncio.create_task(run_agent_loop())


@app.get("/")
def serve_dashboard():
    return FileResponse(str(FRONTEND_DIR / "index.html"))


def _incident_to_dict(incident: Incident) -> dict:
    return {
        "id": incident.id,
        "description": incident.description,
        "incident_type": incident.incident_type,
        "latitude": incident.latitude,
        "longitude": incident.longitude,
        "severity": incident.severity,
        "reasoning": incident.reasoning,
        "recommended_unit": incident.recommended_unit,
        "priority": incident.priority,
        "eta_minutes": incident.eta_minutes,
        "status": incident.status,
        "created_at": incident.created_at.isoformat() if incident.created_at else None,
    }


@app.post("/login")
def login(body: LoginRequest):
    """
    Secure backend authentication endpoint.
    Verifies credentials and returns a JWT token for the dashboard.
    """
    if body.username == "admin" and body.password == "1234":
        token = jwt.encode({"sub": "admin"}, SECRET_KEY, algorithm=ALGORITHM)
        return {"token": token}
    raise HTTPException(status_code=401, detail="Invalid credentials")


@app.get("/incidents")
def list_incidents():
    """All incidents, most recent first -- used for the initial dashboard load."""
    db = SessionLocal()
    try:
        incidents = db.query(Incident).order_by(Incident.created_at.desc()).all()
        return [_incident_to_dict(i) for i in incidents]
    finally:
        db.close()


@app.post("/incidents/simulate")
def simulate_incident():
    """
    Creates one random incident on demand -- the same generator mock_feed.py
    uses on its timer, exposed here so the dashboard's "Simulate Incident"
    button can inject a fresh incident instantly, without waiting for the
    random 5-15s interval. Handy for live demos: click the button, watch
    the agent classify it a few seconds later.
    """
    incident = generate_incident()
    return _incident_to_dict(incident)

class SOSRequest(BaseModel):
    type: str = "general" # fire, accident, medical, general
    lat: Optional[float] = None
    lon: Optional[float] = None

@app.post("/sos/trigger")
async def trigger_sos_broadcast(body: SOSRequest):
    """
    Called by the mobile civilian portal when a specific emergency button is pressed.
    Broadcasts the SOS signal to ALL connected dashboards so they all flash red and siren.
    Also creates a new mock incident based on the type.
    """
    incident = generate_incident()
    
    # Customize based on payload
    em_type = body.type.lower()
    if em_type == 'fire':
        incident.description = "MASSIVE FIRE REPORTED VIA CIVILIAN PORTAL"
        incident.incident_type = "fire"
        incident.severity = "Critical"
    elif em_type == 'accident':
        incident.description = "SEVERE MULTI-VEHICLE ACCIDENT REPORTED"
        incident.incident_type = "road accident"
        incident.severity = "High"
    elif em_type == 'medical':
        incident.description = "URGENT MEDICAL EMERGENCY (CARDIAC ARREST)"
        incident.incident_type = "medical emergency"
        incident.severity = "Critical"
    else:
        incident.severity = "Critical"
        incident.description = "URGENT SOS PANIC SIGNAL RECEIVED"
        incident.incident_type = "sos_panic"
        
    # Override location if provided by the civilian's phone GPS
    if body.lat is not None and body.lon is not None:
        incident.latitude = body.lat
        incident.longitude = body.lon
    
    # Broadcast to all connected clients instantly
    await manager.broadcast_json({
        "type": "SOS_TRIGGER", 
        "incident": _incident_to_dict(incident),
        "emergency_type": em_type
    })
    
    return {"ok": True}


@app.get("/incidents/{incident_id}")
def get_incident(incident_id: int):
    db = SessionLocal()
    try:
        incident = db.query(Incident).get(incident_id)
        if incident is None:
            raise HTTPException(status_code=404, detail="Incident not found")
        return _incident_to_dict(incident)
    finally:
        db.close()


class OverrideRequest(BaseModel):
    new_status: str          # "dispatched" | "pending_review" | "resolved"
    dispatcher_name: str = "duty_dispatcher"
    note: str = ""


@app.post("/incidents/{incident_id}/override")
def override_incident(incident_id: int, body: OverrideRequest):
    """
    Human-in-the-loop override (Objective 7): a dispatcher can change an
    incident's status regardless of what the agent decided. Every override
    is written to the audit log.
    """
    db = SessionLocal()
    try:
        incident = db.query(Incident).get(incident_id)
        if incident is None:
            raise HTTPException(status_code=404, detail="Incident not found")

        old_status = incident.status
        incident.status = body.new_status
        incident.updated_at = datetime.datetime.utcnow()

        db.add(AuditLog(
            incident_id=incident.id,
            actor=f"dispatcher:{body.dispatcher_name}",
            action="override_status",
            detail=f"{old_status} -> {body.new_status}. Note: {body.note}",
        ))
        db.commit()
        return {"ok": True, "incident": _incident_to_dict(incident)}
    finally:
        db.close()


@app.get("/audit-log")
def get_audit_log(limit: int = 100):
    db = SessionLocal()
    try:
        entries = (
            db.query(AuditLog)
            .order_by(AuditLog.timestamp.desc())
            .limit(limit)
            .all()
        )
        return [
            {
                "id": e.id,
                "incident_id": e.incident_id,
                "actor": e.actor,
                "action": e.action,
                "detail": e.detail,
                "timestamp": e.timestamp.isoformat(),
            }
            for e in entries
        ]
    finally:
        db.close()


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """Pushes the full incident list to the dashboard every few seconds."""
    await manager.connect(websocket)
    try:
        while True:
            db = SessionLocal()
            try:
                incidents = db.query(Incident).order_by(Incident.created_at.desc()).all()
                await websocket.send_json({"type": "INCIDENT_UPDATE", "data": [_incident_to_dict(i) for i in incidents]})
            finally:
                db.close()
            await asyncio.sleep(3)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
