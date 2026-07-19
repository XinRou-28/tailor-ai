from __future__ import annotations

import pickle
import sys
from datetime import datetime, timezone
from functools import lru_cache
from pathlib import Path
from typing import Any

import numpy as np
import pandas as pd

CURRENT_FILE = Path(__file__).resolve()
BACKEND_DIR = CURRENT_FILE.parents[2]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.models.db import Account  # noqa: E402
from app.models.schemas import ScoreResult  # noqa: E402

ARTIFACT_PATH = CURRENT_FILE.parents[1] / "ml" / "model.pkl"

FEATURE_COLUMNS = [
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
]


@lru_cache(maxsize=1)
def load_artifact() -> dict[str, Any]:
    if not ARTIFACT_PATH.exists():
        raise FileNotFoundError(
            f"Model artifact not found at {ARTIFACT_PATH}. Run backend/app/ml/train.py first."
        )

    with ARTIFACT_PATH.open("rb") as artifact_file:
        return pickle.load(artifact_file)

def _feature_frame(account: Account) -> pd.DataFrame:
    return pd.DataFrame(
        [
            {
                "seats_purchased": account.seats_purchased,
                "seats_active": account.seats_active,
                "advanced_analytics_used": account.advanced_analytics_used,
                "api_calls_used": account.api_calls_used,
                "storage_used_gb": account.storage_used_gb,
                "login_frequency_30d": account.login_frequency_30d,
                "login_frequency_60d": account.login_frequency_60d,
                "support_tickets_open": account.support_tickets_open,
                "support_tickets_resolved": account.support_tickets_resolved,
                "support_sentiment_score": account.support_sentiment_score,
                "payment_delay_days": account.payment_delay_days,
            }
        ],
        columns=FEATURE_COLUMNS,
    )

def _feature_frame_batch(accounts: list[Account]) -> pd.DataFrame:
    return pd.DataFrame(
        [
            {
                "seats_purchased": a.seats_purchased,
                "seats_active": a.seats_active,
                "advanced_analytics_used": a.advanced_analytics_used,
                "api_calls_used": a.api_calls_used,
                "storage_used_gb": a.storage_used_gb,
                "login_frequency_30d": a.login_frequency_30d,
                "login_frequency_60d": a.login_frequency_60d,
                "support_tickets_open": a.support_tickets_open,
                "support_tickets_resolved": a.support_tickets_resolved,
                "support_sentiment_score": a.support_sentiment_score,
                "payment_delay_days": a.payment_delay_days,
            }
            for a in accounts
        ],
        columns=FEATURE_COLUMNS,
    )


def _format_reason(feature_name: str, account: Account) -> str:
    if feature_name == "advanced_analytics_used":
        return "Advanced Analytics unused" if account.advanced_analytics_used == 0 else "Advanced Analytics in use"

    if feature_name == "login_frequency_30d":
        if account.login_frequency_60d > 0:
            drop_pct = max(
                0,
                round((account.login_frequency_60d - account.login_frequency_30d) / account.login_frequency_60d * 100),
            )
            return f"Login frequency down {drop_pct}% (30d vs 60d)"
        return "Login frequency trend is weak"

    if feature_name == "support_sentiment_score":
        return f"Support sentiment is low ({account.support_sentiment_score:.2f})"

    if feature_name == "support_tickets_open":
        return f"{account.support_tickets_open} open support tickets"

    if feature_name == "payment_delay_days":
        return f"Payment delay of {account.payment_delay_days} days"

    if feature_name == "seats_active":
        return f"Seats active at {account.seats_active} of {account.seats_purchased} purchased"

    if feature_name == "api_calls_used":
        return f"API calls used: {account.api_calls_used}"

    if feature_name == "storage_used_gb":
        return f"Storage used: {account.storage_used_gb} GB"

    if feature_name == "support_tickets_resolved":
        return f"Support tickets resolved: {account.support_tickets_resolved}"

    if feature_name == "seats_purchased":
        return f"Seats purchased: {account.seats_purchased}"

    return feature_name.replace("_", " ").capitalize()


def _reason_code(account: Account, top_features: list[str], artifact: dict[str, Any]) -> str:
    class_labels = artifact["class_labels"]
    if "renewed" in class_labels and any(feature == "advanced_analytics_used" for feature in top_features):
        if account.advanced_analytics_used == 0 and account.login_frequency_30d < account.login_frequency_60d:
            return "feature_unused_onboarding_gap"
        if account.support_tickets_open > 0 and account.support_sentiment_score < 0.5:
            return "feature_unused_support_issue"

    if account.support_tickets_open > 0 and account.support_sentiment_score < 0.5:
        return "feature_unused_support_issue"

    if account.login_frequency_30d < account.login_frequency_60d and account.advanced_analytics_used == 0:
        return "feature_unused_onboarding_gap"

    if account.advanced_analytics_used == 0 or account.seats_active < max(1, int(account.seats_purchased * 0.7)):
        return "feature_unused_not_needed"

    if account.api_calls_used >= 12000:
        return "usage_exceeds_limit_api"

    if account.storage_used_gb >= 150:
        return "usage_exceeds_limit_storage"

    if account.seats_active > account.seats_purchased:
        return "usage_exceeds_limit_seats"

    return "feature_unused_not_needed"


