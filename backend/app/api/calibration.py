from pathlib import Path
import json
import pickle
import pandas as pd
from fastapi import APIRouter


router = APIRouter(prefix="/api")


CURRENT_FILE = Path(__file__).resolve()

ML_DIR = CURRENT_FILE.parents[1] / "ml"
MODEL_FILE = ML_DIR / "model.pkl"


@router.get("/calibration")
def get_calibration() -> dict[str, object]:

    metrics_file = ML_DIR / "evaluation_metrics.json"
    report_file = ML_DIR / "calibration_report.metrics.csv"


    with metrics_file.open() as file:
        metrics = json.load(file)


    report_df = pd.read_csv(report_file)
    with MODEL_FILE.open("rb") as file:
        model_artifact = pickle.load(file)

    calibration_curve = model_artifact.get(
        "calibration_curve",
        []
    )


    classification_report = {}


    for _, row in report_df.iterrows():

        name = row.iloc[0]

        if name in [
            "accuracy",
            "macro avg",
            "weighted avg"
        ]:
            continue


        classification_report[name] = {
            "precision": row["precision"],
            "recall": row["recall"],
            "f1_score": row["f1-score"],
            "support": row["support"],
        }


    return {

    "model_metrics": {
        "accuracy": metrics["accuracy"],
        "precision": metrics["precision"],
        "recall": metrics["recall"],
        "f1_score": metrics["f1_score"],
    },


    "classification_report": classification_report,


    "confusion_matrix": {
        "labels": metrics["class_labels"],
        "matrix": metrics["confusion_matrix"],
    },


    "calibration_curve": calibration_curve,
}