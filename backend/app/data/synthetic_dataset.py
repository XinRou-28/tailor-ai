from __future__ import annotations

import random
from dataclasses import dataclass
from datetime import date, timedelta
from pathlib import Path

import pandas as pd
from faker import Faker


REFERENCE_DATE = date(2026, 7, 16)
OUTPUT_FILE = Path(__file__).with_name("projectflow_dataset.csv")
TOTAL_ACCOUNTS = 800

PLAN_CONFIG = {
    "Starter": {
        "price": 29,
        "seats": 5,
        "storage_gb": 5,
        "api_calls": 0,
    },
    "Professional": {
        "price": 99,
        "seats": 20,
        "storage_gb": 50,
        "api_calls": 10000,
    },
    "Enterprise": {
        "price": 299,
        "seats": 100,
        "storage_gb": 500,
        "api_calls": 100000,
    },
}

PLAN_WEIGHTS = [
    ("Starter", 0.45),
    ("Professional", 0.35),
    ("Enterprise", 0.20),
]


@dataclass
class AccountFeatures:
    customer_id: str
    company_name: str
    current_plan: str
    seats_purchased: int
    seats_active: int
    advanced_analytics_used: int
    api_calls_used: int
    storage_used_gb: int
    login_frequency_30d: int
    login_frequency_60d: int
    support_tickets_open: int
    support_tickets_resolved: int
    support_sentiment_score: float
    payment_delay_days: int
    contract_renewal_date: str
    monthly_revenue: int
    actual_outcome: str
    customer_contact: str
    contact_email: str


def weighted_choice(items: list[tuple[str, float]]) -> str:
    roll = random.random()
    cumulative = 0.0
    for item, weight in items:
        cumulative += weight
        if roll <= cumulative:
            return item
    return items[-1][0]


def clamp(value: float, minimum: float, maximum: float) -> float:
    return max(minimum, min(maximum, value))


def build_company_name(fake: Faker, used_names: set[str], fallback_suffix: str) -> str:
    company_name = fake.company()
    if company_name not in used_names:
        used_names.add(company_name)
        return company_name

    company_name = f"{company_name} {fallback_suffix}"
    used_names.add(company_name)
    return company_name


def generate_outcome(features: dict[str, object]) -> str:
    login_30d = int(features["login_frequency_30d"])
    login_60d = int(features["login_frequency_60d"])
    analytics_used = int(features["advanced_analytics_used"])
    support_sentiment = float(features["support_sentiment_score"])
    payment_delay_days = int(features["payment_delay_days"])
    support_tickets_open = int(features["support_tickets_open"])
    seats_purchased = int(features["seats_purchased"])
    seats_active = int(features["seats_active"])

    trend_drop = 0.0
    if login_60d > 0:
        trend_drop = clamp((login_60d - login_30d) / login_60d, 0.0, 1.0)

    unused_features = 1.0 - analytics_used
    support_risk = 1.0 - clamp(support_sentiment, 0.0, 1.0)
    payment_risk = clamp(payment_delay_days / 30.0, 0.0, 1.0)
    utilization_gap = 0.0
    if seats_purchased > 0:
        utilization_gap = clamp((seats_purchased - seats_active) / seats_purchased, 0.0, 1.0)

    risk_score = (
        0.35 * trend_drop
        + 0.18 * unused_features
        + 0.16 * support_risk
        + 0.14 * payment_risk
        + 0.10 * utilization_gap
        + 0.07 * clamp(support_tickets_open / 6.0, 0.0, 1.0)
    )

    if risk_score >= 0.72:
        probabilities = [("churned", 0.72), ("downgraded", 0.22), ("renewed", 0.06)]
    elif risk_score >= 0.45:
        probabilities = [("churned", 0.24), ("downgraded", 0.46), ("renewed", 0.30)]
    else:
        probabilities = [("churned", 0.05), ("downgraded", 0.16), ("renewed", 0.79)]

    return weighted_choice(probabilities)


