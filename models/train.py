"""Baseline gradient boosting trainer for Head Start MVP."""

from __future__ import annotations

import argparse
import json
from datetime import datetime, timezone
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from lightgbm import LGBMClassifier
from sklearn.metrics import f1_score, precision_score, recall_score, roc_auc_score
from sklearn.preprocessing import StandardScaler

LABEL_COL = "target_migraine_next6h"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Train baseline migraine predictor")
    parser.add_argument("--features", type=Path, default=Path("data/features.parquet"), help="Feature parquet path")
    parser.add_argument("--model", type=Path, default=Path("models/model.pkl"), help="Destination for trained model")
    parser.add_argument("--scaler", type=Path, default=Path("models/scaler.pkl"), help="Destination for fitted scaler")
    parser.add_argument("--feature-metadata", type=Path, default=Path("models/feature_metadata.json"), help="Where to write feature list and metadata")
    parser.add_argument("--metrics", type=Path, default=Path("models/metrics.json"), help="Where to log evaluation metrics")
    parser.add_argument("--test-ratio", type=float, default=0.2, help="Fraction of users held out for evaluation")
    parser.add_argument("--seed", type=int, default=42, help="Random seed for reproducibility")
    parser.add_argument("--threshold", type=float, default=0.5, help="Classification threshold for metrics")
    return parser.parse_args()


def load_features(path: Path) -> pd.DataFrame:
    df = pd.read_parquet(path)
    if LABEL_COL not in df.columns:
        raise ValueError(f"Missing required label column '{LABEL_COL}'. Run scripts/build_features.py first.")
    return df


def prepare_data(df: pd.DataFrame) -> tuple[pd.DataFrame, pd.Series, pd.Series, list[str]]:
    work = df.copy()
    bool_cols = work.select_dtypes(include="bool").columns
    if len(bool_cols) > 0:
        work[bool_cols] = work[bool_cols].astype(int)

    exclude = {
        LABEL_COL,
        "timestamp",
        "user_id",
        "migraine_label",
        "weather_condition",
        "minutes_until_migraine",
    }
    numeric_cols = work.select_dtypes(include=[np.number]).columns
    feature_cols = [col for col in numeric_cols if col not in exclude]

    data = work[feature_cols].replace([np.inf, -np.inf], np.nan).dropna()
    valid_idx = data.index
    targets = work.loc[valid_idx, LABEL_COL].astype(int)
    user_series = work.loc[valid_idx, "user_id"]

    return data, targets, user_series, feature_cols


def split_by_user(data: pd.DataFrame, targets: pd.Series, user_series: pd.Series, test_ratio: float, seed: int):
    unique_users = user_series.drop_duplicates().to_numpy()
    rng = np.random.default_rng(seed)
    rng.shuffle(unique_users)
    split_idx = max(1, int(len(unique_users) * (1 - test_ratio)))
    train_users = set(unique_users[:split_idx])
    test_users = set(unique_users[split_idx:])

    train_mask = user_series.isin(train_users)
    test_mask = user_series.isin(test_users)

    return (
        data.loc[train_mask],
        targets.loc[train_mask],
        data.loc[test_mask],
        targets.loc[test_mask],
        train_users,
        test_users,
    )


def train_model(X_train: pd.DataFrame, y_train: pd.Series, seed: int) -> tuple[LGBMClassifier, StandardScaler]:
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)

    clf = LGBMClassifier(
        n_estimators=400,
        learning_rate=0.05,
        max_depth=-1,
        subsample=0.8,
        colsample_bytree=0.8,
        reg_alpha=0.1,
        reg_lambda=0.2,
        random_state=seed,
        class_weight="balanced",
    )
    clf.fit(X_train_scaled, y_train)
    return clf, scaler


def evaluate_model(clf: LGBMClassifier, scaler: StandardScaler, X_test: pd.DataFrame, y_test: pd.Series, threshold: float) -> tuple[dict, np.ndarray, np.ndarray]:
    X_test_scaled = scaler.transform(X_test)
    probas = clf.predict_proba(X_test_scaled)[:, 1]
    preds = (probas >= threshold).astype(int)

    metrics = {
        "precision": float(precision_score(y_test, preds, zero_division=0)),
        "recall": float(recall_score(y_test, preds, zero_division=0)),
        "f1": float(f1_score(y_test, preds, zero_division=0)),
        "roc_auc": float(roc_auc_score(y_test, probas)) if len(np.unique(y_test)) > 1 else None,
        "threshold": threshold,
    }

    return metrics, probas, preds


def compute_lead_time(df_subset: pd.DataFrame, preds: np.ndarray) -> float | None:
    mask = (preds == 1) & df_subset["minutes_until_migraine"].notna()
    if mask.any():
        return float(df_subset.loc[mask, "minutes_until_migraine"].mean())
    return None


def save_artifacts(args: argparse.Namespace, clf: LGBMClassifier, scaler: StandardScaler, feature_cols: list[str], metrics: dict) -> None:
    for path in [args.model, args.scaler, args.feature_metadata, args.metrics]:
        path.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(clf, args.model)
    joblib.dump(scaler, args.scaler)

    meta = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "feature_count": len(feature_cols),
        "features": feature_cols,
        "label": LABEL_COL,
    }
    args.feature_metadata.write_text(json.dumps(meta, indent=2))
    args.metrics.write_text(json.dumps(metrics, indent=2))


def main() -> None:
    args = parse_args()
    df = load_features(args.features)
    data, targets, user_series, feature_cols = prepare_data(df)

    X_train, y_train, X_test, y_test, train_users, test_users = split_by_user(
        data, targets, user_series, args.test_ratio, args.seed
    )

    if len(X_test) == 0:
        raise ValueError("No samples in test split. Reduce test_ratio or ensure sufficient users.")

    clf, scaler = train_model(X_train, y_train, args.seed)
    metrics, probas, preds = evaluate_model(clf, scaler, X_test, y_test, args.threshold)

    lead_subset = df.loc[X_test.index].reindex(X_test.index)
    lead_time = compute_lead_time(lead_subset, preds)
    metrics.update(
        {
            "avg_lead_time_minutes": lead_time,
            "train_users": len(train_users),
            "test_users": len(test_users),
            "train_samples": int(len(X_train)),
            "test_samples": int(len(X_test)),
        }
    )

    save_artifacts(args, clf, scaler, feature_cols, metrics)

    print("✅ Training complete")
    print(json.dumps(metrics, indent=2))


if __name__ == "__main__":
    main()
