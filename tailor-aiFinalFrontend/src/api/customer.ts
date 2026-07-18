import { apiGet } from "./client";


export interface CustomerDetail {
  account: {
    customer_id:string;
    company_name:string;
    customer_contact:string;
    contact_email:string;
    current_plan:string;
    seats_purchased:number;
    seats_active:number;
    monthly_revenue:number;
    contract_renewal_date:string;
    renewal_in_days:number;
  };

  score:{
    health_score:number;
    confidence:number;
    risk_level:string;
    top_reasons:string[];
    reason_code:string;
  };

  recommendation:{
    action_type:string;
    line_items:string[];
    price_delta:number;
  };

  decision:{
    tier:string;
    rationale:string;
    decided_at:string;
 };

  notification:{
    headline:string;
    subject:string | null;
    recipient_name:string | null;
    body:string;
    cta_label:string;
} | null;
}

export interface CustomerViewModel {

  name:string;

  customerContact:string;
  contactEmail:string;

  plan:string;
  price:number;
  renewalInDays:number;

  healthScore:number;
  aiConfidence:number;

  automationTier:string;

  reasons:string[];

  recommendation:string;

  outreachEmail:string;

  decision:{
    rationale:string;
    tier:string;
    decided_at:string;
  };
}

export function getCustomerDetail(customer_id:string){
  return apiGet<CustomerDetail>(
    `/accounts/${customer_id}`
  );
}

export function transformCustomerDetail(
  data:CustomerDetail
):CustomerViewModel{

  return {

    name:data.account.customer_contact ?? "Unknown Customer",

    customerContact:data.account.customer_contact ?? "Unknown Customer",

    contactEmail:data.account.contact_email ?? "",

    plan:data.account.current_plan,

    price:data.account.monthly_revenue,

    renewalInDays:data.account.renewal_in_days,


    healthScore:data.score.health_score,

    aiConfidence:data.score.confidence * 100,


    automationTier:data.decision.tier,


    reasons:data.score.top_reasons,


    recommendation:
      data.recommendation.line_items.join(", "),


    outreachEmail:
      data.notification?.body ?? "",


    decision:{
    rationale:data.decision.rationale,
    tier:data.decision.tier,
    decided_at:data.decision.decided_at
}

  }

}