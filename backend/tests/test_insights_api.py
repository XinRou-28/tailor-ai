from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_insights_returns_real_distribution():

    response = client.get("/api/insights")

    assert response.status_code == 200

    data = response.json()

    assert "top_reasons" in data

    assert data["total_accounts"] > 0

    assert len(data["top_reasons"]) > 0

    assert "pct" in data["top_reasons"][0]