from __future__ import annotations

import sys
from pathlib import Path

CURRENT_FILE = Path(__file__).resolve()
BACKEND_DIR = CURRENT_FILE.parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.agents.investigation_agent import investigate, should_investigate  # noqa: E402
from app.models.db import Account, SessionLocal  # noqa: E402
from app.models.scoring_model import score  # noqa: E402


def load_accounts() -> list[Account]:
    session = SessionLocal()
    try:
        accounts = session.query(Account).order_by(Account.customer_id).all()
        for account in accounts:
            session.expunge(account)
        return accounts
    finally:
        session.close()


def find_accounts_for_demo(accounts: list[Account]) -> tuple[Account, Account]:
    investigate_account = None
    skip_account = None

    for account in accounts:
        account_score = score(account)
        if investigate_account is None and should_investigate(account_score.confidence):
            investigate_account = account
        if skip_account is None and not should_investigate(account_score.confidence):
            skip_account = account
        if investigate_account is not None and skip_account is not None:
            break

    if investigate_account is None:
        raise AssertionError("No account found in the investigation confidence band.")
    if skip_account is None:
        raise AssertionError("No account found outside the investigation confidence band.")

    return investigate_account, skip_account


def test_investigation_and_skip_paths() -> None:
    investigate_account, skip_account = find_accounts_for_demo(load_accounts())

    investigate_score = score(investigate_account)
    skip_score = score(skip_account)

    investigated = investigate(investigate_account, investigate_score)
    skipped = investigate(skip_account, skip_score)

    assert investigated.investigated is True
    assert investigated.investigated_at is not None
    assert investigated.reason_code in {
        "feature_unused_not_needed",
        "feature_unused_onboarding_gap",
        "feature_unused_support_issue",
    }

    assert skipped.investigated is False
    assert skipped.investigated_at is None
    assert skipped.reason_code == skip_score.reason_code


def main() -> None:
    investigate_account, skip_account = find_accounts_for_demo(load_accounts())

    investigate_score = score(investigate_account)
    skip_score = score(skip_account)

    print("Investigation candidate:")
    print(f"  customer_id: {investigate_account.customer_id}")
    print(f"  confidence: {investigate_score.confidence}")
    print(f"  result: {investigate(investigate_account, investigate_score)}")

    print("Skip candidate:")
    print(f"  customer_id: {skip_account.customer_id}")
    print(f"  confidence: {skip_score.confidence}")
    print(f"  result: {investigate(skip_account, skip_score)}")


if __name__ == "__main__":
    main()