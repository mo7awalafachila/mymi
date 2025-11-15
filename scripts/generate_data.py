"""Synthetic data generator for the Head Start MVP.

Creates minute-level biometric, contextual, and environmental signals for a
configurable number of users and days, and injects migraine events using
probabilistic triggers. The output includes both CSV and Parquet datasets plus a
metadata JSON payload.
"""

from __future__ import annotations

import argparse
import json
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Tuple

import numpy as np
import pandas as pd

MINUTES_PER_DAY = 24 * 60


@dataclass
class UserProfile:
    user_id: str
    resting_hr: float
    resting_hrv: float
    sleep_need: float
    screen_intensity: float
    calendar_intensity: float


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate synthetic migraine dataset")
    parser.add_argument("--users", type=int, default=30, help="Number of synthetic users")
    parser.add_argument("--days", type=int, default=30, help="Number of days per user")
    parser.add_argument("--seed", type=int, default=42, help="Random seed for reproducibility")
    parser.add_argument(
        "--outdir",
        type=Path,
        default=Path("data"),
        help="Directory where outputs will be written",
    )
    return parser.parse_args()


def build_user_profile(user_idx: int, rng: np.random.Generator) -> UserProfile:
    return UserProfile(
        user_id=f"user_{user_idx:03d}",
        resting_hr=rng.normal(68, 4),
        resting_hrv=rng.normal(75, 10),
        sleep_need=rng.uniform(7.0, 8.5),
        screen_intensity=rng.uniform(0.4, 0.9),
        calendar_intensity=rng.uniform(0.3, 0.8),
    )


def simulate_user_timeseries(profile: UserProfile, days: int, rng: np.random.Generator) -> pd.DataFrame:
    periods = days * MINUTES_PER_DAY
    index = pd.date_range(
        end=pd.Timestamp.utcnow().ceil(freq="min"),
        periods=periods,
        freq="min",
        tz="UTC",
    )
    minutes = np.arange(periods)
    day_fraction = (minutes % MINUTES_PER_DAY) / MINUTES_PER_DAY
    day_index = minutes // MINUTES_PER_DAY

    circadian = np.sin(2 * np.pi * day_fraction)
    activity_spikes = rng.binomial(1, 0.05, size=periods)

    heart_rate = (
        profile.resting_hr
        + 8 * circadian
        + rng.normal(0, 3, size=periods)
        + activity_spikes * rng.uniform(10, 25, size=periods)
    )
    hrv = (
        profile.resting_hrv
        - 12 * circadian
        + rng.normal(0, 4, size=periods)
        - activity_spikes * rng.uniform(5, 15, size=periods)
    )

    daytime_mask = (day_fraction > 0.25) & (day_fraction < 0.92)
    screen_time = rng.binomial(1, profile.screen_intensity * (0.4 + 0.6 * daytime_mask))
    screen_time = screen_time * rng.uniform(0, 3, size=periods)

    calendar_base = profile.calendar_intensity * (0.2 + 0.8 * daytime_mask)
    calendar_load = rng.poisson(calendar_base * 2).astype(float)

    temperature_c, barometric_pressure_hpa, solar_pressure_index, uv_index, ambient_noise_db, weather_condition = (
        generate_environmental_signals(days, periods, day_fraction, day_index, rng)
    )

    sleep_debt = np.zeros(periods)
    current_debt = rng.uniform(0, 1)
    for i in range(periods):
        if 0.0 <= day_fraction[i] < 0.25:  # sleeping window
            current_debt = max(0, current_debt - rng.uniform(0.02, 0.05))
        else:
            current_debt += rng.uniform(0.005, 0.02) * (1 + screen_time[i] / 2)
            current_debt = min(current_debt, 6)
        sleep_debt[i] = current_debt

    environment_pressure = np.clip((1015 - barometric_pressure_hpa) / 20.0, 0, 1)
    environment_noise = np.clip((ambient_noise_db - 60) / 25.0, 0, 1)
    environment_risk = 0.6 * environment_pressure + 0.4 * environment_noise

    trigger_score = (
        0.3 * np.clip((profile.resting_hrv - hrv) / 25.0, 0, 1)
        + 0.25 * np.clip(sleep_debt / 4.0, 0, 1)
        + 0.2 * np.clip(screen_time / 3.0, 0, 1)
        + 0.25 * environment_risk
    )

    base_prob = 0.0004
    event_prob = np.clip(
        base_prob + trigger_score * 0.2 + calendar_load * 0.0005 + environment_risk * 0.1,
        0,
        0.55,
    )
    migraine_seed = rng.random(periods) < event_prob

    migraine_label = expand_events(migraine_seed)
    if not migraine_label.any():
        top_idx = int(np.argmax(event_prob))
        migraine_label[top_idx : min(top_idx + 90, periods)] = True

    df = pd.DataFrame(
        {
            "user_id": profile.user_id,
            "timestamp": index,
            "heart_rate": heart_rate.astype(float),
            "hrv": hrv.astype(float),
            "sleep_debt_hours": sleep_debt.astype(float),
            "screen_time_minutes": screen_time.astype(float),
            "calendar_load": calendar_load.astype(float),
            "temperature_c": temperature_c.astype(float),
            "barometric_pressure_hpa": barometric_pressure_hpa.astype(float),
            "solar_pressure_index": solar_pressure_index.astype(float),
            "uv_index": uv_index.astype(float),
            "ambient_noise_db": ambient_noise_db.astype(float),
            "weather_condition": weather_condition,
            "trigger_score": trigger_score.astype(float),
            "migraine_probability": event_prob.astype(float),
            "migraine_label": migraine_label.astype(int),
        }
    )
    return df


