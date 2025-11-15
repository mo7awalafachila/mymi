"""Feature engineering pipeline for Head Start MVP.

Reads the synthetic time-series data, computes rolling statistics, circadian
signals, contextual flags, and future-looking targets suitable for training the
baseline model.
"""

from __future__ import annotations

import argparse
from pathlib import Path
from typing import Iterable

import numpy as np
import pandas as pd

MINUTES_PER_DAY = 24 * 60


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Build engineered features")
    parser.add_argument(
        "--input",
        type=Path,
        default=Path("data/synthetic_timeseries.parquet"),
        help="Path to the raw synthetic dataset (parquet or csv)",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("data/features.parquet"),
        help="Destination parquet file for engineered features",
    )
    parser.add_argument(
        "--min-train-minutes",
        type=int,
        default=360,
        help="Drop leading rows per user until this many minutes exist for rolling windows",
    )
    parser.add_argument("--seed", type=int, default=42, help="Deterministic shuffle seed")
    return parser.parse_args()


def load_dataset(path: Path) -> pd.DataFrame:
    if path.suffix.lower() == ".csv":
        df = pd.read_csv(path)
    else:
        df = pd.read_parquet(path)
    df["timestamp"] = pd.to_datetime(df["timestamp"], utc=True)
    df = df.sort_values(["user_id", "timestamp"]).reset_index(drop=True)
    return df


def add_time_features(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df["minute_of_day"] = df["timestamp"].dt.hour * 60 + df["timestamp"].dt.minute
    df["sin_circadian"] = np.sin(2 * np.pi * df["minute_of_day"] / MINUTES_PER_DAY)
    df["cos_circadian"] = np.cos(2 * np.pi * df["minute_of_day"] / MINUTES_PER_DAY)
    df["is_weekend"] = df["timestamp"].dt.weekday >= 5
    df["is_work_hours"] = df["timestamp"].dt.hour.between(9, 18)
    return df


def add_rolling_features(df: pd.DataFrame, column: str, windows: Iterable[int], agg: str) -> pd.DataFrame:
    series = df.groupby("user_id")[column]
    for window in windows:
        rolled = series.rolling(window, min_periods=max(10, window // 4))
        if agg == "mean":
            feature = rolled.mean()
        elif agg == "std":
            feature = rolled.std()
        elif agg == "sum":
            feature = rolled.sum()
        elif agg == "max":
            feature = rolled.max()
        else:
            raise ValueError(f"Unsupported agg {agg}")
        df[f"{column}_{agg}_{window}m"] = feature.reset_index(level=0, drop=True)
    return df


def add_circadian_deltas(df: pd.DataFrame, columns: Iterable[str]) -> pd.DataFrame:
    lag = MINUTES_PER_DAY
    for column in columns:
        circadian_baseline = df.groupby("user_id")[column].shift(lag)
        df[f"{column}_circadian_delta"] = df[column] - circadian_baseline
    return df


def compute_future_targets(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    minutes_until = np.full(len(df), np.nan, dtype=float)
    for user, idx in df.groupby("user_id").indices.items():
        labels = df.loc[idx, "migraine_label"].to_numpy()
        future = np.full_like(labels, np.nan, dtype=float)
        minutes = None
        for i in range(len(labels) - 1, -1, -1):
            if labels[i] == 1:
                minutes = 0.0
                future[i] = 0.0
            elif minutes is not None:
                minutes += 1.0
                future[i] = minutes
        minutes_until[idx] = future
    df["minutes_until_migraine"] = minutes_until
    df["target_migraine_next6h"] = (df["minutes_until_migraine"].notna()) & (df["minutes_until_migraine"] <= 360)
    return df


def add_context_flags(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df["high_screen_load"] = df["screen_time_minutes"] > 2.0
    df["heavy_calendar"] = df["calendar_load"] >= 3
    df["low_pressure"] = df["barometric_pressure_hpa"] < 1005
    df["high_noise"] = df["ambient_noise_db"] > 70
    df["uv_alert"] = df["uv_index"] > 8
    df["storm_conditions"] = df["weather_condition"].isin(["storm"])
    df["combined_environment_stress"] = (
        df["low_pressure"].astype(int)
        + df["high_noise"].astype(int)
        + df["uv_alert"].astype(int)
        + df["storm_conditions"].astype(int)
    )
    return df


def build_feature_table(df: pd.DataFrame, min_history_minutes: int) -> pd.DataFrame:
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

    df = compute_future_targets(df)

    # Drop rows lacking sufficient history for stable features
    if min_history_minutes > 0:
        history_mask = df.groupby("user_id").cumcount() >= min_history_minutes
        df = df.loc[history_mask].reset_index(drop=True)

    return df


def main() -> None:
    args = parse_args()
    raw = load_dataset(args.input)
    features = build_feature_table(raw, args.min_train_minutes)

    args.output.parent.mkdir(parents=True, exist_ok=True)
    features.to_parquet(args.output, index=False)
    print(f"✅ Wrote {len(features):,} feature rows to {args.output}")


if __name__ == "__main__":
    main()
