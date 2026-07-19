"""
models.py
---------
Defines the Incident table (our simplified version of the "Perception Layer"
data store) and sets up a SQLite database engine + session factory.

For the full synopsis-spec version, swap the `create_engine` connection
string for a PostgreSQL URL, e.g.:
    create_engine("postgresql://user:password@localhost:5432/eraas")
"""

import datetime

from sqlalchemy.orm import Mapped, mapped_column
from database import Base, SessionLocal, engine, init_db


class Incident(Base):
    """A single emergency incident, from creation through resolution."""

    __tablename__ = "incidents"

    id: Mapped[int] = mapped_column(primary_key=True)
    description: Mapped[str]
    latitude: Mapped[float]
    longitude: Mapped[float]
    incident_type: Mapped[str]  # fire, accident, medical, flooding, gas leak...

    severity: Mapped[str] = mapped_column(default="unclassified")     # Critical / High / Medium / Low
    reasoning: Mapped[str] = mapped_column(default="")                 # why the agent chose this severity
    recommended_unit: Mapped[str] = mapped_column(default="")
    priority: Mapped[int] = mapped_column(default=4)
    eta_minutes: Mapped[int] = mapped_column(default=0)

    status: Mapped[str] = mapped_column(default="new")  # new -> dispatched / pending_review -> resolved
    created_at: Mapped[datetime.datetime] = mapped_column(default=datetime.datetime.utcnow)
    updated_at: Mapped[datetime.datetime] = mapped_column(
        default=datetime.datetime.utcnow,
        onupdate=datetime.datetime.utcnow
    )


class AuditLog(Base):
    """Every status change (agent-driven or human override) gets logged here."""

    __tablename__ = "audit_log"

    id: Mapped[int] = mapped_column(primary_key=True)
    incident_id: Mapped[int]
    actor: Mapped[str]         # "agent" or "dispatcher"
    action: Mapped[str]        # e.g. "classified", "override_status"
    detail: Mapped[str] = mapped_column(default="")
    timestamp: Mapped[datetime.datetime] = mapped_column(default=datetime.datetime.utcnow)


# --- Backwards compatibility check ------------------------------------------

if __name__ == "__main__":
    init_db()
    from config import settings
    print(f"Database initialized at {settings.database_url}")