def generate_account(customer_index: int, fake: Faker, used_names: set[str]) -> dict[str, object]:
    current_plan = weighted_choice(PLAN_WEIGHTS)
    plan = PLAN_CONFIG[current_plan]

    company_name = build_company_name(fake, used_names, str(customer_index))
    customer_id = f"acc_{customer_index:04d}"
    customer_contact = fake.name()
    contact_email = (
        customer_contact.lower()
        .replace(" ", ".")
        + "@example.com"
    )
    plan_seed = {
        "Starter": (0.70, 1.05),
        "Professional": (0.60, 1.10),
        "Enterprise": (0.55, 1.20),
    }[current_plan]

    risk_segment_roll = random.random()
    if risk_segment_roll < 0.58:
        segment = "healthy"
    elif risk_segment_roll < 0.84:
        segment = "moderate"
    else:
        segment = "risky"

    if segment == "healthy":
        trend_ratio = random.uniform(0.85, 1.12)
    elif segment == "moderate":
        trend_ratio = random.uniform(0.65, 0.95)
    else:
        trend_ratio = random.uniform(0.30, 0.75)

    login_frequency_60d = random.randint(
        max(4, int(plan["seats"] * plan_seed[0])),
        max(12, int(plan["seats"] * plan_seed[1] * 3)),
    )
    login_frequency_30d = max(
        0,
        int(round(login_frequency_60d * trend_ratio + random.uniform(-2.0, 2.0))),
    )

    if current_plan == "Enterprise":
        analytics_probability = 0.82
    elif current_plan == "Professional":
        analytics_probability = 0.24
    else:
        analytics_probability = 0.06

    if trend_ratio < 0.72:
        analytics_probability -= 0.24
    if segment == "risky":
        analytics_probability -= 0.18
    advanced_analytics_used = 1 if random.random() < clamp(analytics_probability, 0.02, 0.95) else 0

    seats_purchased = plan["seats"] + random.randint(0, {"Starter": 8, "Professional": 25, "Enterprise": 60}[current_plan])
    if segment == "healthy":
        seats_active = random.randint(max(1, int(seats_purchased * 0.72)), seats_purchased)
    elif segment == "moderate":
        seats_active = random.randint(max(1, int(seats_purchased * 0.48)), max(1, int(seats_purchased * 0.85)))
    else:
        seats_active = random.randint(max(1, int(seats_purchased * 0.18)), max(1, int(seats_purchased * 0.58)))

    usage_scale = seats_active / max(seats_purchased, 1)
    storage_limit = plan["storage_gb"]
    api_limit = plan["api_calls"]

    storage_upper = int(max(storage_limit * 1.4, storage_limit + 10))
    api_upper = int(max(api_limit * 1.35, api_limit + 5000)) if api_limit > 0 else 2500

    if segment == "healthy":
        storage_used_gb = int(random.uniform(storage_limit * 0.20, storage_limit * 0.92) * max(0.8, usage_scale))
        api_calls_used = int(random.uniform(api_limit * 0.22, api_limit * 0.88)) if api_limit > 0 else random.randint(0, 600)
        sentiment_score = clamp(random.uniform(0.72, 0.98) - (0.12 if advanced_analytics_used == 0 and current_plan == "Enterprise" else 0), 0.0, 1.0)
        payment_delay_days = random.randint(0, 4)
        support_tickets_open = random.randint(0, 1)
    elif segment == "moderate":
        storage_used_gb = int(random.uniform(storage_limit * 0.15, storage_upper * 0.75) * max(0.65, usage_scale))
        api_calls_used = int(random.uniform(api_limit * 0.10, api_upper * 0.55)) if api_limit > 0 else random.randint(0, 1200)
        sentiment_score = clamp(random.uniform(0.40, 0.82) - (0.10 if trend_ratio < 0.75 else 0), 0.0, 1.0)
        payment_delay_days = random.randint(2, 14)
        support_tickets_open = random.randint(1, 3)
    else:
        storage_used_gb = int(random.uniform(storage_limit * 0.05, storage_upper * 0.55) * max(0.45, usage_scale))
        api_calls_used = int(random.uniform(api_limit * 0.03, api_upper * 0.28)) if api_limit > 0 else random.randint(0, 1800)
        sentiment_score = clamp(random.uniform(0.08, 0.52) - (0.08 if trend_ratio < 0.55 else 0), 0.0, 1.0)
        payment_delay_days = random.randint(8, 45)
        support_tickets_open = random.randint(2, 6)

    support_tickets_resolved = max(0, support_tickets_open - random.randint(0, support_tickets_open))

    renewal_days = random.randint(14, 120)
    if segment == "healthy":
        renewal_days = random.randint(30, 150)
    elif segment == "risky":
        renewal_days = random.randint(7, 70)

    features = {
        "login_frequency_30d": login_frequency_30d,
        "login_frequency_60d": login_frequency_60d,
        "advanced_analytics_used": advanced_analytics_used,
        "support_sentiment_score": sentiment_score,
        "payment_delay_days": payment_delay_days,
        "support_tickets_open": support_tickets_open,
        "seats_purchased": seats_purchased,
        "seats_active": seats_active,
    }

    actual_outcome = generate_outcome(features)

    return {
        "customer_id": customer_id,
        "company_name": company_name,
        "customer_contact": customer_contact,
        "contact_email": contact_email,
        "current_plan": current_plan,
        "seats_purchased": seats_purchased,
        "seats_active": seats_active,
        "advanced_analytics_used": advanced_analytics_used,
        "api_calls_used": api_calls_used,
        "storage_used_gb": storage_used_gb,
        "login_frequency_30d": login_frequency_30d,
        "login_frequency_60d": login_frequency_60d,
        "support_tickets_open": support_tickets_open,
        "support_tickets_resolved": support_tickets_resolved,
        "support_sentiment_score": round(sentiment_score, 3),
        "payment_delay_days": payment_delay_days,
        "contract_renewal_date": (REFERENCE_DATE + timedelta(days=renewal_days)).isoformat(),
        "monthly_revenue": plan["price"],
        "actual_outcome": actual_outcome,
    }


