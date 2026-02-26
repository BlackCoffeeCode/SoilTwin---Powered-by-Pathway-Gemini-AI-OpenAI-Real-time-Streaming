from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from backend.api_routes import router as api_router
import uvicorn
from dotenv import load_dotenv
import os

# Load .env explicitly
load_dotenv()

app = FastAPI(title="SoilTwin API", version="1.0.0")

# Rate Limiter Configuration
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "https://d2bebk7g4ys5zv.cloudfront.net"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(api_router, prefix="/api")

@app.get("/")
def root():
    return {
        "message": "SoilTwin API - Intelligent Soil Health Monitoring",
        "version": "1.0.0",
        "status": "Running"
    }

if __name__ == "__main__":
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
