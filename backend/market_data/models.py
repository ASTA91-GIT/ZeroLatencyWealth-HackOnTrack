# Market Data Models for ZeroLatency Wealth
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from datetime import datetime

class Instrument(BaseModel):
    symbol: str
    name: str
    exchange: str = "NSE"
    asset_type: str = "EQUITY" # EQUITY, INDEX, ETF, COMMODITY, CURRENCY, REIT, INVIT
    sector: Optional[str] = None
    currency: str = "INR"
    tick_size: float = 0.05
    lot_size: int = 1
    is_active: bool = True

class MarketQuote(BaseModel):
    symbol: str
    name: Optional[str] = None
    exchange: str = "NSE"
    asset_type: str = "EQUITY"
    last_price: float
    open: float
    high: float
    low: float
    previous_close: float
    change: float
    change_percent: float
    volume: int = 0
    timestamp: str
    market_status: str = "CLOSED" # OPEN, CLOSED, PRE-MARKET, POST-MARKET
    source: str = "Real Market Data"
    is_stale: bool = False
    currency: str = "INR"
    day_52w_high: Optional[float] = None
    day_52w_low: Optional[float] = None

class Candle(BaseModel):
    time: int # Unix epoch timestamp in seconds
    open: float
    high: float
    low: float
    close: float
    volume: float = 0

class DepthLevel(BaseModel):
    price: float
    quantity: int
    orders: int = 1

class MarketDepth(BaseModel):
    symbol: str
    bids: List[DepthLevel] = []
    asks: List[DepthLevel] = []
    timestamp: str
    is_available: bool = False
    message: Optional[str] = None

class TechnicalIndicatorValue(BaseModel):
    name: str
    value: float
    signal: str = "NEUTRAL" # BULLISH, BEARISH, NEUTRAL

class MarketNewsItem(BaseModel):
    id: str
    headline: str
    source: str
    timestamp: str
    url: Optional[str] = None
    related_symbols: List[str] = []
    category: str = "Markets"
    summary: Optional[str] = None

class EconomicEvent(BaseModel):
    id: str
    event: str
    country: str
    time: str
    importance: str = "Medium" # High, Medium, Low
    previous: Optional[str] = None
    forecast: Optional[str] = None
    actual: Optional[str] = None

class CompanyFundamentals(BaseModel):
    symbol: str
    company_name: str
    sector: Optional[str] = None
    industry: Optional[str] = None
    market_cap: Optional[float] = None
    pe_ratio: Optional[float] = None
    pb_ratio: Optional[float] = None
    eps: Optional[float] = None
    roe: Optional[float] = None
    dividend_yield: Optional[float] = None
    debt_to_equity: Optional[float] = None
    profit_margin: Optional[float] = None
    revenue: Optional[float] = None
    net_income: Optional[float] = None
    week_52_high: Optional[float] = None
    week_52_low: Optional[float] = None
    website: Optional[str] = None
    description: Optional[str] = None
    is_available: bool = True

class OptionGreek(BaseModel):
    delta: Optional[float] = None
    gamma: Optional[float] = None
    theta: Optional[float] = None
    vega: Optional[float] = None
    iv: Optional[float] = None

class OptionLeg(BaseModel):
    ltp: Optional[float] = None
    change: Optional[float] = None
    volume: Optional[int] = None
    oi: Optional[int] = None
    oi_change: Optional[int] = None
    greeks: Optional[OptionGreek] = None

class OptionStrikeRow(BaseModel):
    strike: float
    call: Optional[OptionLeg] = None
    put: Optional[OptionLeg] = None

class OptionChainResponse(BaseModel):
    underlying: str
    underlying_price: Optional[float] = None
    expiry_dates: List[str] = []
    selected_expiry: Optional[str] = None
    strikes: List[OptionStrikeRow] = []
    is_available: bool = False
    message: Optional[str] = None
