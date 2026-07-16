**Tagline:** *"An AI that tailors your subscription to fit."*

**Category:** Case Study 2: Smart Subscription & Customer Experience Optimization

**One-line pitch:** Tailor AI helps subscription businesses understand *why* a customer is losing value, recommend the right intervention — not just a downgrade — and safely decide when AI can act alone versus when a human needs to step in.

---

## 1. The Demo Scenario (build against this, not an abstraction)

To keep the build coherent, everything is demoed against **one fictional B2B SaaS company**, not a multi-tenant marketplace.

**Fictional client: "ProjectFlow"** — a project-management SaaS tool, seat-based pricing with modular add-ons. This mirrors real modular pricing (Slack/HubSpot-style), which is a deliberate choice — Tailor AI's recommendation engine works by recombining a company's *existing* plan catalog, not inventing new pricing (see Section 5).

**ProjectFlow's plan catalog (what our engine is allowed to recommend from):**

| Plan | Base price | Included |
| --- | --- | --- |
| Starter | $29/mo | 5 seats, 5GB storage, no API access |
| Professional | $99/mo | 20 seats, 50GB storage, 10,000 API calls/mo |
| Enterprise | $299/mo | 100 seats, 500GB storage, 100,000 API calls/mo, Advanced Analytics, Priority Support |

**Add-ons (à la carte, stackable on any plan):**

- Extra seats: $4/seat/mo
- Extra storage: $10/50GB/mo
- Extra API calls: $15/10,000 calls/mo
- Advanced Analytics (if not on Enterprise): $49/mo
- Priority Support (if not on Enterprise): $29/mo

This catalog is the ground truth our pricing engine reads from — every recommendation must resolve to a combination of these exact line items. This is what makes plans "tailored" without the AI inventing prices out of thin air.

---

## 2. Users & Personas

- **Primary demo persona (business side):** Mei, an Ops Lead at ProjectFlow — no dedicated data science team, no large CS team. She's the one who sees the dashboard and clicks approve on the review queue (relevant for Section 7's automation defaults).
- **Secondary persona (customer side):** "ABC Company," a ProjectFlow customer on the Enterprise plan showing signs of under-utilization — our worked example throughout this doc.

---

## 3. Key Innovations (what makes this more than a churn-prediction dashboard)

1. **Value recovery, not just churn prediction.** Most tools stop at "80% chance of leaving." Tailor AI classifies *why* value is dropping and recommends the matching fix — which might not be a downgrade at all (see Feature 2).
2. **A narrow, honest investigation agent.** Only activates for the borderline-confidence minority of accounts, checks exactly one additional data source to disambiguate the reason, and never touches price or plan — it only updates the *reason*, which can change the recommended *action type* (Section 5).
3. **Confidence-tiered automation with one single decision owner.** Exactly one component (Feature 3) decides whether a case auto-sends, needs approval, or needs manual review. No other feature checks revenue or risk — this avoids the "two features silently disagree" failure mode.

---

## 4. Feature 1 — AI Customer Intelligence Engine (Tier 1 — build first)

**Answers:** "What's happening with this customer, and how confident are we?"

**Input (synthetic data fields per account):**

```
customer_id, company_name, current_plan, seats_purchased, seats_active,
feature_usage: { advanced_analytics_used: bool/frequency, api_calls_used, storage_used_gb },
login_frequency_30d, login_frequency_60d (for trend),
support_tickets: { count_open, count_resolved, sentiment_score },
payment_delay_days, contract_renewal_date, monthly_revenue
```

**Model:** Logistic Regression or XGBoost (scikit-learn), trained on synthetic labeled churn/expansion outcomes.

**Output:**

```
health_score: 0-100
confidence: calibrated probability (0-1)
risk_level: Low / Medium / High
top_reasons: ranked list of the 2-3 features driving the score (from feature importance)
```

**Worked example (ABC Company, Enterprise plan):**

```
Health Score: 35/100
Confidence: 0.68 (medium — will trigger agent branch, see Feature 1b)
Risk: High
Top reasons:
 1. Advanced Analytics unused (0 sessions in 30 days)
 2. Login frequency down 60% (30d vs 60d)
 3. 3 unresolved support tickets
```

**Acceptance criteria for demo:** a reliability curve (predicted confidence vs. actual outcome frequency, on held-out synthetic data) and a confusion matrix broken out by automation tier must be ready to show. If not finished, say so — don't imply it's validated when it isn't (Section 9).

