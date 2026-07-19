from __future__ import annotations

import pickle
from pathlib import Path

import matplotlib.pyplot as plt
import pandas as pd
from sklearn.calibration import CalibratedClassifierCV, calibration_curve
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
)
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

CURRENT_FILE = Path(__file__).resolve()
APP_DIR = CURRENT_FILE.parents[1]
DATA_PATH = APP_DIR / "data" / "projectflow_dataset.csv"
MODEL_PATH = CURRENT_FILE.with_name("model.pkl")
REPORT_PATH = CURRENT_FILE.with_name("calibration_report.png")

FEATURE_COLUMNS = [
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
]


def load_data() -> pd.DataFrame:
    frame = pd.read_csv(DATA_PATH)
    required_columns = FEATURE_COLUMNS + ["actual_outcome"]
    missing_columns = [column for column in required_columns if column not in frame.columns]
    if missing_columns:
        raise ValueError(f"Missing required columns in dataset: {missing_columns}")
    return frame


def build_models() -> tuple[CalibratedClassifierCV, object]:
    base_model = make_pipeline(
        StandardScaler(),
        LogisticRegression(
            max_iter=2000,
            class_weight="balanced",
            random_state=42,
        ),
    )
    calibrated_model = CalibratedClassifierCV(estimator=base_model, method="sigmoid", cv=5)
    explain_model = make_pipeline(
        StandardScaler(),
        LogisticRegression(
            max_iter=2000,
            class_weight="balanced",
            random_state=42,
        ),
    )
    return calibrated_model, explain_model


def save_calibration_report(
    y_test: pd.Series,
    y_pred: pd.Series,
    y_prob: pd.DataFrame,
    class_labels: list[str],
    metrics: dict[str, float],
) -> list[dict[str, float]]:
    renewed_index = class_labels.index("renewed")
    positive_target = (y_test == "renewed").astype(int)
    positive_prob = y_prob.iloc[:, renewed_index]
    fraction_of_positives, mean_predicted_value = calibration_curve(
        positive_target,
        positive_prob,
        n_bins=8,
        strategy="quantile",
        
    )

    curve_data = []

    for predicted, actual in zip(
        mean_predicted_value,
        fraction_of_positives
    ):
        curve_data.append(
            {
                "predicted_probability": round(float(predicted), 4),
                "actual_positive_rate": round(float(actual), 4),
            }
        )

    matrix = confusion_matrix(y_test, y_pred, labels=class_labels)
    report = classification_report(y_test, y_pred, labels=class_labels, output_dict=True, zero_division=0)

    figure, (axis_left, axis_right) = plt.subplots(1, 2, figsize=(14, 6))

    axis_left.plot(mean_predicted_value, fraction_of_positives, marker="o", label="Renewed class")
    axis_left.plot([0, 1], [0, 1], linestyle="--", color="gray", label="Perfect calibration")
    axis_left.set_title("Calibration Curve")
    axis_left.set_xlabel("Mean predicted probability")
    axis_left.set_ylabel("Observed renewed rate")
    axis_left.legend(loc="lower right")

    image = axis_right.imshow(matrix, cmap="Blues")
    axis_right.set_title("Confusion Matrix")
    axis_right.set_xticks(range(len(class_labels)))
    axis_right.set_xticklabels(class_labels, rotation=45, ha="right")
    axis_right.set_yticks(range(len(class_labels)))
    axis_right.set_yticklabels(class_labels)
    for row_index in range(matrix.shape[0]):
        for column_index in range(matrix.shape[1]):
            axis_right.text(column_index, row_index, int(matrix[row_index, column_index]), ha="center", va="center")
    figure.colorbar(image, ax=axis_right, fraction=0.046, pad=0.04)

    summary_text = (
        f"accuracy={metrics['accuracy']:.3f}  "
        f"macro_f1={metrics['macro_f1']:.3f}  "
        f"weighted_f1={metrics['weighted_f1']:.3f}  "
        f"precision={metrics['precision']:.3f}  "
        f"recall={metrics['recall']:.3f}"
    )
    figure.suptitle(summary_text, fontsize=11)
    figure.tight_layout(rect=[0, 0.03, 1, 0.92])
    figure.savefig(REPORT_PATH, dpi=160)
    plt.close(figure)

    report_frame = pd.DataFrame(report).T
    report_frame.to_csv(REPORT_PATH.with_suffix(".metrics.csv"))

    return curve_data

def train() -> dict[str, object]:
    frame = load_data()
    x_train, x_test, y_train, y_test = train_test_split(
        frame[FEATURE_COLUMNS],
        frame["actual_outcome"],
        test_size=0.2,
        random_state=42,
        stratify=frame["actual_outcome"],
    )

    calibrated_model, explain_model = build_models()
    calibrated_model.fit(x_train, y_train)
    explain_model.fit(x_train, y_train)

    y_pred = calibrated_model.predict(x_test)
    y_prob = pd.DataFrame(calibrated_model.predict_proba(x_test), columns=list(calibrated_model.classes_), index=x_test.index)
    class_labels = list(calibrated_model.classes_)

    metrics = {
        "accuracy": accuracy_score(y_test, y_pred),
        "macro_f1": f1_score(y_test, y_pred, average="macro", zero_division=0),
        "weighted_f1": f1_score(y_test, y_pred, average="weighted", zero_division=0),
        "precision": precision_score(y_test, y_pred, average="macro", zero_division=0),
        "recall": recall_score(y_test, y_pred, average="macro", zero_division=0),
    }

    curve_data = save_calibration_report(
    y_test,
    y_pred,
    y_prob,
    class_labels,
    metrics,
    )

    artifact = {
    "calibrated_model": calibrated_model,
    "explain_model": explain_model,
    "feature_columns": FEATURE_COLUMNS,
    "class_labels": class_labels,
    "metrics": metrics,
    "calibration_curve": curve_data,
    }
    with MODEL_PATH.open("wb") as artifact_file:
        pickle.dump(artifact, artifact_file)

    return artifact


def main() -> None:
    artifact = train()
    print(f"Saved calibrated model to {MODEL_PATH}")
    print(f"Saved calibration report to {REPORT_PATH}")
    print(artifact["metrics"])


if __name__ == "__main__":
    main()