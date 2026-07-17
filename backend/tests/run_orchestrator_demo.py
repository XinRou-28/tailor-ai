from __future__ import annotations

import sys
from pathlib import Path


CURRENT_FILE = Path(__file__).resolve()
BACKEND_DIR = CURRENT_FILE.parents[1]

if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))


from app.orchestrator import process_account


def main():
    customer_id = "acc_0001"

    print("=" * 60)
    print("TAILOR AI PIPELINE DEMO")
    print("=" * 60)

    print(f"\nProcessing account: {customer_id}\n")

    result = process_account(customer_id)

    # Account
    print("ACCOUNT")
    print("-" * 60)
    print(f"Customer ID       : {result.account.customer_id}")
    print(f"Company           : {result.account.company_name}")
    print(f"Current Plan      : {result.account.current_plan}")
    print(f"Monthly Revenue   : ${result.account.monthly_revenue}")
    print(f"Renewal Date      : {result.account.contract_renewal_date}")


    # Scoring
    print("\nSCORING RESULT")
    print("-" * 60)
    print(f"Health Score      : {result.score.health_score}")
    print(f"Confidence        : {result.score.confidence}")
    print(f"Risk Level        : {result.score.risk_level}")
    print(f"Reason Code       : {result.score.reason_code}")
    print(f"Investigated      : {result.score.investigated}")

    print("\nTop Reasons:")
    for reason in result.score.top_reasons:
        print(f"  - {reason}")


    # Recommendation
    print("\nRECOMMENDATION")
    print("-" * 60)
    print(f"Action            : {result.recommendation.action_type}")
    print(f"Reason Code       : {result.recommendation.reason_code}")
    print(f"Price Delta       : ${result.recommendation.price_delta}")

    print("Line Items:")
    for item in result.recommendation.line_items:
        print(f"  - {item}")


    # Decision
    print("\nTRUST DECISION")
    print("-" * 60)
    print(f"Decision Tier     : {result.decision.tier}")
    print(f"Rationale         : {result.decision.rationale}")
    print(f"Decided At        : {result.decision.decided_at}")


    # Notification
    print("\nNOTIFICATION")
    print("-" * 60)
    print(result.notification)


    print("\n" + "=" * 60)
    print("PIPELINE COMPLETED")
    print("=" * 60)


if __name__ == "__main__":
    main()