### 4b. Investigation Agent (narrow scope — only fires on medium-confidence cases)

**Trigger condition:** confidence falls in a defined borderline band (e.g., 0.5–0.75) — not every account.

**What it does:** picks *one* additional tool based on what's missing for that case:

- Support Ticket Sentiment Tool (is the drop tied to a complaint/bug?)
- Feature Usage Drilldown Tool (did they ever use the feature, or never onboard onto it?)

**Worked example continued:** Agent checks support tickets for ABC Company, finds the 3 open tickets are all "how do I use Advanced Analytics" onboarding questions, not complaints. It updates the reason field from *"feature abandoned"* to *"feature never successfully onboarded."* This single change flips the downstream recommendation (Feature 2) from "downgrade" to "offer onboarding support first."

**Hard constraint:** the agent can only update the `reason` field. It cannot touch price, plan, seats, or the automation-tier decision. This must be enforced at the code level (the agent's tool outputs feed only into a `reason_override` field, nothing else), not just described in the pitch.

---

## 5. Feature 2 — Right-Size Recommendation Engine (Tier 1)

**Answers:** "Given the health score and the *reason*, what's the concrete next step?"

**Logic (deterministic — reads from the ProjectFlow catalog in Section 1, never invents a price):**

| Reason classification | Recommended action |
| --- | --- |
| Feature unused because not needed | Downgrade / drop the specific add-on |
| Feature unused because of onboarding difficulty (from Feature 1b) | Offer onboarding support — **no plan change yet** |
| Feature unused because of a technical/support issue | Route to support — **no plan change yet** |
| Usage repeatedly exceeds plan limits (seats/API/storage) | Upgrade — add the specific capacity that's being exceeded |

**Worked example continued:** ABC Company's recommendation is now "offer onboarding support for Advanced Analytics" — not a downgrade — because the agent reclassified the reason.

**Explicit non-responsibility:** this engine does **not** check revenue, contract timing, or decide whether to auto-send. That is Feature 3's job alone (see below) — this is the single-decision-owner fix that prevents two features from quietly disagreeing.

---

## 6. Feature 3 — Trust-Based Decision Layer (Tier 1 — the core differentiator)

**Answers:** "Can AI act on this alone, or does a human need to be involved?"

**The only feature that reads:** confidence (from Feature 1) + business stakes (revenue, contract renewal proximity).

| Confidence | Stakes | Action |
| --- | --- | --- |
| High (e.g. >0.85) | Low/medium revenue, no near-term renewal | **Auto-send** |
| Medium, or any confidence | High revenue or renewal within 30 days | **CSM review** (one-click approve) |
| Low (e.g. <0.5) | Any | **Manual investigation**, no auto-plan generated |

**Small-team default (important for our target user — see Section 3, persona Mei):** ProjectFlow has no dedicated CS team, so the "review" tier does **not** mean a live queue someone must babysit. It means a **daily digest**: one email/in-app summary, "2 accounts need your decision today," reviewed once by Mei, not a dashboard she has to monitor continuously. Thresholds start conservative (more goes to review) and loosen automatically as real accept/decline outcomes accumulate for ProjectFlow specifically (Section 10, feedback loop).

**This is the direct, quotable answer to Case Study 2's line:** *"balance automation with human decision-making so the company can... [manage] many customers efficiently."*

---

## 7. Feature 4 — Business Insight Dashboard (Tier 2 — simplified for demo)

**What's built for the demo:** one static aggregated bar chart across all synthetic ProjectFlow accounts — "Top reasons for value loss": e.g. 42% unused Advanced Analytics, 30% poor onboarding, 18% missing integrations.

**What's said, not built:** *"In production this becomes a standing business advisor — flagging patterns like 'Advanced Analytics is unused across 40% of at-risk accounts' and recommending a company-wide fix, like a tutorial campaign."* We show the underlying pattern is real (it's an aggregation of Feature 1's real output), we don't build a live auto-generated strategy engine.

---

## 8. Feature 5 — AI Communication Layer (Tier 1, cheap — in-app only)

**Answers:** "How do we explain this to the customer in plain language?"

**Input:** the finished, already-decided object only — `{customer_name, current_plan, recommended_action, reason, price_delta}`. Never raw model output, never a decision to make.

**Output example (ABC Company, onboarding-support case):**

> "We noticed your team hasn't started using Advanced Analytics yet. Rather than change your plan, we'd like to offer a quick onboarding session to help your team get value from it."
> 

**Hard constraint enforced in code, not just in the prompt:** the LLM call is JSON-mode, and the system prompt explicitly forbids emitting a price or plan field — the renderer only ever displays fields it received verbatim from the locked plan object, so even a hallucinated number in the copy text can't reach the price shown to the customer.

**Delivery:** in-app notification card inside the dashboard only. Email is mentioned as the natural next channel, not built (cheaper, demos in one click: click account → notification appears).

---

## 9. Known Limitations (say these before a judge finds them)

- **Data integration is simulated.** All customer data above is synthetic. Real integration with a live billing/analytics stack (Stripe, Segment, etc.) is the explicit next phase, not built for the hackathon.
- **Confidence calibration is a claim to prove, not assume.** The reliability curve and tiered confusion matrix (Feature 1) must actually be generated and shown. If incomplete by demo day, say so plainly.
- **"Review" still requires a human to exist.** Digest mode reduces workload; it doesn't remove the need for someone (even a non-CS person like Mei) to read and act on it.
- **This pricing model assumes a modular catalog.** Tailor AI works well for seat/usage/add-on-based pricing (our ProjectFlow scenario). It is a weaker fit for a rigid 2–3 flat-tier product with no add-ons to recombine — worth stating this targeting boundary explicitly in the pitch.

---

## 10. Feedback Loop (Tier 2 — describe, don't fake a live demo)

Every accepted/declined recommendation becomes a new labeled outcome for *this specific customer's* model, which both (a) improves future accuracy and (b) is what allows Feature 3's auto-send threshold to widen safely over time, specifically for ProjectFlow. Do not attempt to demo a live retrain — describe the mechanism and show, at most, a "before/after" slide of what a threshold shift would look like.

---

## 11. Tech Stack

- **Frontend:** React + Tailwind + Recharts (single dashboard: portfolio list + review digest + account drill-down + notification card)
- **Backend:** FastAPI or Node/Express (orchestration across scoring → agent → recommendation → decision → copy)
- **Data:** SQLite (synthetic ProjectFlow dataset, 500–1,000 accounts), explicitly labeled as a stand-in for a production warehouse
- **ML:** scikit-learn (Logistic Regression / XGBoost, calibrated via Platt scaling or isotonic regression)
- **LLM:** OpenAI API, JSON-mode, copy-generation only
- **Deployment:** Vercel (frontend) + Render/Heroku (backend)

---

## 12. Business Model (brief)

- **Base platform fee**, tiered by number of managed customer accounts.
- **Smaller success fee** tied to retained/expanded revenue Tailor AI is shown to have influenced — ties our revenue to real outcomes, not just installation.
- **Primary cost driver:** compute for the scoring service; LLM cost stays low because it only formats decided plans, never reasons from scratch.

---

## 13. Build Order (for the team, in sequence)

1. Synthetic ProjectFlow dataset (Section 1 catalog + Section 4 fields)
2. Feature 1 — scoring model + calibration validation
3. Feature 1b — narrow investigation agent (borderline band only)
4. Feature 2 — deterministic recommendation engine (reads Section 1 catalog)
5. Feature 3 — trust-based decision layer (single owner, digest-mode default)
6. Feature 5 — in-app LLM copy generation
7. Combined dashboard screen (portfolio + digest + drilldown + notification)
8. Feature 4 — static aggregated chart (last, lowest priority)

**Rule of thumb:** if you can't demo it live in under 15 seconds, it's described in the pitch, not built.

---

## 14. Judging Criteria Mapping

- **Concept / Innovativeness:** "understands *why*, recommends the right intervention (not just downgrade), and knows when to act alone vs. ask a human" — lead with this, not "we predict churn."
- **Methodology:** single decision-owner (Feature 3) + calibration validation (Feature 1) gives precise, non-hand-wavy answers to "how is the automation line drawn."
- **Design:** one coherent dashboard telling one story (score → reason → recommendation → decision → copy), not five disconnected screens.
- **Business Model / Market Potential:** Section 12 plus real retention-economics data (available on request) closes the business-completeness gap most competing teams will leave open.