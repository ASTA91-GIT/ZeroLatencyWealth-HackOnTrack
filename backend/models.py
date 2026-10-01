from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str

class UserProfile(BaseModel):
    id: str
    name: str
    email: str
    is_demo: bool
    created_at: Optional[str] = None

class AuthResponse(BaseModel):
    token: str
    user: UserProfile
    message: str

class AssetModel(BaseModel):
    id: str
    symbol: str
    name: str
    asset_type: str  # EQUITY, BOND, REIT, INVIT, OTHER
    category: Optional[str] = None
    sector: Optional[str] = None
    description: Optional[str] = None
    risk_level: Optional[str] = None
    annual_yield: float = 0.0
    liquidity_score: Optional[str] = None
    price: float
    change_24h: float = 0.0

class HoldingModel(BaseModel):
    id: str
    user_id: str
    asset_id: str
    symbol: str
    name: str
    asset_type: str
    sector: Optional[str] = None
    source: str
    units: float
    avg_buy_price: float
    current_price: float
    invested_value: float
    current_value: float
    unrealized_pl: float
    unrealized_pl_percent: float
    allocation_percent: float
    annual_yield: float = 0.0
    risk_level: Optional[str] = None

class AllocationBreakdown(BaseModel):
    asset_type: str
    current_value: float
    invested_value: float
    percentage: float
    unrealized_pl: float
    unrealized_pl_percent: float
    asset_count: int

class SourceBreakdown(BaseModel):
    source: str
    current_value: float
    percentage: float
    asset_count: int

class PortfolioSummary(BaseModel):
    total_value: float
    total_invested: float
    unrealized_pl: float
    unrealized_pl_percent: float
    day_change_amount: float
    day_change_percent: float
    total_assets: int
    projected_annual_income: float
    weighted_yield: float
    allocations: List[AllocationBreakdown]
    sources: List[SourceBreakdown]
    last_updated: str
    is_demo: bool = True

class GoalModel(BaseModel):
    id: str
    user_id: str
    title: str
    category: str
    target_amount: float
    current_amount: float
    progress_percent: float
    time_period: str
    icon: str
    created_at: Optional[str] = None

class GoalCreate(BaseModel):
    title: str
    category: str
    target_amount: float
    current_amount: float
    time_period: str
    icon: Optional[str] = "target"

class GoalUpdate(BaseModel):
    title: Optional[str] = None
    target_amount: Optional[float] = None
    current_amount: Optional[float] = None
    time_period: Optional[str] = None

class ChatRequest(BaseModel):
    message: str
    context_asset_id: Optional[str] = None
    conversation_history: Optional[List[Dict[str, str]]] = None

class ChatResponse(BaseModel):
    reply: str
    suggested_questions: List[str]
    context_data: Optional[Dict[str, Any]] = None
    source: str = "ZeroLatency Copilot (Deterministic Engine)"
    disclaimer: str = "SIMULATION / DEMO DATA — Educational information only. Not financial advice or investment solicitation."

class SimulatedImportRequest(BaseModel):
    source_name: str # "Broker A", "Broker B", "Depository"
    account_identifier: Optional[str] = "DEMO-ACC-9921"

class ImportResponse(BaseModel):
    status: str
    imported_count: int
    source: str
    message: str
    holdings_added: List[Dict[str, Any]]

class HistoricalDataPoint(BaseModel):
    date: str
    total_value: float
    invested_value: float
    equity_val: float
    bond_val: float
    reit_val: float
    invit_val: float
    other_val: float

class PortfolioInsightsResponse(BaseModel):
    summary: Dict[str, Any]
    observations: List[Dict[str, str]]
    risk_assessment: Dict[str, Any]
    income_projections: Dict[str, Any]
    concentration_flags: List[Dict[str, Any]]
    historical_trend: List[HistoricalDataPoint]
