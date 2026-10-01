# ZERO LATENCY WEALTH — LIVE REAL-TIME MARKET PLATFORM & TERMINAL
> **"One Platform. Every Market. Real Intelligence."**
>
> **Hack on Track Round 1 — Problem Statement 2 (PS2):** Super App for Unified Multi-Asset Investing & Awareness
> **Team Name:** ZERO LATENCY
> **Product Name:** ZERO LATENCY WEALTH
> **Repository:** [https://github.com/ASTA91-GIT/ZeroLatencyWealth-HackOnTrack](https://github.com/ASTA91-GIT/ZeroLatencyWealth-HackOnTrack)
> **Status:** Production-Grade Real-Time Market Intelligence & Paper Trading Platform

---

## 📚 Technical Documentation Directory

- [Technical Requirements Document (TRD.md)](./TRD.md) — Real-time Market Data Layer, Provider Abstraction, WebSocket Architecture, Database Entities, and Calculations.
- [Application Flow (APP_FLOW.md)](./APP_FLOW.md) — Live Ticker Tape, Multi-Asset Screener, TradingView Charts, Order Simulation, and Copilot Integration.
- [Implementation Plan (IMPLEMENTATION_PLAN.md)](./IMPLEMENTATION_PLAN.md) — Detailed 10-Phase implementation roadmap from Market Data Foundation to Advanced Terminal.
- [Testing & Verification (TESTING.md)](./TESTING.md) — Automated verification report covering all 16 test vectors, WebSocket connection, and production frontend build.

---

## ⚡ Absolute Data Rule & "No Fake Data" Policy

ZeroLatency Wealth is built from the ground up on an uncompromising foundation of real financial data:

1. **NO FAKE PRICES:** Zero hardcoded quotes, randomized percentage changes, or simulated price fluctuations.
2. **NO FAKE OHLCV CANDLES:** All candlestick bars (1m, 5m, 15m, 1H, 1D, 1W, 1M) originate from genuine exchange feeds.
3. **NO FAKE ORDER BOOK OR DEPTH:** Level 2 market depth and options chains require authorized exchange subscriber credentials. Where public broadcast feeds do not carry Level 2 depth, the platform displays an explicit and clean:
   ```
   "Market depth unavailable for this instrument."
   "Level 2 5-depth order book requires real exchange subscriber feed license."
   ```
4. **NO DEMO MODE BYPASS:** Paper trading uses an operable virtual desk (₹10,00,000 cash) executing strictly at current live exchange prices.
5. **PERMANENT DARK TERMINAL:** Designed exclusively in a high-contrast dark palette (`#09090B`, `#121214`, violet `#8B5CF6`, emerald `#10B981`, and crimson `#EF4444`) with no light mode switches or appearance toggles.

---

## 🏛️ Real-Time Market Architecture

```
EXTERNAL MARKET DATA PROVIDERS (NSE / BSE / Global Feeds / Angel One SmartAPI)
                         │
                         ▼
        MARKET DATA INGESTION & NORMALIZATION SERVICE
      (Standardized schema: symbol, LTP, OHLC, volume, status)
                         │
                         ▼
             HIGH-PERFORMANCE CACHE / REDIS
      (3s quote TTL, 30s candle cache, stale data detection)
                         │
        ┌────────────────┴────────────────┐
        ▼                                 ▼
FASTAPI REST API ENDPOINTS       WEBSOCKET TICK STREAMER (/api/ws/markets)
(History, Screener, Alerts)      (Real-time price ticks to subscribed clients)
        │                                 │
        └────────────────┬────────────────┘
                         ▼
      REACT FRONTEND & TRADINGVIEW LIGHTWEIGHT CHARTS
(Tick animation, incremental candle updates, multi-asset views)
```

---

## 🚀 Core Features & Terminal Modules

### 1. Live Market Status & Ticker Tape
- **Exchange Session Detection:** Accurately distinguishes between `OPEN`, `CLOSED`, `PRE-MARKET`, `POST-MARKET`, `WEEKEND`, and `HOLIDAY` based on Indian Standard Time (IST 09:15–15:30) and exchange calendars.
- **Real-Time Ticker:** High-frequency WebSocket ticks for NIFTY 50, BSE SENSEX, BANK NIFTY, NIFTY IT, S&P 500, NASDAQ, Gold, Silver, Crude Oil, Natural Gas, and USD/INR.
- **Subtle Number Flash:** When prices tick up or down, numbers animate subtly without jarring full-card flashes.

### 2. Professional TradingView Financial Charts
- **TradingView Lightweight Charts v5:** Integrated directly into instrument detail pages.
- **Chart Types:** Candlestick, Line, Area, and Bar charts.
- **Incremental Live Candle Updates:** Active candle updates open, high, low, close, and volume tick-by-tick over WebSocket without reloading the chart.
- **Timeframe Shortcuts:** 1m, 5m, 15m, 1H, 1D, 1W, 1M intervals.
- **Technical Indicators Overlay:** SMA 20, EMA 50, Bollinger Bands, and Volume histogram computed mathematically on real historical candles.

### 3. Multi-Asset Screener (`/screener`)
- **Filters:** Asset Class (Equities, Indices, Commodities, Currencies, REITs, InvITs), Min/Max Price, Min/Max % Change, and Min Volume.
- **Dual Display:**
  - **Table View:** Real quotes, LTP, day change, volume, 52-week range, and quick action buttons.
  - **Heatmap View:** Color intensity represents real percentage change, and cell dimensions reflect real volume/market cap.

### 4. Real-Time Price Alerts
- **Threshold Triggers:** Set alerts for prices crossing `ABOVE` or `BELOW` defined target levels.
- **Cooldown Suppression:** 30-second cooldown prevents repeated notifications on volatile ticks.
- **Management:** View monitoring status and delete alerts from the Watchlist desk.

### 5. Paper Trading Simulator (`/papertrading`)
- **Realistic Execution:** Orders execute at current real-time market prices.
- **Live Portfolio Revaluation:** P&L dynamically updates as incoming WebSocket ticks change holding valuations.
- **Order Audit Trail:** Complete execution history logging units, fill price, order type (BUY/SELL), and transaction timestamps.

### 6. Macroeconomic Calendar & News (`/calendar`, `/markets/news`)
- **Economic Calendar:** Real prints for GDP, CPI Inflation, Interest Rate decisions, and PMI indices with importance tags (High, Medium, Low).
- **Financial News:** Real headlines and dispatches categorized by Equities, Economy, and Commodities.

### 7. AI Copilot with Real Market Context
- **Live Context Ingestion:** When asked *"What is happening in the market?"* or *"What is happening with NIFTY?"*, the Copilot queries the real-time market provider and responds with current exchange quotes and top movers.
- **Objective Financial Education:** Clarifies valuation ratios (P/E, P/B, Dividend Yield), asset mechanics (REITs vs InvITs), and technical indicators without providing speculative buy/sell tips.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite 8, TailwindCSS v4, TradingView Lightweight Charts v5, Lucide Icons |
| **Backend** | Python 3.14, FastAPI, Uvicorn, WebSockets, AnyIO, Pydantic v2 |
| **Market Data** | Exchange data ingestion via `yfinance`, Angel One SmartAPI provider skeleton, in-memory TTL & Redis cache |
| **Database** | SQLite (development) / PostgreSQL (production) with SQLAlchemy ORM and Alembic migrations |
| **Authentication** | Memory-hard Argon2id password hashing, Stateless JWT with rotating refresh tokens |
| **AI Engine** | Local Ollama LLM (`llama3.1:8b`) with high-speed deterministic fallback |

---

## 🏁 Quickstart Guide

### 1. Prerequisites
- Python 3.11+ (Tested on Python 3.14)
- Node.js 18+ (Tested on Node.js 24)
- Ollama (Optional, for local AI LLM acceleration)

### 2. Backend Setup
```bash
# Clone the repository
git clone https://github.com/ASTA91-GIT/ZeroLatencyWealth-HackOnTrack.git
cd ZeroLatencyWealth-HackOnTrack

# Install Python dependencies
pip install -r requirements.txt

# Launch FastAPI backend with market streaming worker
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies (includes lightweight-charts)
npm install

# Start Vite development server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Verification & Testing Suite

Execute the automated test suite covering all 16 platform requirements:
```bash
python -m pytest tests/test_production_platform.py tests/test_live_market_platform.py
```

### Test Suite Results:
- `tests/test_production_platform.py` — **9 Passed**
  - Health checks, user registration, JWT authentication, tenant isolation, watchlist CRUD, paper trading execution, local AI chat, CSV import validation.
- `tests/test_live_market_platform.py` — **7 Passed**
  - Real exchange quote normalization, OHLCV candles, market session status, Level 2 depth unavailable disclaimer, options unavailable disclaimer, technical indicators (SMA/EMA/RSI), and price alerts lifecycle.

**Overall: 16 Passed, 0 Failed (100% Pass Rate).**

---

## ⚙️ Environment Variables Reference (`.env.example`)

```ini
# Environment
APP_ENV=development
FRONTEND_URL=http://localhost:5173

# Database
DATABASE_URL=sqlite:///./backend/zerolatency.db

# Authentication Secrets
JWT_SECRET=replace-with-a-secure-random-secret-key-in-production-64char
ACCESS_TOKEN_EXPIRE_MINUTES=60
REFRESH_TOKEN_EXPIRE_DAYS=7

# Market Data Provider
MARKET_DATA_PROVIDER=real
ANGEL_API_KEY=your_smartapi_key_placeholder
ANGEL_CLIENT_CODE=your_client_code_placeholder
ANGEL_PIN=your_mpin_placeholder
ANGEL_TOTP_KEY=your_totp_secret_placeholder

# Optional High-Performance Cache
REDIS_URL=redis://localhost:6379/0

# Paper Trading
PAPER_TRADING_ENABLED=true
```

---

## 🏆 Hackathon Project Information
- **Event:** Hack on Track Round 1
- **Problem Statement:** PS2 — Super App for Unified Multi-Asset Investing & Awareness
- **Team Name:** ZERO LATENCY
- **Product:** ZERO LATENCY WEALTH
- **Repository:** [https://github.com/ASTA91-GIT/ZeroLatencyWealth-HackOnTrack](https://github.com/ASTA91-GIT/ZeroLatencyWealth-HackOnTrack)
