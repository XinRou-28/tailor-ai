import { apiGet } from "./client";


export interface InsightReason {
  reason_code: string;
  label: string;
  count: number;
  pct: number;
}


export interface InsightsResponse {
  generated_at: string;
  total_accounts: number;
  top_reasons: InsightReason[];
}


export function getInsights() {
  return apiGet<InsightsResponse>("/insights");
}