from fastapi import APIRouter
from collections import Counter

from app.models.db import Account, SessionLocal
from app.orchestrator import process_account_lite
from app.features.insights_copy import get_ai_pulse

router = APIRouter(prefix="/api")


@router.get("/insights")
def get_insights() -> dict[str, object]:

    session = SessionLocal()

    try:
        accounts = (
            session.query(Account)
            .order_by(Account.customer_id)
            .all()
        )

        reason_counter = Counter()
        tier_counter = Counter()
        confidence_sum = 0.0

        for account in accounts:
            detail = process_account_lite(account.customer_id)
            reason_counter[detail.score.reason_code] += 1
            confidence_sum += detail.score.confidence
            if detail.score.risk_level in ("Medium", "High"):
                tier_counter[account.current_plan] += 1

        total = len(accounts)
        affected_tier = tier_counter.most_common(1)[0][0] if tier_counter else "N/A"
        avg_confidence = round(confidence_sum / total, 4) if total else 0.0

        reasons = []

        for reason, count in reason_counter.most_common():
            reasons.append(
                {
                    "reason_code": reason,
                    "label": reason.replace("_", " ").title(),
                    "count": count,
                    "pct": round(
                        count / total * 100,
                        2
                    )
                }
            )

        ai_copy = get_ai_pulse(reasons)

        return {
            "generated_at": "2026-07-17T00:00:00Z",
            "total_accounts": total,
            "top_reasons": reasons,
            "ai_pulse": ai_copy["pulse"],
            "ai_strategy": ai_copy["strategy"],
            "affected_tier": affected_tier,
            "avg_confidence": avg_confidence,
        }

    finally:
        session.close()