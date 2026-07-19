"""
agent_loop.py
-------------
Runs the continuous Perceive -> Reason -> Act -> Reflect loop:

  PERCEIVE : poll the database for incidents the agent hasn't classified yet
  REASON   : call agent.classify_incident() to get a severity + rationale
  ACT      : call allocation.recommend_allocation() and update the incident
  REFLECT  : happens implicitly -- any incident that gets touched again
             (e.g. a dispatcher override, or new info) is picked up and
             re-evaluated on a later pass

Run this in its own terminal, alongside mock_feed.py and main.py:
    python backend/agent_loop.py
"""

import time
import traceback

from agent import classify_incident
from allocation import recommend_allocation
from models import AuditLog, Incident, SessionLocal, init_db
from logger import logger

POLL_INTERVAL_SECONDS = 5
MAX_RETRIES = 3


def process_new_incidents():
    """One pass of PERCEIVE -> REASON -> ACT over all unclassified incidents."""
    db = SessionLocal()
    try:
        new_incidents = (
            db.query(Incident).filter(Incident.severity == "unclassified").all()
        )

        for incident in new_incidents:
            success = False
            for attempt in range(MAX_RETRIES):
                try:
                    # REASON
                    result = classify_incident(incident.description, incident.incident_type)
                    incident.severity = result["severity"]
                    incident.reasoning = result["reasoning"]

                    # ACT
                    allocation = recommend_allocation(incident, result["severity"])
                    incident.recommended_unit = allocation["unit"]
                    incident.priority = allocation["priority"]
                    incident.eta_minutes = allocation["eta_minutes"]

                    # Critical/High get auto-dispatched; Medium/Low wait for a
                    # dispatcher to confirm (mirrors the synopsis's severity table)
                    incident.status = (
                        "dispatched" if result["severity"] in ("Critical", "High")
                        else "pending_review"
                    )

                    db.add(AuditLog(
                        incident_id=incident.id,
                        actor="agent",
                        action="classified_and_allocated",
                        detail=(
                            f"severity={result['severity']} unit={allocation['unit']} "
                            f"reasoning={result['reasoning']}"
                        ),
                    ))

                    logger.info(
                        f"[AGENT] Incident #{incident.id} -> {result['severity']} "
                        f"-> {allocation['unit']} (ETA {allocation['eta_minutes']} min)"
                    )
                    success = True
                    break

                except ValueError as exc:
                    # Classification failed to parse -- log it and break retry
                    logger.error(f"[AGENT] Failed to classify incident #{incident.id}: {exc}")
                    break
                except Exception as exc:
                    logger.warning(f"[AGENT] API error on incident #{incident.id}, attempt {attempt + 1}: {exc}")
                    time.sleep(2 ** attempt)

            if not success:
                logger.error(f"[AGENT] Giving up on incident #{incident.id} after {MAX_RETRIES} attempts.")

        db.commit()
    except Exception as e:
        logger.error(f"[AGENT_LOOP] Fatal error processing incidents: {e}\n{traceback.format_exc()}")
        db.rollback()
    finally:
        db.close()


def run_loop(poll_seconds: int = POLL_INTERVAL_SECONDS):
    print("Agent loop started. Press Ctrl+C to stop.\n")
    while True:
        process_new_incidents()
        time.sleep(poll_seconds)


if __name__ == "__main__":
    init_db()
    try:
        run_loop()
    except KeyboardInterrupt:
        print("\nAgent loop stopped.")
