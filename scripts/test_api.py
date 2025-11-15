"""Smoke test for the FastAPI inference service using the synthetic dataset."""

from __future__ import annotations

from pathlib import Path
import sys

import pandas as pd
from fastapi.testclient import TestClient

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.append(str(ROOT))

from backend.app import app, settings

DATA_PATH = Path("data/synthetic_timeseries.parquet")


def load_samples(user_id: str | None = None, limit: int = 60) -> list[dict]:
    df = pd.read_parquet(DATA_PATH)
    if user_id:
        df = df[df["user_id"] == user_id]
    else:
        user_id = df["user_id"].iloc[0]
        df = df[df["user_id"] == user_id]
    df = df.sort_values("timestamp").head(limit)
    records = df.to_dict(orient="records")
    return records


def main() -> None:
    client = TestClient(app)
    records = load_samples(limit=90)
    headers = {"X-API-Key": settings.api_token}

    print(f"Sending {len(records)} events...")
    last_response = None
    for record in records:
        payload = {
            **record,
            "timestamp": pd.to_datetime(record["timestamp"]).isoformat(),
        }
        resp = client.post("/ingest", json=payload, headers=headers)
        resp.raise_for_status()
        last_response = resp.json()
    print("Last ingest response:", last_response)

    user_id = records[0]["user_id"]
    pred = client.get(f"/predict/{user_id}", headers=headers)
    pred.raise_for_status()
    print("Predict response:", pred.json())

    ins = client.get(f"/insights/{user_id}", headers=headers)
    ins.raise_for_status()
    print("Insights response:", ins.json())

    coach = client.post(f"/coach/{user_id}", json={}, headers=headers)
    coach.raise_for_status()
    print("Coach response:", coach.json())


if __name__ == "__main__":
    main()
