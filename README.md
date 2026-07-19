# Tailor AI
"An AI that tailors your subscription to fit."

Case Study 2: Smart Subscription & Customer Experience Optimization

See /docs for full project specs: product.md, contract.md, frontend.md, backend.md, workflow.md

## Setup

### Backend
cd backend
pip install -r requirements.txt --break-system-packages

Create `.env` in `backend/` (see `.env.example`):
MISTRAL_API_KEY=your_mistral_key_here
CORS_ORIGIN=http://localhost:3000,http://localhost:5173

Train model (first time only):
python app/ml/train.py

Run:
python -m uvicorn app.main:app --reload

→ http://localhost:8000

### Frontend
cd tailor-aiFinalFrontend
npm install

Create `.env` (see `.env.example`):
VITE_API_BASE_URL=http://localhost:8000/api

Run:
npm run dev

→ http://localhost:3000

## Notes

- Start backend before frontend.
- Without `MISTRAL_API_KEY`, AI-generated text falls back to templates automatically.
- First `/accounts` call is slower (warms up ML cache); after that it's fast.