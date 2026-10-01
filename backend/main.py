import os
from contextlib import asynccontextmanager
from typing import Optional, List
from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.database import init_db, seed_demo_data
from backend.models import (
    LoginRequest, RegisterRequest, AuthResponse, PortfolioSummary,
    HoldingModel, AssetModel, GoalModel, GoalCreate, GoalUpdate,
    ChatRequest, ChatResponse, SimulatedImportRequest, ImportResponse,
    PortfolioInsightsResponse
)
from backend.services.auth_service import authenticate_user, register_user, get_demo_user
from backend.services.portfolio_service import (
    get_user_portfolio_summary, get_user_holdings, get_asset_by_id,
    get_all_assets, reset_demo_portfolio
)
from backend.services.analytics_service import get_portfolio_insights
from backend.services.goals_service import (
    get_user_goals, create_goal, update_goal, delete_goal
)
from backend.services.copilot_service import generate_copilot_response
from backend.services.import_service import simulate_source_sync, parse_and_import_csv

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure database is initialized and seeded on startup
    init_db()
    seed_demo_data(force=False)
    yield

app = FastAPI(
    title="ZeroLatency Wealth API",
    description="Backend services for ZeroLatency Wealth: Unified Multi-Asset Investing & Awareness Platform",
    version="1.0.0",
    lifespan=lifespan
)

# CORS setup for Vite frontend (typically localhost:5173 or any dev port)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_current_user_id(authorization: Optional[str] = Header(None)) -> str:
    # Hackathon prototype: defaults to demo-user-001 if header not provided or is demo
    return "demo-user-001"

# ----------------- AUTH ENDPOINTS -----------------

@app.post("/api/auth/demo", response_model=AuthResponse)
def demo_login():
    """Continue with 1-click Demo Account loaded with realistic multi-asset data."""
    return get_demo_user()

@app.post("/api/auth/login", response_model=AuthResponse)
def login(req: LoginRequest):
    auth = authenticate_user(req.email, req.password)
    if not auth:
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    return auth

@app.post("/api/auth/register", response_model=AuthResponse)
def register(req: RegisterRequest):
    auth = register_user(req.name, req.email, req.password)
    if not auth:
        raise HTTPException(status_code=400, detail="An account with this email already exists.")
    return auth

# ----------------- PORTFOLIO ENDPOINTS -----------------

@app.get("/api/portfolio", response_model=List[HoldingModel])
def get_portfolio_holdings(
    asset_type: Optional[str] = "ALL",
    source: Optional[str] = None,
    search: Optional[str] = None,
    user_id: str = Depends(get_current_user_id)
):
    """Retrieve all consolidated holdings with optional filters for asset class, source, and search."""
    return get_user_holdings(user_id=user_id, asset_type=asset_type, source=source, search=search)

@app.get("/api/portfolio/summary", response_model=PortfolioSummary)
def get_portfolio_summary_endpoint(user_id: str = Depends(get_current_user_id)):
    """Retrieve comprehensive portfolio snapshot (Total Value, Invested, P/L, Allocations, Sources)."""
    return get_user_portfolio_summary(user_id=user_id)

@app.post("/api/portfolio/reset")
def reset_portfolio(user_id: str = Depends(get_current_user_id)):
    """Reset the demo portfolio back to the canonical benchmark state."""
    return reset_demo_portfolio()

# ----------------- ASSET EXPLORER ENDPOINTS -----------------

@app.get("/api/assets", response_model=List[AssetModel])
def list_assets():
    """Retrieve all master assets across Equities, Bonds, REITs, InvITs, and Cash."""
    return get_all_assets()

@app.get("/api/assets/{asset_id}", response_model=AssetModel)
def get_asset_detail(asset_id: str):
    asset = get_asset_by_id(asset_id)
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found.")
    return asset

# ----------------- PORTFOLIO INSIGHTS ENDPOINTS -----------------

@app.get("/api/insights", response_model=PortfolioInsightsResponse)
def get_insights(user_id: str = Depends(get_current_user_id)):
    """Retrieve AI-assisted portfolio observations, risk metrics, and income forecasts."""
    return get_portfolio_insights(user_id=user_id)

# ----------------- GOALS ENDPOINTS -----------------

@app.get("/api/goals", response_model=List[GoalModel])
def list_goals(user_id: str = Depends(get_current_user_id)):
    return get_user_goals(user_id=user_id)

@app.post("/api/goals", response_model=GoalModel)
def add_goal(goal: GoalCreate, user_id: str = Depends(get_current_user_id)):
    return create_goal(goal, user_id=user_id)

@app.put("/api/goals/{goal_id}", response_model=GoalModel)
def update_goal_endpoint(goal_id: str, updates: GoalUpdate, user_id: str = Depends(get_current_user_id)):
    updated = update_goal(goal_id, updates, user_id=user_id)
    if not updated:
        raise HTTPException(status_code=404, detail="Goal not found.")
    return updated

@app.delete("/api/goals/{goal_id}")
def remove_goal(goal_id: str, user_id: str = Depends(get_current_user_id)):
    success = delete_goal(goal_id, user_id=user_id)
    if not success:
        raise HTTPException(status_code=404, detail="Goal not found.")
    return {"status": "success", "message": "Goal removed successfully."}

# ----------------- AGGREGATION & IMPORT SIMULATION -----------------

@app.post("/api/import/demo", response_model=ImportResponse)
def simulate_import(req: SimulatedImportRequest, user_id: str = Depends(get_current_user_id)):
    """Simulate fetching and normalizing holdings from Broker A, Broker B, or Depository."""
    return simulate_source_sync(req.source_name, user_id=user_id)

@app.post("/api/import/csv", response_model=ImportResponse)
async def upload_csv(file: UploadFile = File(...), user_id: str = Depends(get_current_user_id)):
    """Real CSV upload and ingestion with automatic column mapping."""
    content = await file.read()
    decoded = content.decode("utf-8", errors="ignore")
    return parse_and_import_csv(decoded, user_id=user_id)

# ----------------- ZERO LATENCY COPILOT -----------------

@app.post("/api/copilot/chat", response_model=ChatResponse)
async def copilot_chat(req: ChatRequest, user_id: str = Depends(get_current_user_id)):
    """Multi-asset educational and portfolio awareness AI assistant."""
    return await generate_copilot_response(
        message=req.message,
        context_asset_id=req.context_asset_id,
        user_id=user_id
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
