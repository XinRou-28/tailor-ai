from __future__ import annotations

import sys
from datetime import datetime, timezone
from pathlib import Path

from pydantic import BaseModel

CURRENT_FILE = Path(__file__).resolve()
BACKEND_DIR = CURRENT_FILE.parents[2]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.agents.tools.feature_usage_tool import inspect_feature_usage  # noqa: E402
from app.agents.tools.support_ticket_tool import inspect_support_tickets  # noqa: E402
from app.models.db import Account  # noqa: E402
from app.models.schemas import ScoreResult  # noqa: E402


class ReasonOverride(BaseModel):
    reason_code: str
    investigated: bool
    investigated_at: str | None


def should_investigate(confidence: float) -> bool:
    return 0.5 <= confidence <= 0.75


def investigate(account: Account, score: ScoreResult) -> ReasonOverride:
    if not should_investigate(score.confidence):
        return ReasonOverride(
            reason_code=score.reason_code,
            investigated=False,
            investigated_at=None,
        )

    support_evidence = inspect_support_tickets(account)
    usage_evidence = inspect_feature_usage(account)

    if support_evidence.reason_code == "feature_unused_support_issue":
        selected_reason = support_evidence.reason_code
    elif support_evidence.reason_code == "feature_unused_onboarding_gap":
        selected_reason = support_evidence.reason_code
    elif usage_evidence.reason_code == "feature_unused_onboarding_gap":
        selected_reason = usage_evidence.reason_code
    elif support_evidence.reason_code != "feature_unused_not_needed":
        selected_reason = support_evidence.reason_code
    else:
        selected_reason = usage_evidence.reason_code

    return ReasonOverride(
        reason_code=selected_reason,
        investigated=True,
        investigated_at=datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
    )