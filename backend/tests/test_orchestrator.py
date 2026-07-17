from __future__ import annotations

import sys
from pathlib import Path

CURRENT_FILE = Path(__file__).resolve()
BACKEND_DIR = CURRENT_FILE.parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.engine.recommendation_engine import recommend  # noqa: E402
from app.models.db import Account, SessionLocal  # noqa: E402
from app.models.schemas import AccountDetail, ScoreResult  # noqa: E402
from app.models.scoring_model import score  # noqa: E402
from app.orchestrator import load_account, process_account  # noqa: E402


def load_all_accounts() -> list[Account]:
    session = SessionLocal()
    try:
        accounts = session.query(Account).order_by(Account.customer_id).all()
        for account in accounts:
            session.expunge(account)
        return accounts
    finally:
        session.close()


def find_account_by_confidence(predicate) -> Account:
    for account in load_all_accounts():
        if predicate(score(account).confidence):
            return account
    raise AssertionError("No account found matching the requested confidence condition.")


def test_normal_account_runs_full_pipeline() -> None:
    account = load_all_accounts()[0]
    detail = process_account(account.customer_id)

    assert isinstance(detail, AccountDetail)
    assert detail.account.customer_id == account.customer_id
    assert detail.score.customer_id == account.customer_id
    assert detail.recommendation.customer_id == account.customer_id
    assert detail.decision.customer_id == account.customer_id
    assert detail.notification is not None
    assert detail.notification.customer_id == account.customer_id
    assert detail.notification.headline
    assert detail.notification.body
    assert detail.notification.cta_label


def test_investigation_skipped_outside_confidence_band() -> None:
    account = find_account_by_confidence(lambda confidence: not (0.5 <= confidence <= 0.75))
    detail = process_account(account.customer_id)

    assert detail.score.investigated is False
    assert detail.score.reason_code == score(account).reason_code


def test_investigation_triggered_inside_confidence_band() -> None:
    account = find_account_by_confidence(lambda confidence: 0.5 <= confidence <= 0.75)
    detail = process_account(account.customer_id)

    assert detail.score.investigated is True
    assert 0.5 <= detail.score.confidence <= 0.75


def test_recommendation_depends_on_reason_code() -> None:
    account = load_all_accounts()[0]
    onboarding_score = ScoreResult(
        customer_id=account.customer_id,
        health_score=50.0,
        confidence=0.9,
        risk_level="Medium",
        top_reasons=["test reason"],
        reason_code="feature_unused_onboarding_gap",
        investigated=True,
        scored_at="2026-07-17T00:00:00Z",
    )
    api_score = ScoreResult(
        customer_id=account.customer_id,
        health_score=50.0,
        confidence=0.9,
        risk_level="Medium",
        top_reasons=["test reason"],
        reason_code="usage_exceeds_limit_api",
        investigated=False,
        scored_at="2026-07-17T00:00:00Z",
    )

    onboarding_recommendation = recommend(account, onboarding_score)
    api_recommendation = recommend(account, api_score)

    assert onboarding_recommendation.action_type == "offer_onboarding"
    assert api_recommendation.action_type == "upgrade"
    assert onboarding_recommendation.reason_code == "feature_unused_onboarding_gap"
    assert api_recommendation.reason_code == "usage_exceeds_limit_api"


def test_decision_tier_returned() -> None:
    account = load_all_accounts()[0]
    detail = process_account(account.customer_id)

    assert detail.decision.tier in {"auto_send", "csm_review", "manual_investigation"}