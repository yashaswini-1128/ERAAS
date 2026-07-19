"""
allocation.py
-------------
The ACT step of the loop: given a classified incident, recommend which
unit to dispatch and with what priority/ETA. 
Upgraded to use real geospatial routing via the public OSRM API to find the 
closest available responder unit in the city limits.
"""

import urllib.request
import json
from loguru import logger
from models import Incident

# Maps incident type -> the unit type that should respond
UNIT_MAP = {
    "fire": "Fire Engine",
    "road accident": "Ambulance + Traffic Response Unit",
    "medical emergency": "Ambulance",
    "flooding": "NDRF-style Rescue Team",
    "gas leak": "Hazmat Team",
}

# Lower number = higher priority (dispatched first)
SEVERITY_PRIORITY = {"Critical": 1, "High": 2, "Medium": 3, "Low": 4}

# Mock database of emergency responder units in Bengaluru.
# In a real production system, this would be queried from a database with PostGIS geometry.
UNITS_DB = [
    {"id": "F1", "name": "Central Fire Station F1", "type": "Fire Engine", "lat": 12.9716, "lon": 77.5946},
    {"id": "F2", "name": "Whitefield Fire Station F2", "type": "Fire Engine", "lat": 12.9698, "lon": 77.7499},
    {"id": "F3", "name": "Jayanagar Fire Station F3", "type": "Fire Engine", "lat": 12.9250, "lon": 77.5938},
    {"id": "A1", "name": "MG Road Hospital A1", "type": "Ambulance", "lat": 12.9750, "lon": 77.6070},
    {"id": "A2", "name": "Electronic City Hospital A2", "type": "Ambulance", "lat": 12.8452, "lon": 77.6601},
    {"id": "A3", "name": "Hebbal Hospital A3", "type": "Ambulance", "lat": 13.0354, "lon": 77.5988},
    {"id": "T1", "name": "Central Traffic Unit T1", "type": "Ambulance + Traffic Response Unit", "lat": 12.9710, "lon": 77.5940},
    {"id": "T2", "name": "Outer Ring Road Traffic Unit T2", "type": "Ambulance + Traffic Response Unit", "lat": 12.9250, "lon": 77.6338},
    {"id": "R1", "name": "Indiranagar Rescue Station R1", "type": "NDRF-style Rescue Team", "lat": 12.9784, "lon": 77.6408},
    {"id": "R2", "name": "Yeshwanthpur Rescue Station R2", "type": "NDRF-style Rescue Team", "lat": 13.0285, "lon": 77.5410},
    {"id": "H1", "name": "Central Hazmat Team H1", "type": "Hazmat Team", "lat": 12.9710, "lon": 77.5940},
    {"id": "H2", "name": "North Hazmat Team H2", "type": "Hazmat Team", "lat": 13.0354, "lon": 77.5988},
]

def _get_driving_eta(start_lon: float, start_lat: float, end_lon: float, end_lat: float) -> float:
    """
    Calls the public OSRM routing API to get the real driving time between two coordinates.
    Returns ETA in minutes.
    """
    url = f"http://router.project-osrm.org/route/v1/driving/{start_lon},{start_lat};{end_lon},{end_lat}?overview=false"
    req = urllib.request.Request(url, headers={'User-Agent': 'ERAAS-Dispatch-Engine/1.0'})
    try:
        with urllib.request.urlopen(req, timeout=2.0) as response:
            data = json.loads(response.read().decode())
            if data.get("code") == "Ok" and len(data["routes"]) > 0:
                duration_seconds = data["routes"][0]["duration"]
                return duration_seconds / 60.0
    except Exception as e:
        logger.warning(f"OSRM routing API failed ({e}). Falling back to spatial estimation.")
    
    # Fallback heuristic: very rough straight-line Euclidean distance * factor
    # 1 degree lat/lon is roughly 111km. Assume 30km/h average city speed -> 2 min per km.
    dist_deg = ((start_lon - end_lon)**2 + (start_lat - end_lat)**2)**0.5
    dist_km = dist_deg * 111.0
    return dist_km * 2.0


def recommend_allocation(incident: Incident, severity: str) -> dict:
    """
    Allocates the closest available unit using geospatial routing via OSRM.
    """
    required_type = UNIT_MAP.get(incident.incident_type, "General Response Unit")
    priority = SEVERITY_PRIORITY.get(severity, 4)
    
    # Find all units capable of handling this incident type
    candidates = [u for u in UNITS_DB if u["type"] == required_type]
    
    best_unit = None
    best_eta_minutes = float('inf')
    
    if candidates:
        logger.info(f"Routing {len(candidates)} candidates for incident #{incident.id}...")
        for c in candidates:
            # Query the routing engine for true driving time
            eta = _get_driving_eta(c["lon"], c["lat"], incident.longitude, incident.latitude)
            if eta < best_eta_minutes:
                best_eta_minutes = eta
                best_unit = c
                
    if best_unit:
        unit_name = best_unit["name"]
        final_eta = max(1, int(round(best_eta_minutes)))
    else:
        # Fallback if no matching unit type exists
        unit_name = required_type + " (Fallback)"
        final_eta = priority * 4

    return {
        "unit": unit_name,
        "priority": priority,
        "eta_minutes": final_eta,
    }


def resolve_zone_conflicts(pending_incidents: list[Incident]) -> list[Incident]:
    """
    Sorts incidents so the most urgent gets resources first.
    """
    return sorted(pending_incidents, key=lambda inc: SEVERITY_PRIORITY.get(inc.severity, 4))
