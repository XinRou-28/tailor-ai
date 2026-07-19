from fastapi import APIRouter

from app.models.db import Account, SessionLocal
from app.orchestrator import process_account_lite

router = APIRouter(prefix="/api")


@router.get("/digest")
def get_digest() -> dict[str, object]:

    session = SessionLocal()

    try:
        accounts = (
            session.query(Account)
            .order_by(Account.customer_id)
            .all()
        )

        items = []

        for account in accounts:

            detail = process_account_lite(account.customer_id)

            # only show accounts needing attention
            if detail.decision.tier != "auto_send":

                items.append(
                    {
                        "customer_id": detail.account.customer_id,
                        "company_name": detail.account.company_name,
                        "risk_level": detail.score.risk_level,
                        "reason": detail.score.reason_code,
                        "recommendation": detail.recommendation.action_type,
                        "decision_tier": detail.decision.tier,
                    }
                )


        return {
            "date": "2026-07-17",
            "count": len(items),
            "items": items,
        }


    finally:
        session.close()