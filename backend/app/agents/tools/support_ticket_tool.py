from __future__ import annotations

from dataclasses import dataclass

from app.models.db import Account


@dataclass(frozen=True)
class SupportTicketEvidence:
    has_support_issue: bool
    is_onboarding_gap: bool
    reason_code: str
    summary: str


def inspect_support_tickets(account: Account) -> SupportTicketEvidence:
    has_support_issue = account.support_tickets_open > 0 and account.support_sentiment_score < 0.5
    is_onboarding_gap = (
        account.support_tickets_open > 0
        and account.support_sentiment_score >= 0.5
        and account.login_frequency_30d < account.login_frequency_60d
        and account.advanced_analytics_used == 0
    )

    if has_support_issue:
        summary = (
            f"{account.support_tickets_open} open tickets with low sentiment "
            f"({account.support_sentiment_score:.2f})"
        )
        return SupportTicketEvidence(
            has_support_issue=True,
            is_onboarding_gap=False,
            reason_code="feature_unused_support_issue",
            summary=summary,
        )

    if is_onboarding_gap:
        summary = (
            f"{account.support_tickets_open} open tickets, but sentiment is neutral or positive "
            f"({account.support_sentiment_score:.2f})"
        )
        return SupportTicketEvidence(
            has_support_issue=False,
            is_onboarding_gap=True,
            reason_code="feature_unused_onboarding_gap",
            summary=summary,
        )

    return SupportTicketEvidence(
        has_support_issue=False,
        is_onboarding_gap=False,
        reason_code="feature_unused_not_needed",
        summary="No support-driven signal for investigation",
    )