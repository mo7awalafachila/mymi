"""FastAPI inference service for the Head Start MVP."""

from __future__ import annotations

import asyncio
import contextlib
import json
from collections import defaultdict, deque
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Deque, Dict, List

import joblib
import numpy as np
import pandas as pd
from fastapi import Depends, FastAPI, Header, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator
from pydantic_settings import BaseSettings

from scripts.build_features import (  # type: ignore
    add_circadian_deltas,
    add_context_flags,
    add_rolling_features,
    add_time_features,
)

# ---------------------------------------------------------------------------
# Settings & configuration
# ---------------------------------------------------------------------------


class Settings(BaseSettings):
    api_token: str = Field("dev-token", alias="API_TOKEN")
    model_path: Path = Path("models/model.pkl")
    scaler_path: Path = Path("models/scaler.pkl")
    feature_metadata_path: Path = Path("models/feature_metadata.json")
    refresh_interval_seconds: int = 120
    event_window_minutes: int = 12 * 60
    max_events_per_user: int = 12 * 60
    max_insights: int = 3

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "extra": "ignore",
    }


settings = Settings()


# ---------------------------------------------------------------------------
# Data models
# ---------------------------------------------------------------------------


class IngestPayload(BaseModel):
    user_id: str = Field(..., examples=["user_001"])
    timestamp: datetime = Field(..., description="ISO timestamp of the sample")
    heart_rate: float
    hrv: float
    sleep_debt_hours: float
    screen_time_minutes: float
    calendar_load: float
    temperature_c: float
    barometric_pressure_hpa: float
    solar_pressure_index: float
    uv_index: float
    ambient_noise_db: float
    trigger_score: float
    migraine_probability: float
    weather_condition: str = Field("clear")

    @field_validator("timestamp", mode="before")
    @classmethod
    def ensure_timezone(cls, value: Any) -> datetime:
        ts = pd.to_datetime(value, utc=True)
        return ts.to_pydatetime()


class IngestResponse(BaseModel):
    user_id: str
    stored_events: int
    last_prediction: float | None


class PredictionResponse(BaseModel):
    user_id: str
    probability: float
    risk_level: str
    updated_at: datetime


class InsightResponse(BaseModel):
    user_id: str
    risk_level: str
    probability: float
    insights: List[str]
    generated_at: datetime


class CoachRequest(BaseModel):
    context: str | None = None


class CoachResponse(BaseModel):
    user_id: str
    risk_level: str
    probability: float
    recommendations: List[str]


# ---------------------------------------------------------------------------
# Application state
# ---------------------------------------------------------------------------


