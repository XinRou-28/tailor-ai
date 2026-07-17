from __future__ import annotations

from dataclasses import dataclass

from app.models.db import Account


@dataclass(frozen=True)
class FeatureUsageEvidence:
    usage_drop_ratio: float
    uses_advanced_analytics: bool
    reason_code: str
    summary: str


def inspect_feature_usage(account: Account) -> FeatureUsageEvidence:
    if account.login_frequency_60d > 0:
        usage_drop_ratio = max(0.0, (account.login_frequency_60d - account.login_frequency_30d) / account.login_frequency_60d)
    else:
        usage_drop_ratio = 0.0

    uses_advanced_analytics = account.advanced_analytics_used == 1
    onboarding_gap = usage_drop_ratio >= 0.25 and not uses_advanced_analytics

    if onboarding_gap:
        return FeatureUsageEvidence(
            usage_drop_ratio=usage_drop_ratio,
            uses_advanced_analytics=False,
            reason_code="feature_unused_onboarding_gap",
            summary=(
                f"30d usage dropped {usage_drop_ratio:.2%} versus 60d and Advanced Analytics is unused"
            ),
        )

    if not uses_advanced_analytics:
        return FeatureUsageEvidence(
            usage_drop_ratio=usage_drop_ratio,
            uses_advanced_analytics=False,
            reason_code="feature_unused_not_needed",
            summary="Advanced Analytics is unused, but usage does not show a strong onboarding gap",
        )

    return FeatureUsageEvidence(
        usage_drop_ratio=usage_drop_ratio,
        uses_advanced_analytics=True,
        reason_code="feature_unused_not_needed",
        summary="Advanced Analytics is in use",
    )