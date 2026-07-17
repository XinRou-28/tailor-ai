from __future__ import annotations


def generate_customer_copy(
    customer_id: str,
    customer_name: str,
    current_plan: str,
    recommended_action: str,
    reason: str,
    price_delta: float,
) -> dict[str, str]:

    return {
        "customer_id": customer_id,
        "headline": "Account review update",
        "body": (
            f"Hi {customer_name}, "
            f"we reviewed your {current_plan} account. "
            f"Our recommendation is to {recommended_action} "
            f"because of {reason.replace('_', ' ')}."
        ),
        "cta_label": "Review recommendation",
    }