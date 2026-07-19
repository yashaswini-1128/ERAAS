import pytest
from allocation import recommend_allocation
from models import Incident

def test_recommend_allocation_critical():
    incident = Incident(latitude=40.7, longitude=-74.0, incident_type="fire")
    result = recommend_allocation(incident, "Critical")
    assert result["priority"] == 1
    assert "unit" in result
    assert "eta_minutes" in result

def test_recommend_allocation_high():
    incident = Incident(latitude=40.7, longitude=-74.0, incident_type="accident")
    result = recommend_allocation(incident, "High")
    assert result["priority"] == 2

def test_recommend_allocation_medium():
    incident = Incident(latitude=40.7, longitude=-74.0, incident_type="flooding")
    result = recommend_allocation(incident, "Medium")
    assert result["priority"] == 3

def test_recommend_allocation_low():
    incident = Incident(latitude=40.7, longitude=-74.0, incident_type="noise")
    result = recommend_allocation(incident, "Low")
    assert result["priority"] == 4
