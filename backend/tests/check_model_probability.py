from app.models.db import Account, SessionLocal
from app.models.scoring_model import score


session = SessionLocal()

accounts = session.query(Account).limit(20).all()


for account in accounts:

    result = score(account)

    print(
        account.customer_id,
        "confidence=",
        result.confidence,
        "risk=",
        result.risk_level,
        "reason=",
        result.reason_code
    )


session.close()