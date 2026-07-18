from __future__ import annotations

from pathlib import Path

from sqlalchemy import JSON, Boolean, Column, Float, Integer, String, Text, create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

BASE_DIR = Path(__file__).resolve().parents[1]
DATABASE_PATH = BASE_DIR / "data" / "projectflow.db"
DATABASE_URL = f"sqlite:///{DATABASE_PATH.as_posix()}"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class Account(Base):
    __tablename__ = "accounts"

    customer_id = Column(String, primary_key=True, index=True)
    company_name = Column(String, nullable=True)
    customer_contact = Column(String, nullable=True)
    contact_email = Column(String, nullable=True)
    current_plan = Column(String, nullable=True)
    seats_purchased = Column(Integer, nullable=True)
    seats_active = Column(Integer, nullable=True)
    advanced_analytics_used = Column(Integer, nullable=True)
    api_calls_used = Column(Integer, nullable=True)
    storage_used_gb = Column(Integer, nullable=True)
    login_frequency_30d = Column(Integer, nullable=True)
    login_frequency_60d = Column(Integer, nullable=True)
    support_tickets_open = Column(Integer, nullable=True)
    support_tickets_resolved = Column(Integer, nullable=True)
    support_sentiment_score = Column(Float, nullable=True)
    payment_delay_days = Column(Integer, nullable=True)
    contract_renewal_date = Column(String, nullable=True)
    monthly_revenue = Column(Float, nullable=True)


class Score(Base):
    __tablename__ = "scores"

    customer_id = Column(String, primary_key=True, index=True)
    health_score = Column(Float, nullable=True)
    confidence = Column(Float, nullable=True)
    risk_level = Column(String, nullable=True)
    top_reasons = Column(Text, nullable=True)
    reason_code = Column(String, nullable=True)
    investigated = Column(Integer, nullable=True)
    scored_at = Column(String, nullable=True)


class Investigation(Base):
    __tablename__ = "investigations"

    customer_id = Column(String, primary_key=True, index=True)
    reason_code = Column(String, nullable=True)
    investigated = Column(Integer, nullable=True)
    investigated_at = Column(String, nullable=True)


class Recommendation(Base):
    __tablename__ = "recommendations"

    customer_id = Column(String, primary_key=True, index=True)
    action_type = Column(String, nullable=True)
    line_items = Column(JSON, nullable=True)
    price_delta = Column(Float, nullable=True)
    reason_code = Column(String, nullable=True)


class Decision(Base):
    __tablename__ = "decisions"

    customer_id = Column(String, primary_key=True, index=True)
    tier = Column(String, nullable=True)
    rationale = Column(Text, nullable=True)
    outcome = Column(String, nullable=True)
    decided_at = Column(String, nullable=True)
    recorded_at = Column(String, nullable=True)


class Notification(Base):
    __tablename__ = "notifications"

    customer_id = Column(String, primary_key=True, index=True)
    headline = Column(String, nullable=True)
    body = Column(Text, nullable=True)
    cta_label = Column(String, nullable=True)
    generated_at = Column(String, nullable=True)


Base.metadata.create_all(bind=engine)
