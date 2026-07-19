from app.models.db import Account, SessionLocal
from app.models.scoring_model import score
from app.decision.trust_layer import decide


session = SessionLocal()

accounts = session.query(Account).all()

print("Total accounts:", len(accounts))

confidence_bins = {
    "<0.5": 0,
    "0.5-0.75": 0,
    "0.75-0.85": 0,
    ">0.85": 0,
}

tiers = {
    "manual_investigation": 0,
    "csm_review": 0,
    "auto_send": 0,
}


for account in accounts:
    result = score(account)

    c = result.confidence

    if c < 0.5:
        confidence_bins["<0.5"] += 1
    elif c <= 0.75:
        confidence_bins["0.5-0.75"] += 1
    elif c <= 0.85:
        confidence_bins["0.75-0.85"] += 1
    else:
        confidence_bins[">0.85"] += 1


    decision = decide(account, result)
    tiers[decision.tier] += 1


print("\nConfidence distribution:")
for k,v in confidence_bins.items():
    print(k, ":", v)


print("\nDecision distribution:")
for k,v in tiers.items():
    print(k, ":", v)


session.close()