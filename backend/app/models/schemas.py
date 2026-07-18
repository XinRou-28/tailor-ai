from __future__ import annotations

from typing import Literal

from pydantic import BaseModel

RiskLevel = Literal["Low", "Medium", "High"]
AutomationTier = Literal["auto_send", "csm_review", "manual_investigation"]
ReasonCode = Literal[
    "feature_unused_not_needed",
    "feature_unused_onboarding_gap",
    "feature_unused_support_issue",
    "usage_exceeds_limit_seats",
    "usage_exceeds_limit_api",
    "usage_exceeds_limit_storage",
]
ActionType = Literal["downgrade", "upgrade", "offer_onboarding", "route_to_support", "no_action"]
CurrentPlan = Literal["Starter", "Professional", "Enterprise"]


class Account(BaseModel):
    customer_id: str
    company_name: str
    customer_contact:string | null;
    contact_email:string | null;

    current_plan: CurrentPlan
    seats_purchased: int
    seats_active: int

    monthly_revenue: float
    contract_renewal_date: str
    renewal_in_days: int | None = None


class ScoreResult(BaseModel):
    customer_id: str
    health_score: float
    confidence: float
    risk_level: RiskLevel

    top_reasons: list[str]
    reason_code: ReasonCode

    reason_explanations: list[str] = []

    investigated: bool
    scored_at: str


class Recommendation(BaseModel):
    customer_id: str
    action_type: ActionType
    line_items: list[str]
    price_delta: float
    reason_code: ReasonCode


class Decision(BaseModel):
    customer_id: str
    tier: AutomationTier
    rationale: str
    decided_at: str


class Notification(BaseModel):
    customer_id: str

    headline: str
    subject: str | None = None

    recipient_name: str | None = None

    body: str

    cta_label: str


class AccountDetail(BaseModel):
    account: Account
    score: ScoreResult
    recommendation: Recommendation
    decision: Decision
    notification: Notification | None
