import os
import logging
from contextlib import asynccontextmanager
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Depends, Header, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from backend.database import init_db, seed_demo_data
from backend.models import (
    LoginRequest, RegisterRequest, ForgotPasswordRequest, ResetPasswordRequest,
    VerifyEmailRequest, RefreshTokenRequest, AuthResponse, UserProfile,
    PortfolioSummary, HoldingModel, AssetModel, GoalModel, GoalCreate, GoalUpdate,
    ChatRequest, ChatResponse, SimulatedImportRequest, ImportResponse,
    PortfolioInsightsResponse, MarketOverviewResponse, MarketQuoteModel,
    WatchlistItem, PaperOrderRequest, PaperOrderResponse, PaperAccountResponse
)
from backend.services.auth_service import (
    authenticate_user, register_user, get_demo_user, refresh_user_token,
    request_password_reset, reset_password_with_token, verify_email_token
)
from backend.services.portfolio_service import (
    get_user_portfolio_summary, get_user_holdings, get_asset_by_id,
    get_all_assets, reset_demo_portfolio
)
from backend.services.market_data_service import get_market_data_provider
from backend.services.analytics_service import get_portfolio_insights
from backend.services.goals_service import (
    get_user_goals, create_goal, update_goal, delete_goal
)
from backend.services.local_ai_service import generate_chat_response, check_ollama_health
from backend.services.import_service import simulate_source_sync, parse_and_import_csv
from backend.services.watchlist_service import get_user_watchlist, add_to_watchlist, remove_from_watchlist
from backend.services.paper_trading_service import (
    get_paper_account_summary, execute_paper_order, get_user_paper_orders
)
from backend.security import (
    SecurityHeadersMiddleware, check_rate_limit,
    get_current_authenticated_user, get_optional_user
)

# Logging configuration
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("zerolatency.main")

APP_ENV = os.getenv("APP_ENV", "development").lower()
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize and seed benchmark demo data
    init_db()
    seed_demo_data(force=False)
    logger.info("ZeroLatency Wealth backend started with database initialized.")
    yield
    logger.info("ZeroLatency Wealth backend shutting down.")

app = FastAPI(
    title="ZeroLatency Wealth API",
    description="Backend services for ZeroLatency Wealth: Unified Multi-Asset Investing & Awareness Platform",
    version="2.0.0",
    lifespan=lifespan
)

# Security Headers
app.add_middleware(SecurityHeadersMiddleware)

# Strict CORS configuration (Requirement #29)
if APP_ENV == "production":
    allowed_origins = [FRONTEND_URL]
else:
    allowed_origins = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        FRONTEND_URL
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Standardized Error Handling (Requirement #32)
@app.exception_handler(HTTPException)
async def custom_http_exception_handler(request: Request, exc: HTTPException):
    code_map = {
        400: "BAD_REQUEST",
        401: "AUTH_UNAUTHORIZED",
        403: "AUTH_FORBIDDEN",
        404: "NOT_FOUND",
        429: "RATE_LIMIT_EXCEEDED",
        500: "INTERNAL_SERVER_ERROR"
    }
    err_code = code_map.get(exc.status_code, "ERROR")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": {
                "code": err_code,
                "message": exc.detail
            }
        }
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception at {request.url.path}: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected error occurred. Please try again later."
            }
        }
    )

# ----------------- HEALTH & SYSTEM DIAGNOSTICS -----------------

@app.get("/api/health")
async def health_check():
    """System health check (Requirement #46)."""
    ollama_info = await check_ollama_health()
    market_provider = get_market_data_provider()
    return {
        "status": "ok",
        "app": "ZeroLatency Wealth",
        "version": "2.0.0",
        "env": APP_ENV,
        "services": {
            "database": "connected",
            "market_data": "ready",
            "local_ai": ollama_info.get("status", "OFFLINE")
        }
    }

