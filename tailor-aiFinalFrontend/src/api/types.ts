export type RiskLevel = "Low" | "Medium" | "High";
export type AutomationTier = "auto_send" | "csm_review" | "manual_investigation";
export type ReasonCode =
  | "feature_unused_not_needed"
  | "feature_unused_onboarding_gap"
  | "feature_unused_support_issue"
  | "usage_exceeds_limit_seats"
  | "usage_exceeds_limit_api"
  | "usage_exceeds_limit_storage";
export type ActionType = "downgrade" | "upgrade" | "offer_onboarding" | "route_to_support" | "no_action";

export interface Account {
  customer_id: string;
  company_name: string;
  current_plan: "Starter" | "Professional" | "Enterprise";
  seats_purchased: number;
  seats_active: number;
  monthly_revenue: number;
  contract_renewal_date: string;
}

export interface ScoreResult {
  customer_id: string;
  health_score: number;
  confidence: number;
  risk_level: RiskLevel;
  top_reasons: string[];
  reason_code: ReasonCode;
  investigated: boolean;
  scored_at: string;
}

export interface Recommendation {
  customer_id: string;
  action_type: ActionType;
  line_items: string[];
  price_delta: number;
  reason_code: ReasonCode;
}

export interface Decision {
  customer_id: string;
  tier: AutomationTier;
  rationale: string;
  decided_at: string;
}

export interface Notification {
  customer_id: string;
  headline: string;
  body: string;
  cta_label: string;
}

export interface AccountDetail {
  account: Account;
  score: ScoreResult;
  recommendation: Recommendation;
  decision: Decision;
  notification: Notification | null;
}