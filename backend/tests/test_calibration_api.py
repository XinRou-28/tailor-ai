from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_calibration_returns_model_metrics():

    response = client.get("/api/calibration")

    assert response.status_code == 200

    data = response.json()

    assert "model_metrics" in data
    assert "confusion_matrix" in data

    assert data["model_metrics"]["accuracy"] > 0

    assert data["confusion_matrix"]["labels"] == [
        "churned",
        "downgraded",
        "renewed"
    ]