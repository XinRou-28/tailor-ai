from fastapi import APIRouter
from collections import Counter

from app.models.db import Account, SessionLocal
from app.orchestrator import process_account


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

        for account in accounts:
            detail = process_account(account.customer_id)

            reason_counter[
                detail.score.reason_code
            ] += 1


        total = len(accounts)


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


        return {
            "generated_at": "2026-07-17T00:00:00Z",
            "total_accounts": total,
            "top_reasons": reasons,
        }

    finally:
        session.close()