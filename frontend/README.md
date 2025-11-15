# Head Start Frontend Console

Lightweight static dashboard for exercising the FastAPI inference service. It lets you:

- Configure base URL, API token, and active user ID.
- Generate synthetic JSON payloads that match the `/ingest` schema.
- Fire `/ingest`, `/predict`, `/insights`, `/coach`, and `/health` requests and inspect the JSON responses inline.

## Prerequisites

1. Backend running locally:
   ```bash
   uvicorn backend.app:app --env-file .env --reload
   ```
2. A valid API token in `.env` (referenced as `API_TOKEN`).

## Run the frontend

Serve the static files with any HTTP server. Two common options:

```bash
# Option 1: Python built-in HTTP server
python -m http.server 5173 -d frontend

# Option 2: Node's `serve` utility
npx serve frontend -l 5173
```

Then open http://localhost:5173 in your browser.

## Usage tips

1. Click **Generate 30 sample events** to populate the ingest textarea.
2. Update the API token and base URL if your backend differs from the default `http://localhost:8000`.
3. Press **POST /ingest batch**; the UI sends each JSON object sequentially.
4. Use the prediction buttons to view probability, insights, and coaching guidance.

The panel never stores your token beyond the current tab and relies on the backend's permissive CORS settings.
