# Head Start MVP Backend

This repository houses a  backend prototype for forecasting migraine onset using synthetic biometric and contextual signals.

## Structure

```
backend/   # FastAPI service exposing ingest/predict/insights/coach endpoints
data/      # Generated datasets and metadata
frontend/  # Static dashboard to exercise the API
models/    # Trained models and experiment artifacts
scripts/   # Utility scripts (data generation, feature prep, demos)
```

## Quickstart

1. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```
2. **Generate synthetic dataset**
   ```bash
   python scripts/generate_data.py --users 30 --days 30 --outdir data
   ```
   Flags:
   - `--users`: number of synthetic personas (default 30)
   - `--days`: days per user at one-minute resolution (default 30)
   - `--outdir`: destination folder (default `data/`)
   - `--seed`: RNG seed for reproducibility (default 42)
3. **Build engineered features**
   ```bash
   python scripts/build_features.py --input data/synthetic_timeseries.parquet --output data/features.parquet
   ```
   - Aggregates rolling stats (15m–6h), circadian deltas, context flags, and future-looking targets.
   - Drops early rows per user until sufficient history exists (default 360 minutes).
4. **Train baseline model**
   ```bash
   python models/train.py --features data/features.parquet --model models/model.pkl --scaler models/scaler.pkl --metrics models/metrics.json
   ```
   - Splits users (80/20) to prevent leakage, scales features, and fits a LightGBM classifier.
   - Persists `models/model.pkl`, `models/scaler.pkl`, `models/feature_metadata.json`, and `models/metrics.json` (precision/recall/F1/lead-time).
5. **Outputs**
   - `data/synthetic_timeseries.parquet`
   - `data/synthetic_timeseries.csv`
   - `data/metadata.json` summary with generator inputs and user profiles

   Columns include biometrics (heart rate, HRV), behavioral signals (sleep debt,
   screen time, calendar load), and environmental context (temperature,
   barometric pressure, solar pressure index, UV index, ambient noise, weather
   condition) plus probability and labels for migraine windows.
6. **Run the FastAPI service**
   ```bash
   uvicorn backend.app:app --env-file .env --reload
   ```
   - Requires `MODEL_PATH`, `SCALER_PATH`, `FEATURE_METADATA_PATH`, and `API_TOKEN` set in `.env` (see `.env.example`).
   - Authentication uses the `X-API-KEY` header on every request.
7. **Smoke test the API**
   ```bash
   python scripts/test_api.py
   ```
   - Sends synthetic minute-level events to `/ingest`, then exercises `/predict/{user_id}`, `/insights/{user_id}`, and `/coach/{user_id}`.
   - The test prints sample responses; warnings about `StandardScaler` feature names are expected when running on ad-hoc payloads.
8. **Launch the frontend console (optional)**
   ```bash
   python -m http.server 5173 -d frontend
   ```
   - Opens a static dashboard at http://localhost:5173 for configuring the API token, generating sample payloads, and driving all endpoints.
   - Any HTTP file server or `npx serve frontend -l 5173` works if you prefer Node tooling.

## Deploying the backend

Quick options depending on your platform:

- Docker (generic):
   ```bash
   docker build -t head-start-backend .
   docker run -p 8000:8000 \
      -e API_TOKEN=super-secret-key \
      -e MODEL_PATH=models/model.pkl \
      -e SCALER_PATH=models/scaler.pkl \
      -e FEATURE_METADATA_PATH=models/feature_metadata.json \
      head-start-backend
   ```
   Put HTTPS in front of 8000 for iOS (reverse proxy / cloud LB).

- Render (managed HTTPS):
   - Build: `pip install -r requirements.txt`
   - Start: `uvicorn backend.app:app --host 0.0.0.0 --port $PORT`
   - Set env vars for `API_TOKEN`, `MODEL_PATH`, `SCALER_PATH`, `FEATURE_METADATA_PATH`.

## iOS client (Expo)

- A minimal Expo app is included in `mobile/` focused on `GET /predict`.
   ```bash
   cd mobile
   npm install
   npx expo start
   ```
   Configure the HTTPS base URL, paste your `API_TOKEN`, set a `user_id`, then tap GET /predict.

## Environment

Copy `.env.example` to `.env` and update secrets before running any services.
