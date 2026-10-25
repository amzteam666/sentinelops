from datetime import datetime, timezone
from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

app = FastAPI(
    title="SentinelOps API",
    description="A secure DevSecOps portfolio application",
    version="1.0.0",
)

BASE_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIR = BASE_DIR / "frontend"

app.mount(
    "/static",
    StaticFiles(directory=FRONTEND_DIR),
    name="static",
)


@app.get("/", include_in_schema=False)
def dashboard():
    return FileResponse(FRONTEND_DIR / "index.html")


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@app.get("/api/v1/info")
def application_info():
    return {
        "name": "SentinelOps",
        "version": "1.0.0",
        "purpose": "Secure DevSecOps demonstration",
    }
