# Tailor AI — workflow.md
### Restructured for 3 people: 1 Repo Setup, 2 Full-Stack Builders (Frontend on Stitch, Backend on Copilot/Claude Code)

Read `product.md`, `contract.md`, `frontend.md`, `backend.md` first (all four live in `docs/`, committed by Person 1 in the first task below). This file is the day-by-day schedule that ties them together — every day is broken down **per person**, and every integration step is called out explicitly, in place, on the day it happens — not tucked into a separate section at the end.

---

## Roles

| Person | Role | Day 1 | Day 2 | Day 3 |
|---|---|---|---|---|
| **Person 1** | Repo Setup (Day 1 only — unavailable from Day 2 onward) | Repo setup **only** | — (not available) | — (not available) |
| **Person 2/3** | Frontend + Backend Engineers | Person 2: Screens 1–2. Person 3: dataset, catalog, stub API | Person 2: Screens 3–5. Person 3: real model + engines + routes. **Both share the Integration Checkpoint and deployment**, split as noted below | Both share final regression, polish, and submission logistics |


---

## 🔒 Golden Rule (applies all 3 days)

**`contract.md` freezes at the end of Person 1's Day 1 setup and does not change without a team-channel message + a 1-line edit, then everyone re-pulling.** Nearly every integration bug traces back to someone quietly deviating from this file — see the "Things to Take Note Of" section at the bottom for exactly how Stitch and Copilot/Claude Code each tend to cause this.

---

## Day 1 — Setup (Person 1) and independent foundations (Person 2 + 3)

### Person 1 (Repo Setup) — Hour 0 to 1 — **this is their entire Day 1**

1. Create the GitHub repo `tailor-ai`.
2. Protect `main` (no direct pushes from here on). Create `dev` as the shared integration branch.
3. Commit the folder skeleton:
```
tailor-ai/
  frontend/
  backend/
  docs/            # product.md, contract.md, frontend.md, backend.md, workflow.md
  README.md
```
4. Commit `product.md`, `contract.md`, `frontend.md`, `backend.md`, `workflow.md` into `docs/` — this first commit is what "freezes" the contract.
5. Create a GitHub Project board (Kanban: Day 1 / Day 2 / Day 3 columns), one card per task in this document, assigned by name.
6. Set branch naming convention: `feature/<initial>-<short-name>`, e.g. `feature/2-portfolio-list`, `feature/3-scoring-model`.
7. Add `.env.example` to both `frontend/` and `backend/` (placeholders only — `VITE_API_URL`, `OPENAI_API_KEY`).
8. Post in the team channel: *"docs/ is frozen — any field-name change needs a message here first."*
9. **Stop here for the day — and for the rest of the build.** Person 1 is not involved in Day 1 feature-building and is unavailable from Day 2 onward. Person 2 and Person 3 take over everything else from here, including what would otherwise have been Person 1's integration/deployment work (see Day 2 below).

### Person 2 (Frontend) — Hour 1 to 8, independent of Person 1

- Hour 1–2: `npm create vite@latest` → React + TypeScript + Tailwind + Recharts. Copy `contract.md` Section 0 interfaces verbatim into `frontend/src/api/types.ts`.
- Hour 2–3: Write `frontend/src/mocks/accounts.mock.json` with 5 hand-written accounts, including the exact ABC Company object from `contract.md` Section 5. Write `api/client.ts` with `USE_MOCKS = true` (frontend.md Section 6).
- Hour 3–5: Stitch prompts for **Portfolio List** and **Account Drilldown** (frontend.md Section 4). Export, convert into real components reading from the mock file — not Stitch's placeholder data.
- Hour 5–8: Stitch prompts for **Review Digest** and **Insights** screens. Convert into components. Shared components (`RiskBadge`, `TierBadge`, `HealthScoreGauge`) built once, reused everywhere.
- **End of Day 1:** all 4 screens exist and click through cleanly on mock data. Push to `dev`.

### Person 3 (Backend) — Hour 1 to 8, independent of Person 1

- Hour 1–3: Build the synthetic dataset (`backend/app/data/synthetic_dataset.py`) — this now sits with Person 3, since it directly feeds the model they build next.

  **Prompt:**
  > "Generate a Python script using pandas and faker that creates 800 synthetic B2B SaaS customer accounts for a fictional company called ProjectFlow, matching this exact schema: [paste `backend.md` Section 3 SQL schema]. Make the data internally correlated — accounts with a big drop between `login_frequency_30d` and `login_frequency_60d` should also tend to have lower `advanced_analytics_used` and lower `support_sentiment_score`. Include one exact hand-crafted row matching the ABC Company worked example: [paste from `product.md` Section 4]. Add a synthetic `actual_outcome` label column (renewed / downgraded / churned) for later model training and calibration validation."

  Also transcribe `catalog.py` directly from `product.md` Section 1's pricing table (15 minutes, no AI needed).

