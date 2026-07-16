# Tailor AI — backend.md

**Owners: Person A (ML: Feature 1 + 1b) + Person B (lead, orchestration/API: Feature 2, 3, endpoints)**

---

## 1. Stack

- **API framework:** FastAPI (chosen over Node/Express — scikit-learn lives natively in the same process, no cross-language model-serving hop)
- **Database:** SQLite (`tailor.db`), synthetic ProjectFlow dataset, 500-1000 rows
- **ML:** scikit-learn — Logistic Regression or XGBoost, calibrated with `CalibratedClassifierCV` (Platt/isotonic)
- **LLM:** OpenAI API, JSON mode, used only in Feature 5 (copy generation) — never for scoring, reasoning, or deciding
- **Server:** `uvicorn`, CORS enabled for the Vite dev origin and the deployed frontend URL

---

## 2. Folder structure

```
backend/
  app/
    main.py                 // FastAPI app, CORS, route registration
    api/
      accounts.py            // GET /accounts, GET /accounts/{id}, POST decision
      digest.py               // GET /digest
      insights.py              // GET /insights, GET /calibration
    data/
      synthetic_dataset.py    // generates the 500-1000 row ProjectFlow dataset
      catalog.py               // the Section 1 plan/add-on catalog as a Python constant — Feature 2 reads ONLY from here
      db.py                     // SQLite connection + schema
    models/
      scoring_model.py         // Feature 1: trains + loads the calibrated classifier
      calibration.py            // generates reliability curve + confusion matrix for /calibration
    agents/
      investigation_agent.py   // Feature 1b: narrow agent, writes ONLY to reason_code
      tools/
        support_ticket_tool.py
        feature_usage_tool.py
    engine/
      recommendation_engine.py // Feature 2: deterministic, table-driven, reads catalog.py
    decision/
      trust_layer.py             // Feature 3: the ONE place that reads confidence + revenue/renewal
    copy/
      copy_generator.py          // Feature 5: LLM call, JSON-mode, price/plan fields forbidden by system prompt AND stripped in code
    orchestrator.py             // ties score -> (maybe investigate) -> recommend -> decide -> (on demand) copy
  tests/
    test_trust_layer.py         // table-driven tests for every confidence/stakes combination in product.md Section 6
    test_recommendation_engine.py
  requirements.txt
```

---

## 3. Data model (SQLite schema — mirrors product.md Section 4 input fields)

```sql
CREATE TABLE accounts (
  customer_id TEXT PRIMARY KEY,
  company_name TEXT,
  current_plan TEXT,
  seats_purchased INTEGER,
  seats_active INTEGER,
  advanced_analytics_used INTEGER,   -- 0/1
  api_calls_used INTEGER,
  storage_used_gb INTEGER,
  login_frequency_30d INTEGER,
  login_frequency_60d INTEGER,
  support_tickets_open INTEGER,
  support_tickets_resolved INTEGER,
  support_sentiment_score REAL,
  payment_delay_days INTEGER,
  contract_renewal_date TEXT,
  monthly_revenue REAL
);

CREATE TABLE scores (
  customer_id TEXT PRIMARY KEY,
  health_score REAL,
  confidence REAL,
  risk_level TEXT,
  top_reasons TEXT,      -- JSON array, serialized
  reason_code TEXT,
  investigated INTEGER,  -- 0/1, set by 1b
  scored_at TEXT
);

CREATE TABLE decisions (
  customer_id TEXT PRIMARY KEY,
  tier TEXT,
  rationale TEXT,
  outcome TEXT,          -- null / "approved" / "declined" — written by POST /decision
  decided_at TEXT,
  recorded_at TEXT
);
```

`recommendations` and `notifications` are computed on read (deterministic + cheap), not persisted — simplifies the demo, avoids stale-cache bugs.

---

## 4. Orchestration pipeline (`orchestrator.py`)

This is the sequence Person B wires up — matches product.md's build order exactly:

```python
def process_account(customer_id: str) -> AccountDetail:
    account = db.get_account(customer_id)
    score = scoring_model.score(account)                      # Feature 1

    if 0.5 <= score.confidence <= 0.75:                        # borderline band
        score = investigation_agent.investigate(account, score)  # Feature 1b, updates reason_code ONLY

    recommendation = recommendation_engine.recommend(score)     # Feature 2, reads catalog.py
    decision = trust_layer.decide(score, account)                # Feature 3, ONLY place reading revenue/renewal
    return AccountDetail(account, score, recommendation, decision, notification=None)
```

`Notification` is generated on-demand (`copy_generator.generate(...)`) when the drilldown screen is opened, not precomputed for all 500-1000 accounts — keeps LLM cost near zero, matches product.md Section 12.

---

## 5. Hard constraints to enforce in code (not just describe in the pitch)

- **`investigation_agent.py`** — its return type is literally `ReasonOverride(reason_code: str)`. It has no access to write to `price_delta`, `tier`, or `current_plan`. This is enforced by the function signature, not a comment.
- **`recommendation_engine.py`** — every returned `line_items` string and `price_delta` must be computable purely from `catalog.py` constants + the input reason_code. No LLM call, no free-text price. Unit test: for every `ReasonCode`, assert output price/line items exist in `catalog.py`.
- **`trust_layer.py`** — the only function anywhere in the codebase that reads `account.monthly_revenue` or `account.contract_renewal_date` for decisioning purposes. Grep the codebase before demo day to confirm no other module touches these fields for a tier/action decision.
- **`copy_generator.py`** — system prompt explicitly instructs: "Never include a dollar amount or plan name in your response." Additionally, after the OpenAI call returns, code checks the JSON response has no `price` or `plan` key, and the frontend renderer only ever displays `price_delta` from the locked `Recommendation` object, never from LLM text — this is a two-layer defense (prompt + code), matching product.md Section 8.

---

## 6. Endpoints (implements `contract.md` — do not deviate from those field names)

```python
# app/api/accounts.py
@router.get("/accounts")
def list_accounts(risk_level: str | None = None, tier: str | None = None): ...

@router.get("/accounts/{customer_id}")
def get_account_detail(customer_id: str): ...

@router.post("/accounts/{customer_id}/decision")
def record_decision(customer_id: str, outcome: Literal["approved", "declined"]): ...

# app/api/digest.py
@router.get("/digest")
def get_digest(): ...

# app/api/insights.py
@router.get("/insights")
def get_insights(): ...

@router.get("/calibration")
def get_calibration(): ...
```

---

## 7. Build order for Person A + Person B (Day 1-2, detail lives in workflow.md)

1. `synthetic_dataset.py` + `catalog.py` (shared dependency — build first, together, Day 1 hour 1-2)
2. Person A: `scoring_model.py` + `calibration.py`
3. Person A: `investigation_agent.py` + tools
4. Person B: `recommendation_engine.py` (can start as soon as `catalog.py` exists, doesn't need the model)
5. Person B: `trust_layer.py`
6. Person B: `orchestrator.py` + all `api/` routes, wired to real SQLite by Day 2 midday
7. Person A or B (whoever's free): `copy_generator.py`

---

## 8. Testing checklist before demo

- [ ]  `test_trust_layer.py` covers all 3 rows of product.md Section 6's table with edge values (confidence exactly 0.85, renewal exactly 30 days out)
- [ ]  `test_recommendation_engine.py` — every `ReasonCode` maps to a real catalog line item
- [ ]  `/calibration` returns non-fake numbers generated from actual held-out synthetic data, not hardcoded — this is the acceptance criteria from product.md Section 4
- [ ]  Manual grep: confirm `investigation_agent.py` and `copy_generator.py` have no write path to price/plan/tier fields