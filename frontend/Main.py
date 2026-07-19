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
from pathlib import Path

from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from models import AuditLog, Incident, SessionLocal, init_db
from mock_feed import generate_incident

app = FastAPI(title="ERAAS API")

# Allow the frontend (even if served from a different port during dev) to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

FRONTEND_DIR = Path(__file__).resolve().parent.parent / "frontend"
app.mount("/static", StaticFiles(directory=str(FRONTEND_DIR)), name="static")


@app.on_event("startup")
def on_startup():
    init_db()


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
    await websocket.accept()
    try:
        while True:
            db = SessionLocal()
            try:
                incidents = db.query(Incident).order_by(Incident.created_at.desc()).all()
                await websocket.send_json([_incident_to_dict(i) for i in incidents])
            finally:
                db.close()
            await asyncio.sleep(3)
    except WebSocketDisconnect:
        pass