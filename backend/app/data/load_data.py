from __future__ import annotations

import sys
from pathlib import Path

import pandas as pd

CURRENT_FILE = Path(__file__).resolve()
BACKEND_DIR = CURRENT_FILE.parents[2]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.models.db import Account, SessionLocal  # noqa: E402

CSV_PATH = CURRENT_FILE.with_name("projectflow_dataset.csv")
ACCOUNT_COLUMNS = [
    "customer_id",
    "company_name",
    "current_plan",
    "seats_purchased",
    "seats_active",
    "advanced_analytics_used",
    "api_calls_used",
    "storage_used_gb",
    "login_frequency_30d",
    "login_frequency_60d",
    "support_tickets_open",
    "support_tickets_resolved",
    "support_sentiment_score",
    "payment_delay_days",
    "contract_renewal_date",
    "monthly_revenue",
]


def load_accounts() -> int:
    frame = pd.read_csv(CSV_PATH)
    session = SessionLocal()
    inserted_count = 0

    try:
        existing_ids = {
            row[0]
            for row in session.query(Account.customer_id).all()
        }

        account_rows = frame[ACCOUNT_COLUMNS].to_dict(orient="records")
        for row in account_rows:
            if row["customer_id"] in existing_ids:
                continue

            session.add(Account(**row))
            existing_ids.add(row["customer_id"])
            inserted_count += 1

        session.commit()
        return inserted_count
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


def main() -> None:
    inserted_count = load_accounts()
    print(f"Inserted {inserted_count} account rows into SQLite database at {CURRENT_FILE.with_name('projectflow.db')}")


if __name__ == "__main__":
    main()
