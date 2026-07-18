import { apiGet } from "./client";


export interface DigestItem {
  customer_id: string;
  company_name: string;
  risk_level: string;
  reason: string;
  recommendation: string;
  decision_tier: string;
}


export interface DigestResponse {
  date: string;
  count: number;
  items: DigestItem[];
}


export function getDigest() {
  return apiGet<DigestResponse>("/digest");
}