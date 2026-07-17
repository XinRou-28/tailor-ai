from fastapi import APIRouter
from fastapi.responses import JSONResponse

from app.orchestrator import process_account
from app.models.db import Account, Decision, SessionLocal
from app.models.schemas import AccountDetail

router = APIRouter(prefix="/api")


def _account_to_dict(account: Account) -> dict[str, object]:
    return {
        "customer_id": account.customer_id,
        "company_name": account.company_name,
        "current_plan": account.current_plan,
        "seats_purchased": account.seats_purchased,
        "seats_active": account.seats_active,
        "monthly_revenue": account.monthly_revenue,
        "contract_renewal_date": account.contract_renewal_date,
    }


def _account_summary_from_detail(detail: AccountDetail) -> dict[str, object]:
    return {
        "customer_id": detail.account.customer_id,
        "company_name": detail.account.company_name,
        "current_plan": detail.account.current_plan,
        "monthly_revenue": detail.account.monthly_revenue,
        "health_score": detail.score.health_score,
        "risk_level": detail.score.risk_level,
        "tier": detail.decision.tier,
    }


@router.get("/accounts")
def get_accounts() -> dict[str, object]:
    session = SessionLocal()
    try:
        accounts = session.query(Account).order_by(Account.customer_id).all()
        summaries = [
            _account_summary_from_detail(process_account(account.customer_id))
            for account in accounts
        ]
        return {
            "accounts": summaries,
            "total": len(summaries),
        }
    finally:
        session.close()


@router.get("/accounts/{customer_id}")
def get_account_detail(customer_id: str) -> AccountDetail:
    session = SessionLocal()
    try:
        account = session.query(Account).filter(Account.customer_id == customer_id).first()
        if account is None:
            return JSONResponse(
                status_code=404,
                content={
                    "error": {
                        "code": "not_found",
                        "message": f"Account {customer_id} not found",
                    }
                },
            )
    finally:
        session.close()

    return process_account(customer_id)


@router.post("/accounts/{customer_id}/decision")
def record_decision(
    customer_id: str,
    payload: dict[str, str],
) -> dict[str, object]:

    session = SessionLocal()

    try:
        account = (
            session.query(Account)
            .filter(Account.customer_id == customer_id)
            .first()
        )

        if account is None:
            return JSONResponse(
                status_code=404,
                content={
                    "error": {
                        "code": "not_found",
                        "message": f"Account {customer_id} not found",
                    }
                },
            )


        outcome = payload.get("outcome")

        if outcome not in [
            "approve",
            "decline",
        ]:
            return JSONResponse(
                status_code=400,
                content={
                    "error": {
                        "code": "invalid_outcome",
                        "message": "Outcome must be approve or decline",
                    }
                },
            )


        decision = Decision(
            customer_id=customer_id,
            tier="manual_review",
            rationale=f"CSM selected {outcome}",
            outcome=outcome,
            decided_at="2026-07-17T00:00:00Z",
            recorded_at="2026-07-17T00:00:00Z",
        )


        session.merge(decision)
        session.commit()


        return {
            "customer_id": customer_id,
            "outcome": outcome,
            "recorded_at": decision.recorded_at,
        }


    finally:
        session.close()