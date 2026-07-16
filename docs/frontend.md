# Tailor AI — frontend.md

**Owners: Person C (lead) + Person D (support, also owns Feature 5 rendering + Feature 4 chart)**

---

## 1. Stack

- **Scaffolding:** Vite + React + TypeScript
- **Styling:** Tailwind CSS
- **Charts:** Recharts (bar chart for Feature 4, reliability curve for Feature 1's calibration proof)
- **Data fetching:** plain `fetch` wrapped in one `api/client.ts` — no need for React Query at hackathon scale (500-1000 rows, 6 endpoints)
- **Design generation:** **Google Stitch** — used to generate the *visual design* (layout, spacing, component look) for each screen as HTML/CSS or a React starting point, which Person C then wires to real data. Stitch is a design accelerant, not the source of truth for logic — nothing from Stitch's output touches API calls directly; it gets refactored into components that read from `api/client.ts`.

---

## 2. Screens (exactly what product.md Section 13 says must be one coherent dashboard, not five disconnected screens)

All four live inside **one shell app** with a left nav, not separate deployed pages:

1. **Portfolio List** — table/grid of all accounts (`GET /accounts`), columns: company, plan, health score (colored badge by risk_level), tier badge, revenue. Row click → Account Drilldown.
2. **Review Digest** — Mei's daily view (`GET /digest`). Card per account: company, revenue, one-line rationale, recommended action, Approve/Decline buttons (`POST /accounts/{id}/decision`).
3. **Account Drilldown** — the single most important screen for the demo. Shows the full story top to bottom: health score → top reasons → recommendation → decision tier + rationale → notification preview. This is where "score → reason → recommendation → decision → copy" (product.md Section 14) becomes visually obvious to a judge in one screenshot.
4. **Insights (Feature 4)** — one static bar chart (`GET /insights`), lowest priority, built last.
5. **Calibration panel** — small, can be a modal or a tab inside Drilldown/Insights, not a full screen. Shows the reliability curve + confusion matrix from `GET /calibration`. This exists purely to satisfy product.md's "acceptance criteria" and preempt a judge asking "how do you know your confidence numbers mean anything."

---

## 3. Component tree

```
App
├── AppShell (left nav: Portfolio / Digest / Insights)
├── PortfolioList
│   ├── AccountTable
│   │   └── RiskBadge, TierBadge
├── ReviewDigest
│   └── DigestCard (Approve/Decline buttons)
├── AccountDrilldown
│   ├── ScoreSummary (health score, confidence, risk badge)
│   ├── ReasonList (top_reasons)
│   ├── RecommendationCard (action_type, line_items, price_delta)
│   ├── DecisionBadge (tier + rationale)
│   └── NotificationPreview (renders Notification.headline/body — the in-app card from Feature 5)
├── InsightsChart (Recharts BarChart, fed by /insights)
└── CalibrationPanel (Recharts LineChart for reliability curve + a simple table for confusion matrix)
```

---

## 4. Stitch prompts (use these verbatim as starting points, then adjust)

Give Stitch the **screen name + the exact data fields it will show** so the generated layout has real information density, not lorem ipsum boxes. Example prompts:

**Portfolio List:**

> "Design a B2B SaaS admin dashboard table view called 'Customer Portfolio'. Columns: Company Name, Current Plan (badge), Monthly Revenue, Health Score (0-100, shown as a colored progress ring — green >70, yellow 40-70, red <40), Risk Level (Low/Medium/High badge), Automation Tier (Auto-sent / Needs Review / Manual badge). Clean, dense, professional SaaS style — think Linear or Stripe Dashboard. Include a filter bar at top for Risk Level."
> 

**Review Digest:**

> "Design a 'Daily Review' card-based screen for a customer success dashboard. Each card shows: company name, monthly revenue, a one-sentence rationale for why it needs review, a recommended action label, and two buttons: Approve (green) and Decline (gray outline). Header says 'Reviewed once a day, not a live queue' with a small subtitle showing the count, e.g. '2 accounts need your decision today'. Calm, low-anxiety tone — this is for a non-CS person, not a call-center agent."
> 

**Account Drilldown:**

> "Design a customer account detail page for a subscription intelligence tool. Top section: company name, plan, and a large health score gauge (0-100) with a confidence percentage subtitle. Middle section: a 'Why' card listing 2-3 ranked reasons in plain language. Below that: a 'Recommended Action' card showing either a plan change with price delta, or a non-plan-change action like 'Offer onboarding support' with no price shown. Bottom: a decision status badge (Auto-sent / Pending CSM Review / Manual Investigation) with a short rationale sentence, and a preview of the customer-facing notification card as it would appear in-app."
> 

**Insights:**

> "Design a simple analytics panel titled 'Top Reasons for Value Loss' with one horizontal bar chart showing percentage breakdown across 3-4 categories, clean minimal SaaS analytics style."
> 

Paste each Stitch export into `frontend/src/screens/<Screen>/` as a starting point, strip anything Stitch hardcoded (fake names, fake numbers), and replace with props typed from `contract.md` Section 0.

---

## 5. Folder structure

```
frontend/
  src/
    api/
      client.ts          // single fetch wrapper, USE_MOCKS flag lives here
      types.ts            // TypeScript interfaces copied 1:1 from contract.md Section 0
    mocks/
      accounts.mock.json
      digest.mock.json
      insights.mock.json
      calibration.mock.json
    screens/
      PortfolioList/
      ReviewDigest/
      AccountDrilldown/
      Insights/
    components/
      RiskBadge.tsx
      TierBadge.tsx
      HealthScoreGauge.tsx
    App.tsx
    main.tsx
```

---

## 6. `api/client.ts` pattern (write this Day 1, hour 1 — everything else depends on it)

```tsx
const USE_MOCKS = true; // flip to false at the Day 2 integration checkpoint
const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

async function apiGet<T>(path: string, mockData: T): Promise<T> {
  if (USE_MOCKS) return mockData;
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error((await res.json()).error?.message ?? "Request failed");
  return res.json();
}
```

Every screen calls `apiGet("/accounts", accountsMock)` — never `fetch` directly. This means the moment backend is live, integration is a one-line flag flip, not a rewrite.

---

## 7. Non-negotiables

- Build against `contract.md` types, not against whatever backend happens to return that hour — if backend is behind, mocks keep frontend moving.
- One dashboard shell, not five separate routes that feel like different apps.
- No screen should ever show a price that didn't come verbatim from the `Recommendation.price_delta` field (this mirrors the backend hard-constraint in product.md Section 8 — the renderer must never construct a price from LLM copy text).