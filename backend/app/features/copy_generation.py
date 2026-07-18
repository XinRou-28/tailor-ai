from __future__ import annotations


def generate_customer_copy(
    customer_id: str,
    customer_name: str,
    current_plan: str,
    recommended_action: str,
    reason: str,
    price_delta: float,
) -> dict[str, str]:

    subject = "Unlocking your Enterprise Value"

    body = f"""Hi {customer_name},

We noticed that your {current_plan} account may not be getting full value from the platform.

Our analysis identified:
- Reason: {reason.replace('_', ' ')}
- Recommended action: {recommended_action.replace('_', ' ')}

Our team would like to help you improve adoption and ensure you receive the expected value from your subscription.

Are you available for a quick onboarding session?

Best,
Mei Chen
"""

    return {
        "customer_id": customer_id,

        "headline": subject,

        "subject": subject,

        "recipient_name": customer_name,

        "body": body,

        "cta_label": "Approve & Send",
    }