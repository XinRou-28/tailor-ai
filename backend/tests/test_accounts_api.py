from __future__ import annotations

import sys
from pathlib import Path

from fastapi.testclient import TestClient

CURRENT_FILE = Path(__file__).resolve()
BACKEND_DIR = CURRENT_FILE.parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.main import app  # noqa: E402
from app.orchestrator import process_account as real_process_account  # noqa: E402
from app.models.db import Account as AccountRecord, SessionLocal  # noqa: E402
from app.models.schemas import Account, AccountDetail, Decision, Notification, Recommendation, ScoreResult  # noqa: E402
from app.models.schemas import AccountDetail as AccountDetailSchema  # noqa: E402

client = TestClient(app)


def load_first_customer_id() -> str:
    session = SessionLocal()
    try:
        account = session.query(AccountRecord).order_by(AccountRecord.customer_id).first()
        if account is None:
            raise AssertionError("No SQLite accounts available. Load the dataset first.")
        return account.customer_id
    finally:
        session.close()


def _summary_from_detail(detail: AccountDetailSchema) -> dict[str, object]:
    return {
        "customer_id": detail.account.customer_id,
        "company_name": detail.account.company_name,
        "current_plan": detail.account.current_plan,
        "monthly_revenue": detail.account.monthly_revenue,
        "health_score": detail.score.health_score,
        "risk_level": detail.score.risk_level,
        "tier": detail.decision.tier,
    }


def test_get_account_detail_calls_orchestrator_and_returns_contract_shape(monkeypatch) -> None:
    customer_id = load_first_customer_id()
    called: list[str] = []

    def fake_process_account(received_customer_id: str) -> AccountDetail:
        called.append(received_customer_id)
        return AccountDetail(
            account=Account(
                customer_id=received_customer_id,
                company_name="ABC Company",
                current_plan="Enterprise",
                seats_purchased=100,
                seats_active=38,
                monthly_revenue=299,
                contract_renewal_date="2026-08-03",
            ),
            score=ScoreResult(
                customer_id=received_customer_id,
                health_score=35.0,
                confidence=0.68,
                risk_level="High",
                top_reasons=[
                    "Advanced Analytics unused (0 sessions in 30 days)",
                    "Login frequency down 60% (30d vs 60d)",
                    "3 unresolved support tickets",
                ],
                reason_code="feature_unused_onboarding_gap",
                investigated=True,
                scored_at="2026-07-16T08:00:00Z",
            ),
            recommendation=Recommendation(
                customer_id=received_customer_id,
                action_type="offer_onboarding",
                line_items=["Advanced Analytics onboarding support"],
                price_delta=0.0,
                reason_code="feature_unused_onboarding_gap",
            ),
            decision=Decision(
                customer_id=received_customer_id,
                tier="csm_review",
                rationale="High revenue or near-term renewal requires CSM review",
                decided_at="2026-07-16T09:00:00Z",
            ),
            notification=None,
        )

    monkeypatch.setattr("app.api.accounts.process_account", fake_process_account)

    response = client.get(f"/api/accounts/{customer_id}")

    assert response.status_code == 200
    assert called == [customer_id]
    payload = response.json()
    assert payload["account"]["customer_id"] == customer_id
    assert payload["score"]["reason_code"] == "feature_unused_onboarding_gap"
    assert payload["decision"]["tier"] == "csm_review"
    assert payload["notification"] is None


def test_get_account_detail_returns_404_for_missing_account() -> None:
    response = client.get("/api/accounts/acc_missing")

    assert response.status_code == 404
    assert response.json() == {
        "error": {
            "code": "not_found",
            "message": "Account acc_missing not found",
        }
    }


def test_get_accounts_uses_real_pipeline_values(monkeypatch) -> None:
    customer_id = load_first_customer_id()
    calls: list[str] = []

    def spy_process_account(received_customer_id: str) -> AccountDetailSchema:
        calls.append(received_customer_id)
        if received_customer_id == customer_id:
            return real_process_account(received_customer_id)

        return AccountDetail(
            account=Account(
                customer_id=received_customer_id,
                company_name="Stub Company",
                current_plan="Starter",
                seats_purchased=5,
                seats_active=5,
                monthly_revenue=29,
                contract_renewal_date="2026-08-03",
            ),
            score=ScoreResult(
                customer_id=received_customer_id,
                health_score=10.0,
                confidence=0.91,
                risk_level="Low",
                top_reasons=["stub reason"],
                reason_code="feature_unused_not_needed",
                investigated=False,
                scored_at="2026-07-16T08:00:00Z",
            ),
            recommendation=Recommendation(
                customer_id=received_customer_id,
                action_type="downgrade",
                line_items=["Downgrade to Starter"],
                price_delta=-70.0,
                reason_code="feature_unused_not_needed",
            ),
            decision=Decision(
                customer_id=received_customer_id,
                tier="auto_send",
                rationale="High confidence and low/medium stakes can auto-send",
                decided_at="2026-07-16T09:00:00Z",
            ),
            notification=None,
        )

    monkeypatch.setattr("app.api.accounts.process_account", spy_process_account)

    response = client.get("/api/accounts")

    assert response.status_code == 200
    assert customer_id in calls
    payload = response.json()
    first_summary = next(item for item in payload["accounts"] if item["customer_id"] == customer_id)
    assert first_summary == _summary_from_detail(real_process_account(customer_id))


def test_get_accounts_returns_empty_collection_when_database_is_empty(monkeypatch) -> None:
    class FakeQuery:
        def order_by(self, *args, **kwargs):
            return self

        def all(self):
            return []

    class FakeSession:
        def query(self, *args, **kwargs):
            return FakeQuery()

        def close(self):
            return None

    monkeypatch.setattr("app.api.accounts.SessionLocal", lambda: FakeSession())

    called: list[str] = []

    def should_not_run(customer_id: str):
        called.append(customer_id)
        raise AssertionError("process_account should not be called for an empty database")

    monkeypatch.setattr("app.api.accounts.process_account", should_not_run)

    response = client.get("/api/accounts")

    assert response.status_code == 200
    assert response.json() == {"accounts": [], "total": 0}
    assert called == []