def add_abc_company() -> dict[str, object]:
    return {
        "customer_id": "acc_0001",
        "company_name": "ABC Company",
        "customer_contact": "Sarah Jenkins",
        "contact_email": "sarah.jenkins@abccompany.com",
        "current_plan": "Enterprise",
        "seats_purchased": 100,
        "seats_active": 38,
        "advanced_analytics_used": 0,
        "api_calls_used": 16800,
        "storage_used_gb": 142,
        "login_frequency_30d": 18,
        "login_frequency_60d": 52,
        "support_tickets_open": 3,
        "support_tickets_resolved": 1,
        "support_sentiment_score": 0.22,
        "payment_delay_days": 18,
        "contract_renewal_date": (REFERENCE_DATE + timedelta(days=18)).isoformat(),
        "monthly_revenue": 299,
        "actual_outcome": "churned",
    }


def generate_dataset(total_accounts: int = TOTAL_ACCOUNTS) -> pd.DataFrame:
    random.seed(42)
    Faker.seed(42)
    fake = Faker("en_US")
    fake.seed_instance(42)

    used_names: set[str] = {"ABC Company"}
    records: list[dict[str, object]] = [add_abc_company()]

    for customer_index in range(2, total_accounts + 1):
        records.append(generate_account(customer_index, fake, used_names))

    frame = pd.DataFrame(records)
    column_order = [
        "customer_id",
        "company_name",
        "customer_contact",
        "contact_email",
        "current_plan",
        "seats_purchased",
        "seats_active",
        "advanced_analytics_used",
        "api_calls_used",
        "storage_used_gb",
        "login_frequency_30d",
        "login_frequency_60d",
        "support_tickets_open",
        "support_tickets_resolved",
        "support_sentiment_score",
        "payment_delay_days",
        "contract_renewal_date",
        "monthly_revenue",
        "actual_outcome",
    ]
    return frame[column_order]


def main() -> None:
    dataset = generate_dataset()
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    dataset.to_csv(OUTPUT_FILE, index=False)
    print(f"Generated {len(dataset)} accounts at {OUTPUT_FILE}")
    print(dataset.head(3).to_string(index=False))


if __name__ == "__main__":
    main()