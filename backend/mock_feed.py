"""
mock_feed.py
------------
Simulates the "Perception Layer" from the synopsis: IoT sensors, call
centres, and social media feeds. In production these would be real
integrations (Kafka topics, webhook receivers, etc.); here we generate
realistic-looking incidents on a timer so the rest of the pipeline has
something to react to.

Run this in its own terminal, alongside agent.py and main.py:
    python backend/mock_feed.py
"""

import random
import time

from models import Incident, SessionLocal, init_db

INCIDENT_TYPES = ["fire", "road accident", "medical emergency", "flooding", "gas leak"]

# Replace with a bounding box around your own city for a more convincing demo.
# This box roughly covers central Bengaluru.
LAT_RANGE = (12.90, 13.05)
LON_RANGE = (77.55, 77.70)

ZONE_NAMES = [
    "Zone 1 - MG Road", "Zone 2 - Whitefield", "Zone 3 - Koramangala",
    "Zone 4 - Indiranagar", "Zone 5 - Jayanagar", "Zone 6 - Hebbal",
    "Zone 7 - Electronic City", "Zone 8 - Yeshwanthpur",
]

DESCRIPTION_TEMPLATES = {
    "fire": "Fire reported at a {building} in {zone}",
    "road accident": "Multi-vehicle collision reported on the main road in {zone}",
    "medical emergency": "Medical emergency call received from a resident in {zone}",
    "flooding": "Street flooding reported near {zone} after heavy rain",
    "gas leak": "Gas leak reported at a {building} in {zone}",
}
BUILDINGS = ["residential complex", "commercial building", "warehouse", "market area", "school"]


def generate_incident() -> Incident:
    """Create and persist one random incident, returning the saved row."""
    incident_type = random.choice(INCIDENT_TYPES)
    zone = random.choice(ZONE_NAMES)
    description = DESCRIPTION_TEMPLATES[incident_type].format(
        building=random.choice(BUILDINGS), zone=zone
    )

    db = SessionLocal()
    try:
        incident = Incident(
            description=description,
            latitude=round(random.uniform(*LAT_RANGE), 6),
            longitude=round(random.uniform(*LON_RANGE), 6),
            incident_type=incident_type,
        )
        db.add(incident)
        db.commit()
        db.refresh(incident)
        return incident
    finally:
        db.close()


def run_feed(min_interval_sec: int = 5, max_interval_sec: int = 15):
    """Continuously generate incidents at random intervals, forever."""
    print("Mock incident feed started. Press Ctrl+C to stop.\n")
    while True:
        incident = generate_incident()
        print(f"[NEW INCIDENT #{incident.id}] ({incident.incident_type}) {incident.description}")
        time.sleep(random.randint(min_interval_sec, max_interval_sec))

if __name__ == "__main__":
    init_db()
    try:
        run_feed(min_interval_sec=15, max_interval_sec=30)
    except KeyboardInterrupt:
        print("\nMock feed stopped.")
