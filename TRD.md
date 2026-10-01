# ZERO LATENCY WEALTH — Technical Requirements Document (TRD)

> **"One Platform. Every Market. Real Intelligence."**
> **Hack on Track Round 1 — Problem Statement 2 (PS2):** Super App for Unified Multi-Asset Investing & Awareness
> **Repository:** [https://github.com/ASTA91-GIT/ZeroLatencyWealth-HackOnTrack](https://github.com/ASTA91-GIT/ZeroLatencyWealth-HackOnTrack)
> **Version:** 3.0.0 (Live Real-Time Financial Market Intelligence & Terminal Architecture)
> **Status:** CURRENT SOURCE OF TRUTH (PRODUCTION-GRADE LIVE MARKET PLATFORM)

---

## 1. Product Overview & Vision
**ZeroLatency Wealth** has evolved from an educational portfolio prototype into a **unified real-time financial market intelligence and paper-trading terminal**, inspired by platforms like TradingView and Angel One. 

The platform delivers real-time market data across **Equities**, **Benchmark Indices**, **Commodities**, **Foreign Exchange Currencies**, **Commercial REITs**, and **Infrastructure InvITs**. It integrates dedicated **TradingView Lightweight Charts** with incremental live candle updates, an operable **Paper Trading Desk** executing strictly at current live market prices, a **Multi-Asset Screener** with real heatmaps, threshold-based **Price Alerts**, a **Macroeconomic Calendar**, **Real Financial News**, and an embedded **Local AI Copilot** aware of live exchange snapshots.

---

## 2. Absolute Data Rule & "No Fake Data" Policy

Strict architectural safeguards govern all market data across backend and frontend:
1. **NO FAKE PRICES:** Zero hardcoded market prices or randomized percentage changes.
2. **NO FAKE CANDLES:** All OHLCV candlestick series (1m, 5m, 15m, 1H, 1D, 1W, 1M) are computed from real historical exchange data.
3. **NO FAKE DEPTH OR OPTIONS:** Where Level 2 5-depth order books or option chains require private licensed broker subscriptions, the platform explicitly returns and displays:
   `"Market depth unavailable for this instrument."`
   `"Level 2 5-depth order book requires real exchange subscriber feed license."`
4. **PERMANENT DARK MODE:** The platform operates strictly in permanent dark mode (`#09090B`, `#121214`, `#18181B`, with violet `#8B5CF6`, emerald `#10B981`, and crimson `#EF4444` accents).
5. **SERVER-SIDE CREDENTIALS ONLY:** API keys, client codes, and broker tokens remain strictly on the backend. Frontend Vite environment variables never expose secrets.

---

## 3. System Architecture

```
EXTERNAL MARKET DATA PROVIDERS (NSE / BSE / Global / Angel One SmartAPI)
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

## 4. Market Data Provider Abstraction

The platform uses a pluggable `MarketDataProvider` abstract protocol:
- **`RealMarketDataProvider`:** Ingests live exchange quotes, historical OHLCV data, company fundamentals, and news via primary exchange pipes.
- **`AngelOneSmartApiProvider`:** Provider implementation supporting Angel One SmartAPI credentials (`ANGEL_API_KEY`, `ANGEL_CLIENT_CODE`, `ANGEL_PIN`, `ANGEL_TOTP_KEY`) with WebSocket streaming.
- **Provider Protocol Interface:**
  - `get_quote(symbol)`
  - `get_quotes(symbols)`
  - `get_historical_candles(symbol, interval, range_period)`
  - `get_market_depth(symbol)`
  - `get_indices()`
  - `get_commodities()`
  - `get_currencies()`
  - `get_market_movers()`
  - `get_market_breadth()`
  - `get_news(category)`
  - `get_economic_calendar()`
  - `get_company_fundamentals(symbol)`
  - `get_option_chain(symbol, expiry)`
  - `get_instruments(asset_type)`

---

## 5. WebSocket Streaming Engine (`/api/ws/markets`)

- **Connection Management:** Automatic reconnection with exponential backoff (1s to 15s) and stale data detection (20s heartbeat timeout).
- **Subscription Model:** Clients subscribe to discrete symbols (e.g., `["RELIANCE", "NIFTY", "GOLD"]`) or `"ALL"`.
- **Payload Schema:**
  ```json
  {
    "type": "TICK",
    "symbol": "RELIANCE",
    "data": {
      "symbol": "RELIANCE",
      "last_price": 1284.50,
      "change": 14.20,
      "change_percent": 1.12,
      "open": 1270.00,
      "high": 1288.00,
      "low": 1268.50,
      "volume": 8452100,
      "timestamp": "2026-10-01T15:30:00Z"
    }
  }
  ```

---

## 6. TradingView Lightweight Charts Integration

- **Library:** TradingView Lightweight Charts v5 (`lightweight-charts`).
- **Series Supported:** Candlestick, Line, Area, Bar, and Volume histogram.
- **Real-Time Incremental Updates:** Active candle updates open, high, low, close, and volume tick-by-tick from WebSocket ticks without re-rendering the historical canvas.
- **Indicators:** SMA 20, EMA 50, Bollinger Bands, and Volume overlay computed directly from real candle prices.

---

## 7. Multi-Asset Screener (`/screener`)
- **Filters:** Asset Class, Min/Max Price, Min/Max % Change, Min Volume, Sector.
- **Table Mode:** Live quotes, LTP, day change, volume, 52-week range, and quick action shortcuts.
- **Heatmap Mode:** Dynamic cell sizing and color intensity reflecting real percentage change and volume.

---

## 8. Real-Price Paper Trading Desk
- **Simulation Balance:** ₹10,00,000 virtual cash capital per authenticated account.
- **Order Execution:** Orders execute strictly at current live exchange prices (BUY/SELL).
- **Live Revaluation:** Holdings equity and unrealized P&L recalculate dynamically on every incoming market tick.
- **Audit Logging:** Order ID, timestamp, fill price, units, and status recorded in SQLite / PostgreSQL.

---

## 9. Verification & Automated Test Coverage
All 16 test vectors pass with 100% success rate:
- `tests/test_production_platform.py`: 9 Passed (Auth, Isolation, Watchlist, Paper Trading, Local AI, CSV validation)
- `tests/test_live_market_platform.py`: 7 Passed (Quotes, Candles, Session Status, Explicit Depth/Options disclaimers, Indicators, Alerts)
