import pytest
from models import Incident

def test_get_incidents_empty(client):
    response = client.get("/incidents")
    assert response.status_code == 200
    assert response.json() == []

def test_simulate_incident(client):
    response = client.post("/incidents/simulate")
    assert response.status_code == 200
    data = response.json()
    assert "id" in data
    assert "description" in data
    assert data["severity"] == "unclassified"

def test_get_incident_by_id(client):
    sim_res = client.post("/incidents/simulate")
    incident_id = sim_res.json()["id"]

    res = client.get(f"/incidents/{incident_id}")
    assert res.status_code == 200
    assert res.json()["id"] == incident_id

def test_override_incident(client):
    sim_res = client.post("/incidents/simulate")
    incident_id = sim_res.json()["id"]

    override_data = {
        "new_status": "dispatched",
        "dispatcher_name": "Test Dispatcher",
        "note": "Testing override"
    }
    res = client.post(f"/incidents/{incident_id}/override", json=override_data)
    assert res.status_code == 200
    assert res.json()["ok"] is True
    assert res.json()["incident"]["status"] == "dispatched"
