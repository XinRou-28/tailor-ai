from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import accounts, digest, insights, calibration

app = FastAPI(title="Tailor AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def health_check() -> dict[str, str]:
    return {"message": "Tailor AI backend running"}


app.include_router(accounts.router)
app.include_router(digest.router)
app.include_router(insights.router)
app.include_router(calibration.router)
