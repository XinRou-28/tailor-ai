from __future__ import annotations

import sys
from pathlib import Path

CURRENT_FILE = Path(__file__).resolve()
BACKEND_DIR = CURRENT_FILE.parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.agents.investigation_agent import investigate, should_investigate  # noqa: E402
from app.decision.trust_layer import decide  # noqa: E402
from app.engine.recommendation_engine import recommend  # noqa: E402
from app.models.db import Account as AccountRecord, SessionLocal  # noqa: E402
from app.models.schemas import Account as AccountSchema  # noqa: E402
from app.models.schemas import AccountDetail, ScoreResult  # noqa: E402
from app.models.scoring_model import score  # noqa: E402
from app.features.copy_generation import generate_customer_copy


def load_account(customer_id: str) -> AccountRecord:
    session = SessionLocal()
    try:
        account = session.query(AccountRecord).filter(AccountRecord.customer_id == customer_id).first()
        if account is None:
            raise LookupError(f"Account {customer_id} not found")
        session.expunge(account)
        return account
    finally:
        session.close()


def _score_with_optional_investigation(account: AccountRecord) -> ScoreResult:
    base_score = score(account)
    if not should_investigate(base_score.confidence):
        return base_score

    reason_override = investigate(account, base_score)
    score_payload = base_score.model_dump() if hasattr(base_score, "model_dump") else base_score.dict()
    score_payload.update(
        {
            "reason_code": reason_override.reason_code,
            "investigated": reason_override.investigated,
        }
    )
    return ScoreResult(**score_payload)


def _to_account_schema(account: AccountRecord) -> AccountSchema:
    return AccountSchema(
        customer_id=account.customer_id,
        company_name=account.company_name,
        current_plan=account.current_plan,
        seats_purchased=account.seats_purchased,
        seats_active=account.seats_active,
        monthly_revenue=account.monthly_revenue,
        contract_renewal_date=account.contract_renewal_date,
    )


def process_account(customer_id: str) -> AccountDetail:
    account = load_account(customer_id)
    account_schema = _to_account_schema(account)
    scored_account = _score_with_optional_investigation(account)
    recommendation = recommend(account, scored_account)
    decision = decide(account, scored_account)

    notification = generate_customer_copy(
        customer_id=account.customer_id,
        customer_name=account.company_name,
        current_plan=account.current_plan,
        recommended_action=recommendation.action_type,
        reason=scored_account.reason_code,
        price_delta=recommendation.price_delta,
    )

    return AccountDetail(
        account=account_schema,
        score=scored_account,
        recommendation=recommendation,
        decision=decision,
        notification=notification,
    )