- Hour 3–4: Scaffold FastAPI app (`main.py`, CORS allowing `localhost:5173`), Pydantic models matching `contract.md` Section 0 exactly.
- Hour 4–5: Build **stub endpoints** returning hardcoded JSON that exactly matches `contract.md`'s example payloads — this is what lets Person 2 build against something real-shaped without waiting on real logic.
- Hour 5–8: Train `scoring_model.py` on the dataset from Hour 1–3 — Logistic Regression/XGBoost, wrapped in `CalibratedClassifierCV`. Get `score(account) -> ScoreResult` returning real output on sample rows.
- **End of Day 1:** stub endpoints live, real dataset generated, a rough-but-real scoring model producing output. Push to `dev`.

### Person 2/3 — Hour 8, 30 minutes, end of Day 1

- Person 2 and Person 3 sync directly (Person 1 is not part of this or any later sync). Demo current state to each other: mock-driven frontend, stub-then-real backend.
- Read `contract.md` Section 0 out loud against Person 2's `types.ts` and Person 3's Pydantic models — confirm zero drift on Day 1 before it compounds.
- Merge everything to `dev`.
- Then do the `dev` → `main` merge (GitHub → Pull Requests → New PR → base: `main`, compare: `dev` → Create → Merge).

---

## Day 2 — Real logic + **the integration day** (Person 2 and Person 3 only — Person 1 is not available)

### Person 3 (Backend) — Hour 0 to 3