def _top_reasons(account: Account, artifact: dict[str, Any], limit: int = 3) -> list[str]:
    explain_model = artifact["explain_model"]
    scaler = explain_model.named_steps["standardscaler"]
    logistic = explain_model.named_steps["logisticregression"]
    frame = _feature_frame(account)
    transformed = scaler.transform(frame)[0]
    class_index = list(logistic.classes_).index(str(artifact["predicted_class"]))
    contributions = transformed * logistic.coef_[class_index]

    ranked_features = sorted(
        zip(FEATURE_COLUMNS, contributions),
        key=lambda item: item[1],
        reverse=True,
    )

    top_features: list[str] = []
    reasons: list[str] = []
    for feature_name, contribution in ranked_features:
        if contribution <= 0 and reasons:
            continue
        top_features.append(feature_name)
        reasons.append(_format_reason(feature_name, account))
        if len(reasons) >= limit:
            break

    if not reasons:
        fallback_features = [feature for feature, _ in ranked_features[:limit]]
        reasons = [_format_reason(feature_name, account) for feature_name in fallback_features]

    artifact["top_feature_names"] = top_features or [feature for feature, _ in ranked_features[:limit]]
    return reasons[:limit]


def score(account: Account) -> ScoreResult:
    artifact = load_artifact()
    model = artifact["calibrated_model"]
    frame = _feature_frame(account)
    probabilities = model.predict_proba(frame)[0]
    class_labels = list(model.classes_)

    probability_by_class = dict(zip(class_labels, probabilities))
    predicted_class = class_labels[int(np.argmax(probabilities))]
    artifact["predicted_class"] = predicted_class

    renewed_probability = float(probability_by_class.get("renewed", 0.0))
    downgraded_probability = float(probability_by_class.get("downgraded", 0.0))
    churned_probability = float(probability_by_class.get("churned", 0.0))

    health_score = round(100.0 * (renewed_probability + 0.5 * downgraded_probability), 2)
    confidence = round(float(np.max(probabilities)), 4)

    risk_index = churned_probability + 0.5 * downgraded_probability
    if risk_index >= 0.65:
        risk_level = "High"
    elif risk_index >= 0.35:
        risk_level = "Medium"
    else:
        risk_level = "Low"

    top_reasons = _top_reasons(account, artifact)
    reason_code = _reason_code(account, artifact.get("top_feature_names", []), artifact)

    scored_at = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
    return ScoreResult(
        customer_id=account.customer_id,
        health_score=health_score,
        confidence=confidence,
        risk_level=risk_level,
        top_reasons=top_reasons,
        reason_code=reason_code,
        investigated=False,
        scored_at=scored_at,
    )

def score_batch(accounts: list[Account]) -> dict[str, ScoreResult]:
    artifact = load_artifact()
    model = artifact["calibrated_model"]
    frame = _feature_frame_batch(accounts)
    probabilities = model.predict_proba(frame)
    class_labels = list(model.classes_)

    results: dict[str, ScoreResult] = {}
    for i, account in enumerate(accounts):
        probability_by_class = dict(zip(class_labels, probabilities[i]))
        predicted_class = class_labels[int(np.argmax(probabilities[i]))]
        artifact["predicted_class"] = predicted_class

        renewed_probability = float(probability_by_class.get("renewed", 0.0))
        downgraded_probability = float(probability_by_class.get("downgraded", 0.0))
        churned_probability = float(probability_by_class.get("churned", 0.0))

        health_score = round(100.0 * (renewed_probability + 0.5 * downgraded_probability), 2)
        confidence = round(float(np.max(probabilities[i])), 4)

        risk_index = churned_probability + 0.5 * downgraded_probability
        if risk_index >= 0.65:
            risk_level = "High"
        elif risk_index >= 0.35:
            risk_level = "Medium"
        else:
            risk_level = "Low"

        top_reasons = _top_reasons(account, artifact)
        reason_code = _reason_code(account, artifact.get("top_feature_names", []), artifact)

        scored_at = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
        results[account.customer_id] = ScoreResult(
            customer_id=account.customer_id,
            health_score=health_score,
            confidence=confidence,
            risk_level=risk_level,
            top_reasons=top_reasons,
            reason_code=reason_code,
            investigated=False,
            scored_at=scored_at,
        )
    return results