from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_root_endpoint():
    response = client.get("/")

    assert response.status_code == 200
    assert response.json() == {
        "application": "SentinelOps API",
        "status": "running",
    }


def test_health_endpoint():
    response = client.get("/health")

    assert response.status_code == 200

    data = response.json()
    assert data["status"] == "healthy"
    assert "timestamp" in data


def test_application_info_endpoint():
    response = client.get("/api/v1/info")

    assert response.status_code == 200
    assert response.json() == {
        "name": "SentinelOps",
        "version": "1.0.0",
        "purpose": "Secure DevSecOps demonstration",
    }


def test_unknown_endpoint_returns_404():
    response = client.get("/this-endpoint-does-not-exist")

    assert response.status_code == 404
