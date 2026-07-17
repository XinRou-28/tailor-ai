from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_digest_returns_items():

    response = client.get("/api/digest")

    assert response.status_code == 200

    data = response.json()

    assert "date" in data
    assert "count" in data
    assert "items" in data

    assert isinstance(data["items"], list)