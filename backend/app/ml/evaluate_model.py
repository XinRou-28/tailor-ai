from __future__ import annotations

import json
import sys
from collections import Counter
from pathlib import Path

import pandas as pd
from sklearn.metrics import accuracy_score, confusion_matrix, f1_score, precision_score, recall_score

CURRENT_FILE = Path(__file__).resolve()
BACKEND_DIR = CURRENT_FILE.parents[2]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.models.db import Account, SessionLocal  # noqa: E402
from app.models.scoring_model import FEATURE_COLUMNS, load_artifact, score  # noqa: E402

DATASET_PATH = CURRENT_FILE.parents[1] / "data" / "projectflow_dataset.csv"
OUTPUT_CSV = CURRENT_FILE.with_name("batch_scoring_results.csv")
METRICS_JSON = CURRENT_FILE.with_name("evaluation_metrics.json")


def load_accounts_from_sqlite() -> list[Account]:
    session = SessionLocal()
    try:
        return session.query(Account).order_by(Account.customer_id).all()
    finally:
        session.close()


def build_feature_frame(dataset: pd.DataFrame) -> pd.DataFrame:
    missing_columns = [column for column in FEATURE_COLUMNS if column not in dataset.columns]
    if missing_columns:
        raise ValueError(f"Dataset missing required feature columns: {missing_columns}")
    return dataset[FEATURE_COLUMNS].copy()


def evaluate() -> dict[str, object]:
    accounts = load_accounts_from_sqlite()
    if not accounts:
        raise AssertionError("No accounts found in SQLite. Run backend/app/data/load_data.py first.")

    batch_rows: list[dict[str, object]] = []
    for account in accounts:
        result = score(account)
        batch_rows.append(
            {
                "customer_id": result.customer_id,
                "health_score": result.health_score,
                "confidence": result.confidence,
                "risk_level": result.risk_level,
                "reason_code": result.reason_code,
            }
        )

    batch_frame = pd.DataFrame(batch_rows)
    batch_frame.to_csv(OUTPUT_CSV, index=False)

    artifact = load_artifact()
    model = artifact["calibrated_model"]

    dataset = pd.read_csv(DATASET_PATH)
    feature_frame = build_feature_frame(dataset)
    actual_outcome = dataset["actual_outcome"].astype(str)
    predicted_outcome = pd.Series(model.predict(feature_frame), index=dataset.index, name="predicted_outcome")
    class_labels = list(model.classes_)

    metrics = {
        "accuracy": accuracy_score(actual_outcome, predicted_outcome),
        "precision": precision_score(actual_outcome, predicted_outcome, average="macro", zero_division=0),
        "recall": recall_score(actual_outcome, predicted_outcome, average="macro", zero_division=0),
        "f1_score": f1_score(actual_outcome, predicted_outcome, average="macro", zero_division=0),
        "confusion_matrix": confusion_matrix(actual_outcome, predicted_outcome, labels=class_labels).tolist(),
        "class_labels": class_labels,
    }

    with METRICS_JSON.open("w", encoding="utf-8") as metrics_file:
        json.dump(metrics, metrics_file, indent=2)

    summary = {
        "total_accounts_scored": len(batch_frame),
        "risk_level_distribution": Counter(batch_frame["risk_level"]),
        "reason_code_distribution": Counter(batch_frame["reason_code"]),
        "average_confidence": float(batch_frame["confidence"].mean()),
        "average_health_score": float(batch_frame["health_score"].mean()),
        "metrics": metrics,
    }
    return summary


def main() -> None:
    summary = evaluate()

    print(f"Total accounts scored: {summary['total_accounts_scored']}")
    print("Risk level distribution:")
    for risk_level, count in sorted(summary["risk_level_distribution"].items()):
        print(f"  {risk_level}: {count}")

    print("Reason code distribution:")
    for reason_code, count in sorted(summary["reason_code_distribution"].items()):
        print(f"  {reason_code}: {count}")

    print(f"Average confidence: {summary['average_confidence']:.4f}")
    print(f"Average health score: {summary['average_health_score']:.2f}")
    print("Performance metrics:")
    metrics = summary["metrics"]
    print(f"  accuracy: {metrics['accuracy']:.4f}")
    print(f"  precision: {metrics['precision']:.4f}")
    print(f"  recall: {metrics['recall']:.4f}")
    print(f"  f1_score: {metrics['f1_score']:.4f}")
    print(f"  confusion_matrix: {metrics['confusion_matrix']}")
    print(f"Saved batch scoring results to {OUTPUT_CSV}")
    print(f"Saved evaluation metrics to {METRICS_JSON}")


if __name__ == "__main__":
    main()