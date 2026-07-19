from __future__ import annotations

import inspect
import sys
from pathlib import Path

CURRENT_FILE = Path(__file__).resolve()
BACKEND_DIR = CURRENT_FILE.parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.data.catalog import ADDONS, PLANS  # noqa: E402
from app.engine.recommendation_engine import recommend  # noqa: E402
from app.models.db import Account  # noqa: E402
from app.models.schemas import Recommendation, ScoreResult  # noqa: E402


SUPPORTED_REASON_CODES = [
    "feature_unused_not_needed",
    "feature_unused_onboarding_gap",
    "feature_unused_support_issue",
    "usage_exceeds_limit_seats",
    "usage_exceeds_limit_api",
    "usage_exceeds_limit_storage",
]


def make_account(plan: str) -> Account:
    return Account(
        customer_id=f"acc_{plan.lower()}",
        company_name="Test Company",
        current_plan=plan,
        seats_purchased=20,
        seats_active=10,
        advanced_analytics_used=0,
        api_calls_used=0,
        storage_used_gb=0,
        login_frequency_30d=10,
        login_frequency_60d=20,
        support_tickets_open=0,
        support_tickets_resolved=0,
        support_sentiment_score=0.0,
        payment_delay_days=0,
        contract_renewal_date="2026-08-01",
        monthly_revenue=99.0,
    )


def make_score(customer_id: str, reason_code: str) -> ScoreResult:
    return ScoreResult(
        customer_id=customer_id,
        health_score=50.0,
        confidence=0.9,
        risk_level="Medium",
        top_reasons=["test reason"],
        reason_code=reason_code,
        investigated=False,
        scored_at="2026-07-17T00:00:00Z",
    )


def test_every_supported_reason_code_returns_recommendation() -> None:
    for reason_code in SUPPORTED_REASON_CODES:
        account = make_account("Professional")
        recommendation = recommend(account, make_score(account.customer_id, reason_code))
        assert isinstance(recommendation, Recommendation)
        assert recommendation.customer_id == account.customer_id
        assert recommendation.reason_code == reason_code
        assert recommendation.line_items


def test_price_delta_matches_catalog_values() -> None:
    downgrade_enterprise = recommend(make_account("Enterprise"), make_score("acc_enterprise", "feature_unused_not_needed"))
    assert downgrade_enterprise.price_delta == PLANS["Professional"]["price"] - PLANS["Enterprise"]["price"]

    onboarding = recommend(make_account("Professional"), make_score("acc_onboarding", "feature_unused_onboarding_gap"))
    assert onboarding.price_delta == 0.0

    support = recommend(make_account("Professional"), make_score("acc_support", "feature_unused_support_issue"))
    assert support.price_delta == 0.0

    seats_upgrade = recommend(make_account("Enterprise"), make_score("acc_seats", "usage_exceeds_limit_seats"))
    assert seats_upgrade.price_delta == ADDONS["extra_seats"]["price"]

    api_upgrade = recommend(make_account("Professional"), make_score("acc_api", "usage_exceeds_limit_api"))
    assert api_upgrade.price_delta == ADDONS["extra_api_calls"]["price"]

    storage_upgrade = recommend(make_account("Starter"), make_score("acc_storage", "usage_exceeds_limit_storage"))
    assert storage_upgrade.price_delta == ADDONS["extra_storage"]["price"]


def test_line_items_reference_catalog_items_and_no_missing_items() -> None:
    for reason_code in SUPPORTED_REASON_CODES:
        recommendation = recommend(
            make_account("Professional"),
            make_score(f"acc_{reason_code}", reason_code),
        )

        assert all(isinstance(item, str) and item.strip() for item in recommendation.line_items)

        if reason_code == "feature_unused_not_needed":
            assert recommendation.line_items[0] in {
                "Downgrade to Starter",
                "Downgrade to Professional",
                "Remove extra seats",
            }

        elif reason_code == "feature_unused_onboarding_gap":
            assert recommendation.line_items == [
                f"{ADDONS['advanced_analytics']['name']} onboarding support"
            ]

        elif reason_code == "feature_unused_support_issue":
            assert recommendation.line_items == [
                f"{ADDONS['priority_support']['name']} support ticket"
            ]

        elif reason_code == "usage_exceeds_limit_seats":
            assert (
                recommendation.line_items[0].startswith("Upgrade to")
                or recommendation.line_items[0]
                == f"Add {ADDONS['extra_seats']['name']}"
            )

        elif reason_code == "usage_exceeds_limit_api":
            assert recommendation.line_items == [
                f"Add {ADDONS['extra_api_calls']['name']}"
            ]

        elif reason_code == "usage_exceeds_limit_storage":
            assert recommendation.line_items == [
                f"Add {ADDONS['extra_storage']['name']}"
            ]


def test_onboarding_and_support_never_change_plan() -> None:
    onboarding = recommend(make_account("Enterprise"), make_score("acc_onboarding", "feature_unused_onboarding_gap"))
    support = recommend(make_account("Enterprise"), make_score("acc_support", "feature_unused_support_issue"))
    assert onboarding.action_type == "offer_onboarding"
    assert support.action_type == "route_to_support"
    assert onboarding.price_delta == 0.0
    assert support.price_delta == 0.0


def test_recommendation_engine_does_not_touch_revenue_or_renewal_fields() -> None:
    source = inspect.getsource(__import__("app.engine.recommendation_engine", fromlist=["recommend"]))
    assert "monthly_revenue" not in source
    assert "contract_renewal_date" not in source