app = FastAPI(title="Head Start Inference API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


EventStore = Dict[str, Deque[dict[str, Any]]]
FEATURE_CACHE: dict[str, dict[str, Any]] = {}
EVENT_STORE: EventStore = defaultdict(lambda: deque(maxlen=settings.max_events_per_user))
store_lock = asyncio.Lock()
refresh_task: asyncio.Task | None = None


# ---------------------------------------------------------------------------
# Model bundle
# ---------------------------------------------------------------------------


class ModelBundle:
    def __init__(self, settings: Settings) -> None:
        if not settings.model_path.exists():
            raise FileNotFoundError(f"Model not found at {settings.model_path}")
        if not settings.scaler_path.exists():
            raise FileNotFoundError(f"Scaler not found at {settings.scaler_path}")
        if not settings.feature_metadata_path.exists():
            raise FileNotFoundError(f"Feature metadata missing at {settings.feature_metadata_path}")

        self.model = joblib.load(settings.model_path)
        self.scaler = joblib.load(settings.scaler_path)
        meta = json.loads(settings.feature_metadata_path.read_text())
        self.features: list[str] = meta.get("features", [])
        if not self.features:
            raise ValueError("Feature metadata did not contain feature list")

    def predict_probability(self, feature_vector: pd.Series) -> float:
        arr = feature_vector[self.features].to_numpy(dtype=float)
        arr = arr.reshape(1, -1)
        scaled = self.scaler.transform(arr)
        proba = self.model.predict_proba(scaled)[0, 1]
        return float(proba)


MODEL_BUNDLE = ModelBundle(settings)


# ---------------------------------------------------------------------------
# Auth dependency
# ---------------------------------------------------------------------------


def require_api_key(x_api_key: str = Header(..., alias="X-API-Key")) -> None:
    if x_api_key != settings.api_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid API key")


# ---------------------------------------------------------------------------
# Helper functions
# ---------------------------------------------------------------------------


def _as_dataframe(user_id: str, events: Deque[dict[str, Any]]) -> pd.DataFrame:
    if not events:
        raise ValueError("No events to build features from")
    df = pd.DataFrame(list(events))
    df["timestamp"] = pd.to_datetime(df["timestamp"], utc=True)
    df["user_id"] = user_id
    df = df.sort_values("timestamp")
    return df


def _apply_feature_pipeline(df: pd.DataFrame) -> pd.DataFrame:
    df = add_time_features(df)
    df = add_context_flags(df)
    df = add_rolling_features(df, "heart_rate", [15, 60, 180], "mean")
    df = add_rolling_features(df, "heart_rate", [60, 240], "std")
    df = add_rolling_features(df, "hrv", [15, 60, 180], "mean")
    df = add_rolling_features(df, "hrv", [60, 240], "std")
    df = add_rolling_features(df, "sleep_debt_hours", [60, 360], "max")
    df = add_rolling_features(df, "screen_time_minutes", [30, 120], "sum")
    df = add_rolling_features(df, "ambient_noise_db", [30, 120], "mean")
    df = add_rolling_features(df, "barometric_pressure_hpa", [180, 360], "mean")
    df = add_circadian_deltas(
        df,
        [
            "heart_rate",
            "hrv",
            "screen_time_minutes",
            "barometric_pressure_hpa",
            "ambient_noise_db",
            "temperature_c",
        ],
    )
    return df


def _compute_feature_vector(user_id: str, events: Deque[dict[str, Any]]) -> pd.Series:
    df = _as_dataframe(user_id, events)
    df = _apply_feature_pipeline(df)
    latest = df.iloc[-1]
    series = latest.reindex(MODEL_BUNDLE.features)
    series = series.fillna(0.0)
    return series.astype(float)


def _risk_level(probability: float) -> str:
    if probability >= 0.7:
        return "high"
    if probability >= 0.4:
        return "medium"
    return "low"


def _generate_insights(series: pd.Series) -> List[str]:
    insights: list[tuple[str, float]] = []
    if series.get("screen_time_minutes_sum_120m", 0) > 90:
        insights.append(("Screen time spike", float(series["screen_time_minutes_sum_120m"])))
    if series.get("barometric_pressure_hpa_mean_180m", 1013) < 1005:
        insights.append(("Low pressure system detected", float(series["barometric_pressure_hpa_mean_180m"])))
    if series.get("sleep_debt_hours_max_360m", 0) > 2.5:
        insights.append(("Elevated sleep debt", float(series["sleep_debt_hours_max_360m"])))
    if series.get("ambient_noise_db_mean_30m", 0) > 65:
        insights.append(("High ambient noise", float(series["ambient_noise_db_mean_30m"])))
    if series.get("uv_index", 0) > 8:
        insights.append(("Extreme UV exposure", float(series["uv_index"])))

    insights = sorted(insights, key=lambda item: abs(item[1]), reverse=True)
    if not insights:
        return ["No acute triggers detected; continue monitoring baseline."]
    return [text for text, _ in insights[: settings.max_insights]]


def _update_prediction(user_id: str) -> None:
    events = EVENT_STORE[user_id]
    if not events:
        return
    features = _compute_feature_vector(user_id, events)
    probability = MODEL_BUNDLE.predict_probability(features)
    risk = _risk_level(probability)
    insights = _generate_insights(features)
    FEATURE_CACHE[user_id] = {
        "features": features,
        "probability": probability,
        "risk_level": risk,
        "insights": insights,
        "updated_at": datetime.now(timezone.utc),
    }


async def _refresh_loop() -> None:
    while True:
        await asyncio.sleep(settings.refresh_interval_seconds)
        async with store_lock:
            for user_id in list(EVENT_STORE.keys()):
                _update_prediction(user_id)


# ---------------------------------------------------------------------------
# Lifecycle events
# ---------------------------------------------------------------------------


@app.on_event("startup")
async def startup_event() -> None:
    global refresh_task
    refresh_task = asyncio.create_task(_refresh_loop())


@app.on_event("shutdown")
async def shutdown_event() -> None:
    if refresh_task:
        refresh_task.cancel()
        with contextlib.suppress(asyncio.CancelledError):
            await refresh_task


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------


@app.post("/ingest", response_model=IngestResponse)
async def ingest(payload: IngestPayload, _: None = Depends(require_api_key)) -> IngestResponse:
    record = payload.model_dump()
    async with store_lock:
        events = EVENT_STORE[payload.user_id]
        events.append(record)
        _update_prediction(payload.user_id)
        cached = FEATURE_CACHE.get(payload.user_id)
    return IngestResponse(
        user_id=payload.user_id,
        stored_events=len(events),
        last_prediction=cached["probability"] if cached else None,
    )


@app.get("/predict/{user_id}", response_model=PredictionResponse)
async def predict(user_id: str, _: None = Depends(require_api_key)) -> PredictionResponse:
    cached = FEATURE_CACHE.get(user_id)
    if not cached:
        raise HTTPException(status_code=404, detail="No predictions available for user")
    return PredictionResponse(
        user_id=user_id,
        probability=cached["probability"],
        risk_level=cached["risk_level"],
        updated_at=cached["updated_at"],
    )


@app.get("/insights/{user_id}", response_model=InsightResponse)
async def insights(user_id: str, _: None = Depends(require_api_key)) -> InsightResponse:
    cached = FEATURE_CACHE.get(user_id)
    if not cached:
        raise HTTPException(status_code=404, detail="No insights available for user")
    return InsightResponse(
        user_id=user_id,
        risk_level=cached["risk_level"],
        probability=cached["probability"],
        insights=cached["insights"],
        generated_at=cached["updated_at"],
    )


def _coach_messages(risk_level: str) -> List[str]:
    if risk_level == "high":
        return [
            "Schedule a short break in the next 30 minutes and hydrate.",
            "Dim your screen brightness and move to a quiet space if possible.",
            "Prepare your acute medication plan and notify your support contact.",
        ]
    if risk_level == "medium":
        return [
            "Log current triggers (sleep, stress) to refine the model.",
            "Do a 5-minute breathing exercise and reduce screen exposure.",
            "Check your calendar to see if you can stagger intense meetings.",
        ]
    return [
        "You're in the safe zone—maintain hydration and posture routines.",
        "Plan tomorrow's sleep and screen hygiene to keep your baseline stable.",
        "If anything feels off, add a quick journal entry for your coach.",
    ]


@app.post("/coach/{user_id}", response_model=CoachResponse)
async def coach(user_id: str, request: CoachRequest, _: None = Depends(require_api_key)) -> CoachResponse:
    cached = FEATURE_CACHE.get(user_id)
    if not cached:
        raise HTTPException(status_code=404, detail="No predictions available for user")
    return CoachResponse(
        user_id=user_id,
        risk_level=cached["risk_level"],
        probability=cached["probability"],
        recommendations=_coach_messages(cached["risk_level"]),
    )


@app.get("/health")
async def healthcheck() -> dict[str, Any]:
    return {
        "status": "ok",
        "users_tracked": len(EVENT_STORE),
        "model_features": len(MODEL_BUNDLE.features),
    }


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("backend.app:app", host="0.0.0.0", port=8000, reload=False)
