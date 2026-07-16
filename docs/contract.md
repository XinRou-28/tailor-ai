# Tailor AI — contract.md

**The single source of truth between Frontend and Backend. Nobody changes a field name here without posting in the team channel — this is what makes parallel work possible.**

Base URL (local dev): `http://localhost:8000/api`
All responses: `application/json`. All timestamps: ISO 8601 strings.

---

## 0. Core shared types

These are the building blocks every endpoint below is made of. Frontend should define matching TypeScript types (or JSDoc types) from this section on Day 1, hour 1 — before the backend has a single real endpoint working — using the mock data in Section 6.

ts

```tsx
typeRiskLevel="Low"|"Medium"|"High";typeAutomationTier="auto_send"|"csm_review"|"manual_investigation";typeReasonCode=|"feature_unused_not_needed"|"feature_unused_onboarding_gap"// set only by Feature 1b|"feature_unused_support_issue"// set only by Feature 1b|"usage_exceeds_limit_seats"|"usage_exceeds_limit_api"|"usage_exceeds_limit_storage";typeActionType="downgrade"|"upgrade"|"offer_onboarding"|"route_to_support"|"no_action";interfaceAccount{  customer_id:string;  company_name:string;  current_plan:"Starter"|"Professional"|"Enterprise";  seats_purchased:number;  seats_active:number;  monthly_revenue:number;  contract_renewal_date:string;// ISO date}interfaceScoreResult{  customer_id:string;  health_score:number;// 0-100  confidence:number;// 0-1  risk_level:RiskLevel;  top_reasons:string[];// human-readable, max 3, ranked  reason_code:ReasonCode;// machine-readable, feeds Feature 2  investigated:boolean;// true if Feature 1b ran  scored_at:string;}interfaceRecommendation{  customer_id:string;  action_type:ActionType;  line_items:string[];// e.g. ["Remove Advanced Analytics add-on"] — must resolve to catalog in Section 1 of product.md  price_delta:number;// signed, in USD/mo. 0 if no plan change (onboarding/support cases)  reason_code:ReasonCode;}interfaceDecision{  customer_id:string;  tier:AutomationTier;  rationale:string;// short, shown to Mei in digest: why this landed in this tier  decided_at:string;}interfaceNotification{  customer_id:string;  headline:string;  body:string;// LLM-generated copy, NEVER contains a price/plan field — renderer injects price_delta separately from the locked Recommendation object  cta_label:string;// e.g. "Schedule onboarding session"}interfaceAccountDetail{  account:Account;  score:ScoreResult;  recommendation:Recommendation;  decision:Decision;  notification:Notification|null;// null until generated}
```

---

## 1. `GET /accounts`

Portfolio list view. Returns the lightweight fields the dashboard's main table needs — never the full drilldown payload (keeps this fast at 500-1000 rows).

**Response 200**

json

```json
{"accounts":[{"customer_id":"acc_0001","company_name":"ABC Company","current_plan":"Enterprise","monthly_revenue":299,"health_score":35,"risk_level":"High","tier":"csm_review"}],"total":500}
```

Query params: `?risk_level=High&tier=csm_review&page=1&page_size=50` (all optional, backend implements when time allows; frontend must code defensively for their absence on Day 1 — see Section 7).

---

## 2. `GET /accounts/{customer_id}`

Full drilldown. Returns `AccountDetail` (Section 0). This is the one call the account detail screen needs — do not make the frontend stitch together 4 separate calls.

**Response 200:** `AccountDetail`**Response 404:** `{ "error": { "code": "not_found", "message": "Account acc_9999 not found" } }`

---

## 3. `GET /digest`

The daily digest for Mei — every account currently in `csm_review` tier, sorted by revenue descending.

**Response 200**

json

```json
{"date":"2026-07-16","count":2,"items":[{"customer_id":"acc_0001","company_name":"ABC Company","monthly_revenue":299,"action_type":"offer_onboarding","rationale":"High revenue account, renewal in 18 days"}]}
```

---

## 4. `POST /accounts/{customer_id}/decision`

Mei's one-click approve/decline from the digest or drilldown screen. This is the only write endpoint in the whole demo.

**Request body**

json

```json
{"outcome":"approved"}// or "declined"
```

**Response 200**

json

```json
{"customer_id":"acc_0001","outcome":"approved","recorded_at":"2026-07-16T09:30:00Z"}
```

This write is what feeds the feedback loop described in product.md Section 10 — backend should persist it even if nothing reads it back during the demo.

---

## 5. `GET /insights`

Feature 4's static aggregated chart data.

**Response 200**

json

```json
{"generated_at":"2026-07-16T00:00:00Z","top_reasons":[{"reason_code":"feature_unused_not_needed","label":"Unused Advanced Analytics","pct":42},{"reason_code":"feature_unused_onboarding_gap","label":"Poor onboarding","pct":30},{"reason_code":"usage_exceeds_limit_api","label":"Missing integrations / API limits","pct":18}]}
```

## 5b. `GET /calibration`

For the acceptance-criteria proof in product.md Section 4 — reliability curve + confusion matrix. Only needs to exist and return real numbers once; it is a static artifact of the training run, not a live endpoint the dashboard polls.

**Response 200**

json

```json
{"reliability_curve":[{"predicted_bucket":"0.5-0.6","actual_positive_rate":0.54,"n":62}],"confusion_matrix_by_tier":{"auto_send":{"tp":40,"fp":3,"tn":55,"fn":2},"csm_review":{"tp":18,"fp":6,"tn":20,"fn":4},"manual_investigation":{"tp":5,"fp":4,"tn":8,"fn":3}}}
```

---

## 6. Mock data contract (Day 1 unblock)

Frontend does **not** wait on backend. On Day 1, Person C/D create `frontend/src/mocks/accounts.mock.json` shaped exactly like Section 1/2's response bodies (3-5 hand-written accounts covering: high-confidence low-stakes, medium-confidence high-revenue, low-confidence, the ABC Company worked example from product.md verbatim). Every API call in the frontend goes through a single `api/client.ts` file with one flag: `USE_MOCKS`. Flipping that flag to `false` on Day 2 afternoon is the entire integration step — see workflow.md Day 2, Integration Checkpoint.

---

## 7. Rules both sides must follow

- **Never rename a field without updating this file first.** If a rename is needed mid-hackathon, it's a message in the team channel + a one-line edit here, then both sides pull.
- **Backend never omits a field** defined in Section 0's interfaces, even if the value is a placeholder (`null`, `0`, `"pending"`). Frontend is allowed to assume every field always exists — this is what lets Person C/D build without defensive null-checking everywhere.
- **Frontend never invents a field** that isn't here. If the UI needs something not in this contract, that's a contract change, not a frontend workaround.
- **All errors** use the `{ "error": { "code": ..., "message": ... } }` shape, always HTTP 4xx/5xx, never 200 with an error body.
- **CORS:** backend allows `http://localhost:5173` (Vite default) and the deployed Vercel URL from hour 1 — this is a 2-minute FastAPI config that has derailed more hackathons than it should.