def generate_environmental_signals(
    days: int,
    periods: int,
    day_fraction: np.ndarray,
    day_index: np.ndarray,
    rng: np.random.Generator,
) -> Tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
    base_temp = rng.normal(loc=18, scale=4)
    daily_temp_shift = rng.normal(0, 1.5, size=days)
    daily_storm_flag = rng.binomial(1, 0.18, size=days)
    daily_storm_intensity = rng.uniform(4, 12, size=days) * daily_storm_flag
    daily_cloud_cover = rng.uniform(0.2, 0.9, size=days) * (1 - 0.4 * daily_storm_flag)

    solar_wave = np.sin(2 * np.pi * (day_fraction - 0.25))
    solar_wave = np.clip(solar_wave, 0, None)

    temperature_c = (
        base_temp
        + 7 * np.sin(2 * np.pi * (day_fraction - 0.2))
        + daily_temp_shift[day_index]
        - 0.4 * daily_storm_intensity[day_index]
        + rng.normal(0, 1.2, size=periods)
    )

    barometric_pressure_hpa = (
        1013
        + rng.normal(0, 3, size=periods)
        - daily_storm_intensity[day_index]
        - solar_wave * 1.5
    )

    solar_pressure_index = np.clip(solar_wave * (1 - daily_cloud_cover[day_index]), 0, 1)
    uv_index = np.clip(solar_pressure_index * 11 + rng.normal(0, 0.5, size=periods), 0, 11)

    ambient_noise_db = (
        38
        + 12 * ((day_fraction > 0.2) & (day_fraction < 0.9))
        + 3 * rng.uniform(0, 1, size=periods)
        + rng.normal(0, 2, size=periods)
    )

    ambient_noise_db += rng.uniform(0, 6, size=periods) * (day_fraction > 0.5)

    weather_condition = np.full(periods, "clear", dtype=object)
    weather_condition[daily_storm_flag[day_index] == 1] = "storm"
    weather_condition[(daily_storm_flag[day_index] == 0) & (daily_cloud_cover[day_index] > 0.65)] = "cloudy"
    weather_condition[(solar_pressure_index > 0.7) & (daily_cloud_cover[day_index] < 0.4)] = "sunny"

    return (
        temperature_c,
        barometric_pressure_hpa,
        solar_pressure_index,
        uv_index,
        ambient_noise_db,
        weather_condition,
    )


def expand_events(seed: np.ndarray) -> np.ndarray:
    kernel = np.ones(60, dtype=int)
    convolved = np.convolve(seed.astype(int), kernel, mode="same")
    return convolved > 0


def generate_dataset(users: int, days: int, seed: int, outdir: Path) -> Tuple[pd.DataFrame, dict]:
    rng = np.random.default_rng(seed)
    frames = []
    profiles = []
    for uid in range(users):
        profile = build_user_profile(uid, rng)
        profiles.append(profile)
        frames.append(simulate_user_timeseries(profile, days, rng))

    dataset = pd.concat(frames, ignore_index=True)
    metadata = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "users": users,
        "days": days,
        "rows": int(dataset.shape[0]),
        "seed": seed,
        "signals": [
            "heart_rate",
            "hrv",
            "sleep_debt_hours",
            "screen_time_minutes",
            "calendar_load",
            "temperature_c",
            "barometric_pressure_hpa",
            "solar_pressure_index",
            "uv_index",
            "ambient_noise_db",
            "weather_condition",
            "trigger_score",
            "migraine_probability",
        ],
        "label": "migraine_label",
        "user_profiles": [profile.__dict__ for profile in profiles],
    }
    return dataset, metadata


def main() -> None:
    args = parse_args()
    outdir = args.outdir.resolve()
    outdir.mkdir(parents=True, exist_ok=True)

    dataset, metadata = generate_dataset(args.users, args.days, args.seed, outdir)

    parquet_path = outdir / "synthetic_timeseries.parquet"
    csv_path = outdir / "synthetic_timeseries.csv"
    meta_path = outdir / "metadata.json"

    dataset.to_parquet(parquet_path, index=False)
    dataset.to_csv(csv_path, index=False)
    meta_path.write_text(json.dumps(metadata, indent=2))

    print(f"✅ Created {len(dataset):,} rows for {args.users} users over {args.days} days")
    print(f"   • Parquet:  {parquet_path}")
    print(f"   • CSV:      {csv_path}")
    print(f"   • Metadata: {meta_path}")


if __name__ == "__main__":
    main()
