import { apiGet } from "./client";


export interface Account {
  customer_id: string;
  company_name: string;
  current_plan: string;

  monthly_revenue: number;

  health_score: number;

  risk_level: "Low" | "Medium" | "High";

  tier: string;
}


export interface AccountsResponse {
  accounts: Account[];
  total: number;
}


export function getAccounts(): Promise<AccountsResponse>{
  return apiGet<AccountsResponse>("/accounts");
}