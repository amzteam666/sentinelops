from fastapi import FastAPI
from datetime import datetime, timezone

app = FastAPI(
    title="SentinelOps API",
    description="A secure DevSecOps portfolio application",
    version="1.0.0",
)


@app.get("/")
def root():
    return {
        "application": "SentinelOps API",
        "status": "running",
    }


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
