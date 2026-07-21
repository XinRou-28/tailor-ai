<h1 align="center">Tailor AI — Subscription Intelligence</h1>
<div align="center">
  
## “Tailor Every Subscription to Fit Your Business.”

Case Study 2: Smart Subscription & Customer Experience Optimisation

Team **hoo lee not sheet** — Soo Xin Rou, Tan Pei Shing, Tee Wen Yun, Yong Yee Wing



---

### Demo Link: [Tailor AI](https://tailor-ai-hlns.vercel.app/)
Note: The demo may take 10 seconds to load on the first visit as the server wakes up.Thank you for your patience!

</div>

---



## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Installation & Usage](#installation-and-usage)

---

## Overview
Tailor AI is an AI-powered smart subscription and customer experience optimisation platform. It helps businesses identify customers whose subscriptions no longer match their needs, understand the underlying reasons, and recommend the right intervention before they churn. By consolidating scattered customer data into a unified profile and analysing behaviour, Tailor AI proactively recommends personalised actions—such as onboarding support, better-fitting subscription plans, or upgrades. Furthermore, it provides portfolio-level business intelligence by analysing aggregated customer data to identify recurring churn drivers, supporting strategic decision-making.

---

## Key Features

### 🧠 AI Customer Intelligence Engine
Analyses customer behaviour to generate an **explainable Customer Health Score**. Borderline cases trigger an Investigation Agent that digs into support/usage data to find the real root cause before recommending anything.

### 🎯 Right-Size Recommendation Engine
Recommends the most appropriate subscription plan or intervention by recombining the business's **own existing pricing catalogue** — never inventing a price.

### 🛡️ Trust-Based Decision Layer
Decides whether a recommendation auto-sends, needs one-click approval, or requires full manual review, based on AI confidence and business impact.

### ✉️ AI Communication Layer
Drafts personalised customer messages after a decision is finalised — structurally unable to alter price, plan, or the decision itself.

### 📊 Business Insight Dashboard
Aggregates root causes across the whole portfolio to surface recurring churn drivers (e.g. *"42% of at-risk accounts: unused Advanced Analytics"*) and turns them into company-wide strategy.

---

## Tech Stack

**Frontend:** React 19 · TypeScript · Vite · Tailwind CSS 4 · Motion · Lucide React

**Backend:** FastAPI · Uvicorn · SQLAlchemy · Pydantic · python-dotenv

**AI / ML:** Scikit-learn · XGBoost · Pandas · NumPy · Mistral AI API (customer communication)

**Database:** SQLite

**Deployment:** Vercel (frontend) · Render (backend)

---

## Installation and Usage

### Prerequisites
- Node.js
- Python 3.10+
- A [Mistral AI](https://mistral.ai) API key *(optional — see note below)*

### 1. Backend

```bash
cd backend
pip install -r requirements.txt --break-system-packages
```

Create `backend/.env`:

```env
MISTRAL_API_KEY=your_mistral_key_here
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
```

Train the model (first time only):

```bash
python app/ml/train.py
```

Run the backend:

```bash
python -m uvicorn app.main:app --reload
```

→ Runs at `http://localhost:8000`

### 2. Frontend

```bash
cd tailor-aiFinalFrontend
npm install
```

Create `.env`:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

Run the frontend:

```bash
npm run dev
```

→ Runs at `http://localhost:3000`

> ⚠️ Start the backend **before** the frontend. Without `MISTRAL_API_KEY`, AI-generated messages fall back to templates automatically — the app still works fully for demo purposes.

---


