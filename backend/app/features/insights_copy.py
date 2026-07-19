from __future__ import annotations

import json
import os
import requests
from dotenv import load_dotenv
import re

load_dotenv()

MISTRAL_API_KEY = os.environ.get("MISTRAL_API_KEY")
MISTRAL_URL = "https://api.mistral.ai/v1/chat/completions"

SYSTEM_PROMPT = (
    "You are analyzing aggregated churn-risk pattern data for a B2B SaaS "
    "portfolio dashboard. You will receive a list of reason_code entries "
    "with label, count, and pct (percentage of at-risk accounts). "
    "Write two things: "
    "1) 'pulse': one short sentence (max 30 words) naming the strongest "
    "pattern and what it suggests, for a small 'AI Pulse' card. "
    "2) 'strategy': one short paragraph (max 50 words) recommending a "
    "concrete next action tied to the top pattern, for a 'Pattern → Strategy' "
    "section. "
    "Never invent numbers not present in the input. Never mention dollar "
    "amounts. Respond ONLY with JSON: {\"pulse\": string, \"strategy\": string}. "
    "No markdown, no code fences."
)

_cache: dict | None = None

def _contains_dollar_amount(data: dict) -> bool:
    text = f"{data.get('pulse', '')} {data.get('strategy', '')}"
    return bool(re.search(r"\$\s?\d", text))

def _fallback(top_reasons: list[dict]) -> dict:
    if not top_reasons:
        return {
            "pulse": "Not enough data yet to detect a pattern.",
            "strategy": "Once more accounts are scored, this section will surface the top retention pattern.",
        }
    top = top_reasons[0]
    return {
        "pulse": f"Pattern detected: {top['label']} affects {top['pct']}% of at-risk accounts.",
        "strategy": f"Focusing on {top['label'].lower()} shows the highest correlation with at-risk accounts. Recommended as the next retention focus area.",
    }


def get_ai_pulse(top_reasons: list[dict]) -> dict:
    global _cache
    if _cache is not None:
        return _cache

    data = None
    if MISTRAL_API_KEY and top_reasons:
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
                        {"role": "user", "content": json.dumps(top_reasons)},
                    ],
                },
                timeout=10,
            )
            resp.raise_for_status()
            content = resp.json()["choices"][0]["message"]["content"]
            data = json.loads(content)
            if "pulse" not in data or "strategy" not in data or _contains_dollar_amount(data):
                data = None
        except Exception:
            data = None

    if not data:
        data = _fallback(top_reasons)

    _cache = data
    return _cache