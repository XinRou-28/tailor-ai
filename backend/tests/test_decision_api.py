from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_record_decision():
    response = client.post(
        "/api/accounts/acc_0001/decision",
        json={
            "outcome":"approve"
        }
    )

    assert response.status_code == 200

    data=response.json()

    assert data["customer_id"]=="acc_0001"
    assert data["outcome"]=="approve"