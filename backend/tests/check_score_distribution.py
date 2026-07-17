from app.models.db import Account, SessionLocal
from app.models.scoring_model import score


session = SessionLocal()

accounts = session.query(Account).all()

scores = []

for account in accounts:
    result = score(account)
    scores.append(result)


print("Total:", len(scores))


print("\nConfidence:")
for s in scores[:10]:
    print(
        s.customer_id,
        s.confidence,
        s.risk_level,
        s.reason_code
    )


print("\nRisk distribution")

risk = {}

for s in scores:
    risk[s.risk_level] = risk.get(s.risk_level,0)+1


for k,v in risk.items():
    print(k,v)


print("\nReason distribution")

reason={}

for s in scores:
    reason[s.reason_code]=reason.get(s.reason_code,0)+1


for k,v in reason.items():
    print(k,v)


session.close()