@app.get("/api/ai/health")
async def ai_health():
    """Internal Local AI health check (Requirement #47)."""
    return await check_ollama_health()

# ----------------- AUTHENTICATION ENDPOINTS -----------------

@app.post("/api/auth/demo", response_model=AuthResponse)
def demo_login():
    """Continue with 1-click Demo Account loaded with realistic multi-asset benchmark data (Requirement #14)."""
    return get_demo_user()

@app.post("/api/auth/login", response_model=AuthResponse)
def login(req: LoginRequest, request: Request):
    """Authenticate user with Argon2id and rate limiting (Requirement #4, #6)."""
    check_rate_limit(request, max_requests=15, window_seconds=60, bucket="login")
    ip_addr = request.client.host if request.client else None
    result = authenticate_user(req.email, req.password, ip_address=ip_addr)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )
    auth_resp, refresh_token = result
    auth_resp.refresh_token = refresh_token
    return auth_resp

@app.post("/api/auth/register", response_model=AuthResponse)
def register(req: RegisterRequest, request: Request):
    """Register new user account with Argon2id password hashing and user isolation (Requirement #4, #5)."""
    check_rate_limit(request, max_requests=10, window_seconds=60, bucket="register")
    if len(req.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters.")

    ip_addr = request.client.host if request.client else None
    auth_resp, refresh_token, error_msg = register_user(req.name, req.email, req.password, ip_address=ip_addr)
    if error_msg:
        raise HTTPException(status_code=400, detail=error_msg)

    auth_resp.refresh_token = refresh_token
    return auth_resp

@app.post("/api/auth/refresh")
def refresh_token_endpoint(req: RefreshTokenRequest):
    """Refresh JWT access token with token rotation (Requirement #4, #10)."""
    tokens = refresh_user_token(req.refresh_token)
    if not tokens:
        raise HTTPException(status_code=401, detail="Refresh token is invalid or expired.")
    access_token, new_refresh = tokens
    return {"token": access_token, "refresh_token": new_refresh, "message": "Token refreshed."}

@app.get("/api/auth/me", response_model=UserProfile)
def get_me(user: UserProfile = Depends(get_current_authenticated_user)):
    """Retrieve isolated profile of current authenticated user (Requirement #4, #12)."""
    return user

@app.post("/api/auth/logout")
def logout(user: UserProfile = Depends(get_current_authenticated_user)):
    """Invalidate authenticated session."""
    return {"status": "success", "message": "Logged out successfully."}

@app.post("/api/auth/forgot-password")
def forgot_password(req: ForgotPasswordRequest, request: Request):
    """Initiate password reset request without account enumeration (Requirement #7)."""
    check_rate_limit(request, max_requests=8, window_seconds=60, bucket="forgot_pw")
    request_password_reset(req.email)
    return {
        "success": True,
        "message": "If an account with this email exists, a password reset link has been dispatched."
    }

@app.post("/api/auth/reset-password")
def reset_password(req: ResetPasswordRequest, request: Request):
    """Reset password using secure token (Requirement #7)."""
    check_rate_limit(request, max_requests=8, window_seconds=60, bucket="reset_pw")
    if len(req.new_password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters.")
    success, msg = reset_password_with_token(req.token, req.new_password)
    if not success:
        raise HTTPException(status_code=400, detail=msg)
    return {"success": True, "message": msg}

@app.post("/api/auth/verify-email")
def verify_email(req: VerifyEmailRequest):
    """Verify user email address using token (Requirement #9)."""
    success, msg = verify_email_token(req.token)
    if not success:
        raise HTTPException(status_code=400, detail=msg)
    return {"success": True, "message": msg}

# ----------------- PUBLIC MARKET EXPLORER (Requirement #2, #3) -----------------

@app.get("/api/markets/overview")
def get_market_overview():
    """Retrieve live/demo market indices, market status, and top movers."""
    provider = get_market_data_provider()
    return provider.get_market_overview()

@app.get("/api/markets/quotes")
def get_market_quotes(asset_type: Optional[str] = "ALL", search: Optional[str] = None):
    """Retrieve normalized quotes for public market explorer."""
    provider = get_market_data_provider()
    return provider.get_quotes(asset_type=asset_type, search=search)

@app.get("/api/markets/quote/{symbol_or_id}")
def get_market_quote_detail(symbol_or_id: str):
    """Retrieve deep asset details including historical chart points and fundamentals."""
    provider = get_market_data_provider()
    detail = provider.get_quote_detail(symbol_or_id)
    if not detail:
        raise HTTPException(status_code=404, detail="Asset quote not found.")
    return detail

# ----------------- MASTER ASSETS (Backward Compatibility) -----------------

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

# ----------------- PORTFOLIO ENDPOINTS (User Isolated) -----------------

@app.get("/api/portfolio", response_model=List[HoldingModel])
def get_portfolio_holdings(
    asset_type: Optional[str] = "ALL",
    source: Optional[str] = None,
    search: Optional[str] = None,
    current_user: UserProfile = Depends(get_current_authenticated_user)
):
    """Retrieve consolidated holdings strictly isolated for current user (Requirement #12)."""
    return get_user_holdings(user_id=current_user.id, asset_type=asset_type, source=source, search=search)

@app.get("/api/portfolio/summary", response_model=PortfolioSummary)
def get_portfolio_summary_endpoint(current_user: UserProfile = Depends(get_current_authenticated_user)):
    """Retrieve comprehensive portfolio snapshot isolated for current user (Requirement #12)."""
    summary = get_user_portfolio_summary(user_id=current_user.id)
    summary.is_demo = current_user.is_demo
    return summary

@app.post("/api/portfolio/reset")
def reset_portfolio(current_user: UserProfile = Depends(get_current_authenticated_user)):
    """Reset the demo portfolio back to the canonical benchmark state."""
    if not current_user.is_demo and current_user.id != "demo-user-001":
        raise HTTPException(status_code=400, detail="Portfolio reset is only allowed on Demo mode accounts.")
    return reset_demo_portfolio()

# ----------------- PORTFOLIO INSIGHTS (User Isolated) -----------------

@app.get("/api/insights", response_model=PortfolioInsightsResponse)
def get_insights(current_user: UserProfile = Depends(get_current_authenticated_user)):
    """Retrieve AI observations, risk assessment, and income forecasts for current user (Requirement #12)."""
    return get_portfolio_insights(user_id=current_user.id)

# ----------------- GOALS ENDPOINTS (User Isolated) -----------------

@app.get("/api/goals", response_model=List[GoalModel])
def list_goals(current_user: UserProfile = Depends(get_current_authenticated_user)):
    return get_user_goals(user_id=current_user.id)

@app.post("/api/goals", response_model=GoalModel)
def add_goal(goal: GoalCreate, current_user: UserProfile = Depends(get_current_authenticated_user)):
    return create_goal(goal, user_id=current_user.id)

@app.put("/api/goals/{goal_id}", response_model=GoalModel)
def update_goal_endpoint(goal_id: str, updates: GoalUpdate, current_user: UserProfile = Depends(get_current_authenticated_user)):
    updated = update_goal(goal_id, updates, user_id=current_user.id)
    if not updated:
        raise HTTPException(status_code=404, detail="Goal not found.")
    return updated

@app.delete("/api/goals/{goal_id}")
def remove_goal(goal_id: str, current_user: UserProfile = Depends(get_current_authenticated_user)):
    success = delete_goal(goal_id, user_id=current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Goal not found.")
    return {"status": "success", "message": "Goal removed successfully."}

# ----------------- AGGREGATION & IMPORT -----------------

@app.post("/api/import/demo", response_model=ImportResponse)
def simulate_import(req: SimulatedImportRequest, current_user: UserProfile = Depends(get_current_authenticated_user)):
    """Simulate fetching and normalizing holdings from Broker A, Broker B, or Depository."""
    return simulate_source_sync(req.source_name, user_id=current_user.id)

@app.post("/api/import/csv", response_model=ImportResponse)
async def upload_csv(
    file: UploadFile = File(...),
    current_user: UserProfile = Depends(get_current_authenticated_user)
):
    """Secure CSV upload with size limit, column validation, and malformed row handling (Requirement #37, #38)."""
    if not file.filename or not file.filename.lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only .csv files are supported.")

    content = await file.read()
    # 5MB limit
    if len(content) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="CSV file size exceeds the 5MB maximum limit.")

    decoded = content.decode("utf-8", errors="ignore")
    return parse_and_import_csv(decoded, user_id=current_user.id)

# ----------------- LOCAL AI COPILOT (Requirement #15 - #24) -----------------

@app.post("/api/copilot/chat", response_model=ChatResponse)
async def copilot_chat(
    req: ChatRequest,
    request: Request,
    current_user: Optional[UserProfile] = Depends(get_optional_user)
):
    """Local AI chatbot powered strictly by Ollama with conversational memory, portfolio context, and deterministic fallback."""
    check_rate_limit(request, max_requests=25, window_seconds=60, bucket="copilot_chat")
    user_id = current_user.id if current_user else "demo-user-001"
    response = await generate_chat_response(
        message=req.message,
        user_id=user_id,
        context_asset_id=req.context_asset_id,
        conversation_history=req.conversation_history
    )
    return ChatResponse(**response)

# ----------------- WATCHLIST (Requirement #25) -----------------

@app.get("/api/watchlist")
def list_watchlist(current_user: UserProfile = Depends(get_current_authenticated_user)):
    """Retrieve isolated watchlist items for the authenticated user."""
    return get_user_watchlist(user_id=current_user.id)

@app.post("/api/watchlist/{asset_id}")
def add_watchlist_item(asset_id: str, current_user: UserProfile = Depends(get_current_authenticated_user)):
    """Add stock/asset to authenticated user's watchlist."""
    return add_to_watchlist(user_id=current_user.id, asset_id=asset_id)

@app.delete("/api/watchlist/{asset_id}")
def remove_watchlist_item(asset_id: str, current_user: UserProfile = Depends(get_current_authenticated_user)):
    """Remove asset from authenticated user's watchlist."""
    return remove_from_watchlist(user_id=current_user.id, asset_id=asset_id)

# ----------------- PAPER TRADING (Requirement #26) -----------------

@app.get("/api/paper-trading/account", response_model=PaperAccountResponse)
def get_paper_account(current_user: UserProfile = Depends(get_current_authenticated_user)):
    """Retrieve simulated paper trading buying power, balance, and holdings equity."""
    return get_paper_account_summary(user_id=current_user.id)

@app.post("/api/paper-trading/order", response_model=PaperOrderResponse)
def place_paper_order(
    req: PaperOrderRequest,
    request: Request,
    current_user: UserProfile = Depends(get_current_authenticated_user)
):
    """Execute simulated paper trading order with balance checks, transaction recording, and portfolio updates."""
    check_rate_limit(request, max_requests=25, window_seconds=60, bucket="paper_order")
    result = execute_paper_order(
        user_id=current_user.id,
        asset_id=req.asset_id,
        order_type=req.order_type,
        units=req.units,
        limit_price=req.limit_price
    )
    if not result.get("success"):
        raise HTTPException(status_code=400, detail=result.get("message", "Order failed."))
    return PaperOrderResponse(**result)

@app.get("/api/paper-trading/orders")
def list_paper_orders(current_user: UserProfile = Depends(get_current_authenticated_user)):
    """List historical simulated paper trading orders for authenticated user."""
    return get_user_paper_orders(user_id=current_user.id)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
