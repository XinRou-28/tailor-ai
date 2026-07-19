from __future__ import annotations

import sys
from pathlib import Path

CURRENT_FILE = Path(__file__).resolve()
BACKEND_DIR = CURRENT_FILE.parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.models.db import Account, SessionLocal  # noqa: E402
from app.models.scoring_model import score  # noqa: E402


def load_first_account() -> Account:
    session = SessionLocal()
    try:
        account = session.query(Account).order_by(Account.customer_id).first()
        if account is None:
            raise AssertionError("No accounts found in SQLite. Run backend/app/data/load_data.py first.")
        session.expunge(account)
        return account
    finally:
        session.close()


def test_score_first_account(capsys) -> None:
    account = load_first_account()
    result = score(account)
    print(result)
    captured = capsys.readouterr()
    assert "customer_id='" in captured.out
    assert "health_score=" in captured.out
    assert result.customer_id == account.customer_id
    assert result.health_score > 0
    assert result.confidence > 0
    assert result.top_reasons
    assert result.reason_code in {
        "feature_unused_not_needed",
        "feature_unused_onboarding_gap",
        "feature_unused_support_issue",
        "usage_exceeds_limit_seats",
        "usage_exceeds_limit_api",
        "usage_exceeds_limit_storage",
    }


def main() -> None:
    account = load_first_account()
    result = score(account)
    print("Scoring result for first SQLite account:")
    print(result)


if __name__ == "__main__":
    main()