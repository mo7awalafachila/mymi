# Head Start – Expo iOS App (Predict)

Minimal Expo client focused on `GET /predict/{user_id}` for the Head Start FastAPI backend.

## Prerequisites
- Backend deployed with HTTPS (iOS ATS requires HTTPS by default). Any of these work:
  - Render / Railway (Web Service) – auto HTTPS
  - Azure App Service / Container Apps – enable HTTPS
  - Docker behind an HTTPS reverse proxy
- Your backend's `API_TOKEN` value; you'll enter it as `X-API-KEY` in the app.

## Run locally on iOS
```bash
cd mobile
npm install
npx expo start
# Press 'i' for iOS simulator, or scan QR with Expo Go on your iPhone
```

In the app:
- Set the HTTPS Base URL to your deployed backend (e.g., `https://your-app.onrender.com`).
- Paste the API token (must match backend `.env` `API_TOKEN`).
- Enter a `user_id` you have data for (e.g. `user_000`).
- Tap GET /predict to fetch the latest probability/risk.

If you haven't ingested data for that user yet, the backend will return 404.

## Deploy the backend quickly (two options)

### A) Render (no Docker required)
1. Push this repo to GitHub.
2. New Web Service → Select repo → Python
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn backend.app:app --host 0.0.0.0 --port $PORT`
5. Environment vars:
   - `API_TOKEN=<your-secret>`
   - `MODEL_PATH=models/model.pkl`
   - `SCALER_PATH=models/scaler.pkl`
   - `FEATURE_METADATA_PATH=models/feature_metadata.json`
6. Wait for deploy, then visit `https://<service>.onrender.com/health`.

### B) Any Docker host
```bash
# Build image
docker build -t head-start-backend .

# Run container (replace TOKEN)
docker run -p 8000:8000 \
  -e API_TOKEN=super-secret-key \
  -e MODEL_PATH=models/model.pkl \
  -e SCALER_PATH=models/scaler.pkl \
  -e FEATURE_METADATA_PATH=models/feature_metadata.json \
  head-start-backend
```
Place an HTTPS reverse proxy (e.g., Caddy, Nginx, or your cloud's load balancer) in front of the container to satisfy iOS HTTPS requirements.
