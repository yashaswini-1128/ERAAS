import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from sqlalchemy.pool import StaticPool
from database import Base

SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(autouse=True)
def patch_sessionlocal(monkeypatch):
    import main
    import models
    import agent_loop
    import mock_feed
    monkeypatch.setattr(main, "SessionLocal", TestingSessionLocal)
    monkeypatch.setattr(models, "SessionLocal", TestingSessionLocal)
    monkeypatch.setattr(agent_loop, "SessionLocal", TestingSessionLocal)
    monkeypatch.setattr(mock_feed, "SessionLocal", TestingSessionLocal)

@pytest.fixture(autouse=True)
def test_db():
    import models  # Ensure models are imported so Base has metadata
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def client():
    from main import app
    with TestClient(app) as c:
        yield c
