from __future__ import annotations

from app.data.catalog import ADDONS, PLANS
from app.models.db import Account
from app.models.schemas import Recommendation, ScoreResult


PLAN_ORDER = ["Starter", "Professional", "Enterprise"]


def _plan_index(plan_name: str) -> int:
    if plan_name not in PLAN_ORDER:
        raise ValueError(f"Unsupported plan: {plan_name}")
    return PLAN_ORDER.index(plan_name)


def _lower_plan(plan_name: str) -> str:
    index = _plan_index(plan_name)
    return PLAN_ORDER[max(0, index - 1)]


def _higher_plan(plan_name: str) -> str:
    index = _plan_index(plan_name)
    return PLAN_ORDER[min(len(PLAN_ORDER) - 1, index + 1)]


def _addon_label(addon_key: str) -> str:
    return ADDONS[addon_key]["name"]


def _catalog_line_item(label: str) -> str:
    return label


def _downgrade_recommendation(account: Account) -> Recommendation:
    if account.current_plan == "Enterprise":
        target_plan = _lower_plan(account.current_plan)
        return Recommendation(
            customer_id=account.customer_id,
            action_type="downgrade",
            line_items=[_catalog_line_item(f"Downgrade to {target_plan}")],
            price_delta=PLANS[target_plan]["price"] - PLANS[account.current_plan]["price"],
            reason_code="feature_unused_not_needed",
        )

    if account.current_plan == "Professional":
        target_plan = _lower_plan(account.current_plan)
        return Recommendation(
            customer_id=account.customer_id,
            action_type="downgrade",
            line_items=[_catalog_line_item(f"Downgrade to {target_plan}")],
            price_delta=PLANS[target_plan]["price"] - PLANS[account.current_plan]["price"],
            reason_code="feature_unused_not_needed",
        )

    return Recommendation(
        customer_id=account.customer_id,
        action_type="downgrade",
        line_items=[_catalog_line_item("Remove extra seats")],
        price_delta=-ADDONS["extra_seats"]["price"],
        reason_code="feature_unused_not_needed",
    )


def _onboarding_recommendation(account: Account) -> Recommendation:
    return Recommendation(
        customer_id=account.customer_id,
        action_type="offer_onboarding",
        line_items=[_catalog_line_item(f"{_addon_label('advanced_analytics')} onboarding support")],
        price_delta=0.0,
        reason_code="feature_unused_onboarding_gap",
    )


def _support_recommendation(account: Account) -> Recommendation:
    return Recommendation(
        customer_id=account.customer_id,
        action_type="route_to_support",
        line_items=[_catalog_line_item(f"{_addon_label('priority_support')} support ticket")],
        price_delta=0.0,
        reason_code="feature_unused_support_issue",
    )


def _seats_upgrade_recommendation(account: Account) -> Recommendation:
    if account.current_plan == "Starter":
        target_plan = _higher_plan(account.current_plan)
        return Recommendation(
            customer_id=account.customer_id,
            action_type="upgrade",
            line_items=[_catalog_line_item(f"Upgrade to {target_plan}")],
            price_delta=PLANS[target_plan]["price"] - PLANS[account.current_plan]["price"],
            reason_code="usage_exceeds_limit_seats",
        )

    if account.current_plan == "Professional":
        target_plan = _higher_plan(account.current_plan)
        return Recommendation(
            customer_id=account.customer_id,
            action_type="upgrade",
            line_items=[_catalog_line_item(f"Upgrade to {target_plan}")],
            price_delta=PLANS[target_plan]["price"] - PLANS[account.current_plan]["price"],
            reason_code="usage_exceeds_limit_seats",
        )

    return Recommendation(
        customer_id=account.customer_id,
        action_type="upgrade",
        line_items=[_catalog_line_item(f"Add {_addon_label('extra_seats')}")],
        price_delta=ADDONS["extra_seats"]["price"],
        reason_code="usage_exceeds_limit_seats",
    )


def _api_upgrade_recommendation(account: Account) -> Recommendation:
    return Recommendation(
        customer_id=account.customer_id,
        action_type="upgrade",
        line_items=[_catalog_line_item(f"Add {_addon_label('extra_api_calls')}")],
        price_delta=ADDONS["extra_api_calls"]["price"],
        reason_code="usage_exceeds_limit_api",
    )


def _storage_upgrade_recommendation(account: Account) -> Recommendation:
    return Recommendation(
        customer_id=account.customer_id,
        action_type="upgrade",
        line_items=[_catalog_line_item(f"Add {_addon_label('extra_storage')}")],
        price_delta=ADDONS["extra_storage"]["price"],
        reason_code="usage_exceeds_limit_storage",
    )


def recommend(account: Account, score: ScoreResult) -> Recommendation:
    if score.reason_code == "feature_unused_not_needed":
        return _downgrade_recommendation(account)

    if score.reason_code == "feature_unused_onboarding_gap":
        return _onboarding_recommendation(account)

    if score.reason_code == "feature_unused_support_issue":
        return _support_recommendation(account)

    if score.reason_code == "usage_exceeds_limit_seats":
        return _seats_upgrade_recommendation(account)

    if score.reason_code == "usage_exceeds_limit_api":
        return _api_upgrade_recommendation(account)

    if score.reason_code == "usage_exceeds_limit_storage":
        return _storage_upgrade_recommendation(account)

    raise ValueError(f"Unsupported reason_code: {score.reason_code}")