# Simple production image for the FastAPI backend
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

# System deps (build and runtime)
RUN apt-get update -y && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy and install Python deps first (better layer caching)
COPY requirements.txt ./
RUN pip install -r requirements.txt

# Copy source
COPY . .

# Expose the HTTP port
EXPOSE 8000

# Expected runtime variables (set in your host or cloud):
# - API_TOKEN
# - MODEL_PATH (default models/model.pkl)
# - SCALER_PATH (default models/scaler.pkl)
# - FEATURE_METADATA_PATH (default models/feature_metadata.json)
# - (optional) REFRESH_INTERVAL_SECONDS, MAX_EVENTS_PER_USER

# Start command
CMD ["uvicorn", "backend.app:app", "--host", "0.0.0.0", "--port", "8000"]
