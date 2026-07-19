from __future__ import annotations
from dotenv import load_dotenv
load_dotenv()

import json
import os
import requests
import re

from app.models.schemas import Notification

MISTRAL_API_KEY = os.environ.get("MISTRAL_API_KEY")
MISTRAL_URL = "https://api.mistral.ai/v1/chat/completions"

SYSTEM_PROMPT = (
    "You write short, plain-language customer notifications for a SaaS account "
    "review system. You will be given: customer_name, current_plan, "
    "recommended_action, reason. "
    "Never include a dollar amount or plan name in your response. "
    "Never mention pricing, cost, or specific plan tiers. "
    "Respond ONLY with JSON matching this schema: "
    '{"headline": string, "body": string, "cta_label": string}. '
    "No other keys. No markdown, no code fences."
)

def _contains_price_or_plan(data: dict, current_plan: str) -> bool:
    text = f"{data.get('headline', '')} {data.get('body', '')} {data.get('cta_label', '')}"
    if re.search(r"\$\s?\d", text):
        return True
    if current_plan.lower() in text.lower():
        return True
    return False

def _fallback(customer_name: str, current_plan: str, recommended_action: str, reason: str) -> dict:
    return {
        "headline": "Account review update",
        "body": (
            f"Hi {customer_name}, we reviewed your {current_plan} account. "
            f"Our recommendation is to {recommended_action} "
            f"because of {reason.replace('_', ' ')}."
        ),
        "cta_label": "Review recommendation",
    }


def generate_customer_copy(
    customer_id: str,
    customer_name: str,
    current_plan: str,
    recommended_action: str,
    reason: str,
    price_delta: float,
) -> Notification:

    user_input = {
        "customer_name": customer_name,
        "current_plan": current_plan,
        "recommended_action": recommended_action,
        "reason": reason,
    }

    data = None
    if MISTRAL_API_KEY:
        try:
            resp = requests.post(
                MISTRAL_URL,
                headers={
                    "Authorization": f"Bearer {MISTRAL_API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": "mistral-small-latest",
                    "response_format": {"type": "json_object"},
                    "messages": [
                        {"role": "system", "content": SYSTEM_PROMPT},
                        {"role": "user", "content": json.dumps(user_input)},
                    ],
                },
                timeout=10,
            )
            resp.raise_for_status()
            content = resp.json()["choices"][0]["message"]["content"]
            data = json.loads(content)
        except Exception:
            data = None

    if not data or "price" in data or "plan" in data or "price_delta" in data or _contains_price_or_plan(data, current_plan):
        data = _fallback(customer_name, current_plan, recommended_action, reason)

    return Notification(
        customer_id=customer_id,
        headline=data.get("headline", "Account review update"),
        body=data.get("body", ""),
        cta_label=data.get("cta_label", "Review recommendation"),
    )