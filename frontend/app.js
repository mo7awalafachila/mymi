const $ = (id) => document.getElementById(id);

const state = {
  baseUrl: "http://localhost:8000",
  apiKey: "",
  userId: "user_000",
};

const setStatus = (message, variant = "info") => {
  const status = $("status");
  status.textContent = `[${variant.toUpperCase()}] ${message}`;
  status.className = variant;
};

const pretty = (data) => JSON.stringify(data, null, 2);

const applyConfig = () => {
  state.baseUrl = $("base-url").value.trim() || state.baseUrl;
  state.apiKey = $("api-key").value.trim();
  state.userId = $("user-id").value.trim() || state.userId;
  setStatus(`Config saved. Targeting ${state.baseUrl} as ${state.userId}.`);
};

const headers = () => {
  if (!state.apiKey) {
    throw new Error("Missing API key; set it in the connection card.");
  }
  return {
    "Content-Type": "application/json",
    "X-API-KEY": state.apiKey,
  };
};

const apiRequest = async (path, options = {}) => {
  const url = new URL(path, state.baseUrl).toString();
  const response = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers ?? {}),
      ...headers(),
    },
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`HTTP ${response.status}: ${text}`);
  }
  if (response.status === 204) {
    return null;
  }
  return response.json();
};

const generateEvent = (userId, minutesAgo) => {
  const timestamp = new Date(Date.now() - minutesAgo * 60 * 1000).toISOString();
  const baseHr = 70 + Math.sin(minutesAgo / 30) * 10;
  return {
    user_id: userId,
    timestamp,
    heart_rate: Number((baseHr + Math.random() * 5).toFixed(2)),
    hrv: Number((55 + Math.random() * 15).toFixed(2)),
    sleep_debt_hours: Number((Math.random() * 4).toFixed(2)),
    screen_time_minutes: Number((20 + Math.random() * 40).toFixed(2)),
    calendar_load: Number((Math.random() * 1.2).toFixed(2)),
    temperature_c: Number((20 + Math.random() * 10).toFixed(2)),
    barometric_pressure_hpa: Number((1005 + Math.random() * 10).toFixed(2)),
    solar_pressure_index: Number((Math.random() * 1).toFixed(3)),
    uv_index: Number((Math.random() * 11).toFixed(2)),
    ambient_noise_db: Number((45 + Math.random() * 25).toFixed(2)),
    trigger_score: Number((Math.random()).toFixed(2)),
    migraine_probability: Number((Math.random()).toFixed(2)),
    weather_condition: "clear",
  };
};

const generateSamplePayload = () => {
  const events = Array.from({ length: 30 }, (_, idx) =>
    generateEvent(state.userId, (30 - idx) * 2)
  );
  $("ingest-payload").value = pretty(events);
  setStatus("Sample payload generated.");
};

const ingestBatch = async () => {
  const raw = $("ingest-payload").value.trim();
  if (!raw) {
    throw new Error("Provide a JSON array in the ingest textarea before sending.");
  }
  let payload;
  try {
    payload = JSON.parse(raw);
  } catch (err) {
    throw new Error("Payload is not valid JSON.");
  }
  if (!Array.isArray(payload)) {
    throw new Error("Payload must be a JSON array.");
  }
  const results = [];
  for (const record of payload) {
    const response = await apiRequest("/ingest", {
      method: "POST",
      body: JSON.stringify(record),
    });
    results.push(response);
  }
  $("predict-output").textContent = pretty(results.at(-1));
  setStatus(`Ingested ${results.length} events for ${state.userId}.`, "success");
};

const fetchPredict = async () => {
  const data = await apiRequest(`/predict/${state.userId}`);
  $("predict-output").textContent = pretty(data);
  setStatus(`Prediction refreshed for ${state.userId}.`, "success");
};

const fetchInsights = async () => {
  const data = await apiRequest(`/insights/${state.userId}`);
  $("insights-output").textContent = pretty(data);
  setStatus("Insights updated.", "success");
};

const fetchCoach = async () => {
  const context = $("coach-context").value;
  const data = await apiRequest(`/coach/${state.userId}`, {
    method: "POST",
    body: JSON.stringify({ context }),
  });
  $("coach-output").textContent = pretty(data);
  setStatus("Coach response updated.", "success");
};

const fetchHealth = async () => {
  const url = new URL("/health", state.baseUrl).toString();
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Healthcheck failed with ${response.status}`);
  }
  const data = await response.json();
  $("health-output").textContent = pretty(data);
  setStatus("Healthcheck OK.", "success");
};

const wireEvents = () => {
  $("save-config").addEventListener("click", () => {
    try {
      applyConfig();
    } catch (err) {
      setStatus(err.message, "error");
    }
  });

  $("generate-sample").addEventListener("click", () => {
    try {
      generateSamplePayload();
    } catch (err) {
      setStatus(err.message, "error");
    }
  });

  $("send-ingest").addEventListener("click", async () => {
    try {
      await ingestBatch();
    } catch (err) {
      setStatus(err.message, "error");
    }
  });

  $("run-predict").addEventListener("click", async () => {
    try {
      await fetchPredict();
    } catch (err) {
      setStatus(err.message, "error");
    }
  });

  $("run-insights").addEventListener("click", async () => {
    try {
      await fetchInsights();
    } catch (err) {
      setStatus(err.message, "error");
    }
  });

  $("run-coach").addEventListener("click", async () => {
    try {
      await fetchCoach();
    } catch (err) {
      setStatus(err.message, "error");
    }
  });

  $("run-health").addEventListener("click", async () => {
    try {
      await fetchHealth();
    } catch (err) {
      setStatus(err.message, "error");
    }
  });
};

const init = () => {
  $("ingest-payload").value = "";
  wireEvents();
  setStatus("Ready. Generate events or paste telemetry to start.");
};

init();
