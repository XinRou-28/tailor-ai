from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

load_dotenv()

from app.api import accounts, digest, insights, calibration

app = FastAPI(title="Tailor AI Backend")

cors_origins = os.environ.get("CORS_ORIGIN", "http://localhost:3000,http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
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