Build, in order: `investigation_agent.py`, `recommendation_engine.py`, `trust_layer.py` (backend.md Section 4/6 has the exact prompts — paste the tables from `product.md` Sections 5 and 6 verbatim, don't paraphrase them in the prompt). Wire the real DB + real model + these three engines into `orchestrator.py`, replacing the Day 1 stub JSON with real data end to end.

### Person 2 (Frontend) — Hour 0 to 3

Finish converting remaining Stitch exports into components (Digest, Insights, and the Calibration panel). Everything still reads from mocks — **do not flip `USE_MOCKS` yet**, that happens together with Person 3 at Hour 3.

### Person 2/3 (shared — Integration Prep) — Hour 0 to 3

With no Person 1 available for this or any later block, integration prep is folded into each person's own morning work instead of being a separate dedicated task:
- Person 3 self-checks each endpoint against `contract.md`'s example payloads *as they build it* (not after) — hit it with a REST client (Postman/Thunder Client/`curl`) the moment it's wired to real data, before moving to the next engine.
- Person 2, in the last 30 minutes before Hour 3, does a quick pass comparing their mock JSON shapes one more time against `contract.md` Section 0 — this is the cheapest possible moment to catch a drifted mock field, right before it would otherwise surface mid-checkpoint.
- Whoever finds a mismatch posts it in the team channel immediately rather than saving it for the checkpoint — the goal is to walk into Hour 3 with as short a punch list as possible, ideally none.

### 🔗 Hour 3 — INTEGRATION CHECKPOINT — Person 2 + Person 3, ~90 minutes

This is the explicit integration step for the whole build — spelled out here, on the day it happens, not deferred to an appendix. With Person 1 unavailable, this checkpoint is co-led by whoever built each side:

1. Person 3 confirms backend is running on `:8000` with real data (not stubs) for every route.
2. Person 2 flips `USE_MOCKS = false` in `api/client.ts`, runs frontend on `:5173`.
3. Person 3 walks through any mismatches flagged during the morning's self-checks first, confirming each is fixed; Person 2 does the same for anything they flagged.
4. Then both walk the full user journey live, together at one screen: **Portfolio List → click ABC Company → Drilldown (health score 35, confidence 0.68, agent-flipped reason, "offer onboarding support," csm_review tier) → Digest (ABC Company appears) → Approve → Insights.**
5. Any new mismatch found here: check `contract.md` first. Fix in the backend serializer if it's a naming/shape issue — frontend should never patch around a backend inconsistency.
6. Once the full click-through is clean, merge to `dev`, tag `integration-checkpoint-1`., then merge `dev` → `main` the same way (GitHub PR, base `main` / compare `dev`).

### Person 3 (Deployment — backend) — Hour 5 to 6

Push backend to Render. Confirm CORS is configured for the eventual deployed frontend URL (Person 2 will share it once Vercel assigns one), not just `localhost`.

### Person 2 (Deployment — frontend) — Hour 5 to 6

Push frontend to Vercel with `VITE_API_URL` pointed at Person 3's deployed backend URL. Test by hitting the deployed frontend directly (not the local dev server) to confirm the real API calls succeed, not just that the page loads.

### Person 3 — Hour 6 to 7

Build `copy_generator.py` (Feature 5) using the prompt in `backend.md`. Wire into the drilldown endpoint on demand. Push to `dev`, redeploy backend on Render.

### Person 2 — Hour 6 to 7

Polish the Account Drilldown screen specifically (loading states, the score → reason → recommendation → decision → notification flow reading as one continuous story). Push to `dev`, redeploy frontend on Vercel.

### Person 2/3 — Hour 7 to 8

- Full run-through against the **deployed** URLs (not localhost) — this is the second, separate integration pass, catching CORS/env issues a full day before the recording.
- Confirm the ABC Company example still renders identically to the local version.
- **End of Day 2:** merge to `dev`, tag `integration-checkpoint-2`. then merge `dev` → `main` (same GitHub PR method).

---

## Day 3 — Feature 4, resilience, demo prep, submission

### Person 3 — Hour 0 to 2

`test_trust_layer.py` and `test_recommendation_engine.py` — table-driven, every branch + edge values (confidence exactly 0.85, renewal exactly 30 days out). Grep the codebase to confirm `investigation_agent.py` and `copy_generator.py` have zero write path to price/plan/tier. Once tests pass, run one full deployed click-through cold, focused on the backend side (every endpoint responding correctly on the real deployed URL).

### Person 2 — Hour 0 to 2

Build the Feature 4 static chart (lowest priority, last per `product.md` Section 13). Add empty/loading states across all 5 screens. Prep the recording environment: clean browser profile, no dev tools visible, ping the Render backend 5+ minutes ahead of any recording to avoid cold-start lag on camera.

### Person 2/3 — Hour 2 to 3

Jointly draft the demo narration script, keeping the ABC Company story as the spine (matches `video_plan.md`) — this only takes both of you 20-30 minutes since the click-path is already proven from Day 2's checkpoints.

### Person 2/3 — Hour 3 to 4

- **Final integration check** before recording: one last full click-through together against the production/deployed URLs (not localhost) — same method as the Day 2 checkpoint, just faster since it's the third time doing it.
- Full dry run of the demo/recording, timed against `video_plan.md`.
- Record the actual demo footage while the app is freshest and most stable.

### Buffer — Hour 4 to 6

Reserved for whatever breaks the morning of. No new features — only bug fixes.

### Final hour — Person 2/3

- Final `dev` → `main` merge, tag `v1.0`.
- Split submission logistics between the two of you: one finalizes and exports the proposal, the other uploads the video to YouTube (Unlisted or Public) and tests both links in an incognito window before submitting.

---

## Things to Take Note Of

### Frontend / Stitch — it will keep prompting you to change things

- **Lock design tokens on the first prompt, reuse them explicitly** in every later prompt ("match the existing style — same palette and card layout as Portfolio") instead of a fresh unconstrained prompt per screen.
- **Treat each Stitch export as a one-time starting point.** Once pasted into `frontend/src/screens/`, further edits happen by hand — not by re-prompting and re-exporting over your data-wiring work.
- **Never let Stitch rename a field.** If its component expects `customerName` but the contract says `company_name`, fix the component, not the contract.
- **Don't accept every "nicer" restructuring Stitch offers on a re-prompt** — a layout change that moves where the health score gauge sits is a scope decision, not a default to accept because the preview looked more polished.

### Backend / Copilot / Claude Code — it will happily "improve" things you didn't ask for

- **Paste the exact contract shape into every prompt**, never a paraphrase — assistants will confidently invent a slightly different field name or wrapper object if given a prose description instead of the literal shape.
- **Review every AI-generated diff before accepting it**, especially in `trust_layer.py`, `recommendation_engine.py`, and `investigation_agent.py` — the three files with hard constraints an assistant might blur across files if not told explicitly not to.
- **Commit after every accepted suggestion**, not after a whole feature — makes it trivial to revert one bad AI-generated change.
- **Re-run the hard-constraint grep check after any big AI-assisted refactor**, not just once at the end.