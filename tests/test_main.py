from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_root_endpoint():
    response = client.get("/")

    assert response.status_code == 200
    assert "text/html" in response.headers["content-type"]
    assert "SentinelOps" in response.text
    assert "Secure every build." in response.text


def test_health_endpoint():
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json()["status"] == "healthy"
    assert "timestamp" in response.json()


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


def test_frontend_css_is_available():
    response = client.get("/static/css/style.css")

    assert response.status_code == 200
    assert "text/css" in response.headers["content-type"]


def test_frontend_javascript_is_available():
    response = client.get("/static/js/app.js")

    assert response.status_code == 200
    assert "checkApiHealth" in response.text
