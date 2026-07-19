from __future__ import annotations

from datetime import datetime, timezone

from app.models.db import Account
from app.models.schemas import Decision, ScoreResult


HIGH_REVENUE_THRESHOLD = 299.0
NEAR_TERM_RENEWAL_DAYS = 30
HIGH_CONFIDENCE_THRESHOLD = 0.85
LOW_CONFIDENCE_THRESHOLD = 0.5


def _parse_date(date_text: str) -> datetime:
    return datetime.fromisoformat(date_text)


def _days_until_renewal(account: Account) -> int:
    renewal_date = _parse_date(account.contract_renewal_date)
    today = datetime.now(timezone.utc).date()
    return (renewal_date.date() - today).days


def _has_high_stakes(account: Account) -> bool:
    return (
        account.monthly_revenue >= HIGH_REVENUE_THRESHOLD
        or _days_until_renewal(account) <= NEAR_TERM_RENEWAL_DAYS
    )


def decide(account: Account, score: ScoreResult) -> Decision:
    if score.confidence < LOW_CONFIDENCE_THRESHOLD:
        tier = "manual_investigation"
        rationale = "Low confidence requires manual investigation"
    elif _has_high_stakes(account):
        tier = "csm_review"
        rationale = "High revenue or near-term renewal requires CSM review"
    elif score.confidence > HIGH_CONFIDENCE_THRESHOLD:
        tier = "auto_send"
        rationale = "High confidence and low/medium stakes can auto-send"
    else:
        tier = "csm_review"
        rationale = "Medium confidence uses CSM review"

    decided_at = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
    return Decision(
        customer_id=account.customer_id,
        tier=tier,
        rationale=rationale,
        decided_at=decided_at,
    )