from __future__ import annotations

import sys
from datetime import date, timedelta
from pathlib import Path

CURRENT_FILE = Path(__file__).resolve()
BACKEND_DIR = CURRENT_FILE.parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.decision.trust_layer import decide  # noqa: E402
from app.models.db import Account  # noqa: E402
from app.models.schemas import Decision, ScoreResult  # noqa: E402


TODAY = date.today()


def make_account(*, customer_id: str = "acc_test", monthly_revenue: float = 29.0, renewal_days: int = 60) -> Account:
    return Account(
        customer_id=customer_id,
        company_name="Test Company",
        current_plan="Starter",
        seats_purchased=5,
        seats_active=5,
        monthly_revenue=monthly_revenue,
        contract_renewal_date=(TODAY + timedelta(days=renewal_days)).isoformat(),
    )


def make_score(customer_id: str, confidence: float) -> ScoreResult:
    return ScoreResult(
        customer_id=customer_id,
        health_score=50.0,
        confidence=confidence,
        risk_level="Medium",
        top_reasons=["test reason"],
        reason_code="feature_unused_not_needed",
        investigated=False,
        scored_at="2026-07-17T00:00:00Z",
    )


def test_manual_investigation_below_confidence_threshold() -> None:
    account = make_account(monthly_revenue=29.0, renewal_days=60)
    decision = decide(account, make_score(account.customer_id, 0.49))

    assert isinstance(decision, Decision)
    assert decision.tier == "manual_investigation"


def test_auto_send_above_high_confidence_threshold_for_normal_revenue() -> None:
    account = make_account(monthly_revenue=29.0, renewal_days=60)
    decision = decide(account, make_score(account.customer_id, 0.86))

    assert decision.tier == "auto_send"


def test_csm_review_for_high_revenue_customer_even_with_high_confidence() -> None:
    account = make_account(monthly_revenue=299.0, renewal_days=60)
    decision = decide(account, make_score(account.customer_id, 0.92))

    assert decision.tier == "csm_review"


def test_csm_review_for_medium_confidence_customer() -> None:
    account = make_account(monthly_revenue=29.0, renewal_days=60)
    decision = decide(account, make_score(account.customer_id, 0.60))

    assert decision.tier == "csm_review"


def test_boundary_confidence_exactly_point_five_is_csm_review() -> None:
    account = make_account(monthly_revenue=29.0, renewal_days=60)
    decision = decide(account, make_score(account.customer_id, 0.50))

    assert decision.tier == "csm_review"


def test_boundary_confidence_exactly_point_eight_five_is_csm_review() -> None:
    account = make_account(monthly_revenue=29.0, renewal_days=60)
    decision = decide(account, make_score(account.customer_id, 0.85))

    assert decision.tier == "csm_review"


def test_renewal_exactly_thirty_days_out_triggers_csm_review() -> None:
    account = make_account(monthly_revenue=29.0, renewal_days=30)
    decision = decide(account, make_score(account.customer_id, 0.90))

    assert decision.tier == "csm_review"


def test_normal_revenue_customer_with_high_confidence_auto_sends() -> None:
    account = make_account(monthly_revenue=29.0, renewal_days=60)
    decision = decide(account, make_score(account.customer_id, 0.90))

    assert decision.tier == "auto_send"


def test_trust_layer_reads_revenue_and_renewal_only_here() -> None:
    source = Path(BACKEND_DIR / "app" / "decision" / "trust_layer.py").read_text(encoding="utf-8")
    assert "monthly_revenue" in source
    assert "contract_renewal_date" in source