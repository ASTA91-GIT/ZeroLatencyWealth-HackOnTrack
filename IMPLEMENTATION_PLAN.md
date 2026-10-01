# ZERO LATENCY WEALTH — Implementation Plan

> **"One Portfolio. Every Asset. Clearer Understanding."**
> **Hack on Track Round 1 — Problem Statement 2 (PS2)**
> **Repository:** [https://github.com/ASTA91-GIT/ZeroLatencyWealth-HackOnTrack](https://github.com/ASTA91-GIT/ZeroLatencyWealth-HackOnTrack)
> **Source of Truth:** Current Codebase Implementation

---

## Roadmap & Milestone Overview

```
Phase 1  ──► Phase 2  ──► Phase 3  ──► Phase 4  ──► Phase 5  ──► Phase 6
Repo & Arch    Backend Fdn     Auth      Portfolio      Dashboard    Holdings
  [COMPLETE]    [COMPLETE]   [COMPLETE]  [COMPLETE]    [COMPLETE]   [COMPLETE]
      │
      ▼
Phase 7  ──► Phase 8  ──► Phase 9  ──► Phase 10 ──► Phase 11 ──► Phase 12
 Explorer      Copilot      Insights      Import     Goals/Academy  UI Redesign
  [COMPLETE]    [COMPLETE]   [COMPLETE]  [COMPLETE]    [COMPLETE]   [COMPLETE]
      │
      ▼
Phase 13 ──► Phase 14
 Testing     Release & Docs
  [COMPLETE]    [COMPLETE]
```

---

## Phase 1 — Repository & Architecture
- **Objective:** Establish the clean monorepo architecture, environment definitions, version control rules, and system boundaries.
- **Tasks:**
  - Initialize root repository structure with separate `/frontend` and `/backend` directories.
  - Configure `.gitignore` to prevent tracking of `.env`, `node_modules`, `__pycache__`, and binary artifacts.
  - Author `.env.example` detailing configuration parameters.
  - Define full-stack pipeline architecture separating presentation, REST gateway, service layer, and persistence.
- **Relevant Files:**
  - `README.md`, `.gitignore`, `.env.example`, `frontend/package.json`
- **Dependencies:** Node.js v18+, Python 3.10+, Git
- **Verification:** Verified clean git tracking, directory structure, and environment templates.
- **Status:** **COMPLETE**

---

## Phase 2 — Backend Foundation
- **Objective:** Build the asynchronous FastAPI REST gateway, SQLite database schema, and Pydantic validation models.
- **Tasks:**
  - Initialize FastAPI application with CORS middleware for frontend communication.
  - Create SQLite schema (`backend/database.py`) across 6 tables: `users`, `assets`, `holdings`, `transactions`, `goals`, `portfolio_snapshots`.
  - Implement Pydantic v2 schemas (`backend/models.py`) with strict validation.
  - Seed canonical benchmark evaluation dataset (₹8,42,500 across 13 holdings).
- **Relevant Files:**
  - `backend/main.py`, `backend/database.py`, `backend/models.py`
- **Dependencies:** FastAPI, Uvicorn, Pydantic v2, SQLite3
- **Verification:** Lifespan database initialization tests pass; REST gateway serves `/docs` OpenAPI schema.
- **Status:** **COMPLETE**

---

## Phase 3 — Authentication & Demo Session Management
- **Objective:** Enable instant 1-click evaluation access without external identity providers, while supporting credentials auth.
- **Tasks:**
  - Implement `POST /api/auth/demo` issuing session tokens for pre-seeded user `demo-user-001`.
  - Implement `POST /api/auth/login` and `POST /api/auth/register` with SHA-256 password hashing.
  - Build frontend session manager in `AppContext.tsx` with toast confirmation.
- **Relevant Files:**
  - `backend/services/auth_service.py`, `backend/main.py`, `frontend/src/context/AppContext.tsx`, `frontend/src/views/AuthView.tsx`
- **Dependencies:** Phase 2
- **Verification:** Authenticated demo login loads canonical profile in < 10ms.
- **Status:** **COMPLETE**

---

## Phase 4 — Multi-Asset Portfolio Engine
- **Objective:** Develop quantitative calculation algorithms for total valuation, cost basis, unrealized P/L, and weighted cash flow yields.
- **Tasks:**
  - Calculate asset allocation percentages across Equities (52%), Bonds (18.1%), REITs (14.9%), InvITs (10.0%), and Cash (5.0%).
  - Calculate projected annual income from statutory distribution yields (~₹37,362 at 4.43%).
  - Implement atomic canonical benchmark reset via `POST /api/portfolio/reset`.
- **Relevant Files:**
  - `backend/services/portfolio_service.py`
- **Dependencies:** Phase 2, Phase 3
- **Verification:** Benchmark numbers verify precisely against formula outputs.
- **Status:** **COMPLETE**

---

## Phase 5 — Dashboard Financial Command Center
- **Objective:** Render high-frequency executive financial dashboard with responsive visual analytics.
- **Tasks:**
  - Build 5 KPI metric cards (Total Value, Annual Income, Active Assets, Custody Sources).
  - Implement interactive Recharts Donut Allocation chart with custom tooltips.
  - Implement 12-month historical mark-to-market performance Area chart.
  - Display multi-asset statutory return mechanism cards.
- **Relevant Files:**
  - `frontend/src/views/DashboardView.tsx`, `frontend/src/services/api.ts`
- **Dependencies:** Phase 4
- **Verification:** Dashboard displays all metrics and adapts dynamically to window resize.
- **Status:** **COMPLETE**

---

## Phase 6 — Unified Portfolio View & Asset Modals
- **Objective:** Provide a filterable, consolidated holding table unifying disparate brokerage positions.
- **Tasks:**
  - Render all 13 holdings with columns for units, buy price, live price, value, P/L, and yield.
  - Implement asset class pills (`ALL`, `EQUITY`, `BOND`, `REIT`, `INVIT`, `OTHER`) and custody source filters.
  - Create `AssetDetailModal.tsx` displaying underlying return drivers and direct Copilot launch trigger.
- **Relevant Files:**
  - `frontend/src/views/UnifiedPortfolioView.tsx`, `frontend/src/components/AssetDetailModal.tsx`
- **Dependencies:** Phase 4, Phase 5
- **Verification:** Table filters and searches instantly; modal displays complete statutory mechanics.
- **Status:** **COMPLETE**

---

## Phase 7 — Multi-Asset Awareness Explorer
- **Objective:** Demystify non-equity alternative asset classes through structured educational modules.
- **Tasks:**
  - Create 4-pillar interactive guide for Equities, Fixed Income Bonds, Commercial REITs, and Infrastructure InvITs.
  - Visual diagrams explaining contractual lease escalation and tariff cash flow pass-throughs.
  - Catalog registered instruments with liquidity ratings and risk classifications.
- **Relevant Files:**
  - `frontend/src/views/AssetExplorerView.tsx`
- **Dependencies:** Phase 6
- **Verification:** All 4 asset pillars render comprehensive return explanations and instrument catalogs.
- **Status:** **COMPLETE**

---

## Phase 8 — AI Copilot (Deterministic Knowledge Engine)
- **Objective:** Deploy an intelligent educational AI assistant with statutory guardrails requiring zero external API keys.
- **Tasks:**
  - Build `backend/services/copilot_service.py` with multi-asset knowledge trees and live holding context bindings.
  - Implement strict Anti-Advice guardrail intercepting buy/sell queries.
  - Create `CopilotDrawer.tsx` slide-out panel with pre-crafted prompt chips.
- **Relevant Files:**
  - `backend/services/copilot_service.py`, `frontend/src/components/CopilotDrawer.tsx`
- **Dependencies:** Phase 4, Phase 6
- **Verification:** 100% response success across REIT, InvIT, Bond, and allocation questions; advice queries intercepted.
- **Status:** **COMPLETE**

---

## Phase 9 — Portfolio Insights & Diagnostics
- **Objective:** Deliver automated algorithmic diagnostics, concentration alerts, and cash flow projections.
- **Tasks:**
  - Implement `GET /api/insights` computing equity risk exposure and fixed-income cushions.
  - Flag single-instrument concentration exceeding 20% of net worth.
  - Provide quarterly cash flow distribution projections.
- **Relevant Files:**
  - `backend/services/analytics_service.py`, `frontend/src/views/PortfolioInsightsView.tsx`
- **Dependencies:** Phase 4
- **Verification:** Insights render with risk metrics and quarterly cash flow timelines.
- **Status:** **COMPLETE**

---

## Phase 10 — Portfolio Ingestion & CSV Import
- **Objective:** Demonstrate multi-broker aggregation via simulated connectors and real CSV upload parsing.
- **Tasks:**
  - Implement `POST /api/import/demo` simulating ingestion from Broker A, Broker B, and Depository.
  - Build 5-step visual pipeline (`CONNECTING` $\rightarrow$ `FETCHING` $\rightarrow$ `NORMALIZING` $\rightarrow$ `CLASSIFYING` $\rightarrow$ `READY`).
  - Implement `POST /api/import/csv` parsing user-uploaded holding statements with column validation.
- **Relevant Files:**
  - `backend/services/import_service.py`, `frontend/src/views/PortfolioImportView.tsx`
- **Dependencies:** Phase 4
- **Verification:** Simulated sync and CSV file upload both successfully merge holdings into SQLite.
- **Status:** **COMPLETE**

---

## Phase 11 — Goals Engine & Learning Sandbox
- **Objective:** Connect cash flow awareness to real-world goal funding and interactive allocation experiments.
- **Tasks:**
  - Implement Goals CRUD (`/api/goals`) with life milestone progress tracking.
  - Build interactive allocation sandbox with dynamic sliders recalculating portfolio weighted yield.
  - Cross-asset comparison tables and FAQs on taxation and SEBI unitholder rights.
- **Relevant Files:**
  - `backend/services/goals_service.py`, `frontend/src/views/GoalsView.tsx`, `frontend/src/views/LearningCenterView.tsx`
- **Dependencies:** Phase 4, Phase 7
- **Verification:** Sliders dynamically recalculate yield; goals persist and compute funding gaps.
- **Status:** **COMPLETE**

---

## Phase 12 — Professional UI/UX Redesign (Purple + Neon Fintech)
- **Objective:** Overhaul visual identity into a human-designed, distinctive Purple/Neon fintech aesthetic with dual-theme system and WebGL graphics.
- **Tasks:**
  - Centralize design tokens in `frontend/src/index.css` (`:root` Light & `.dark` Dark modes).
  - Implement Three.js WebGL 3D financial network hero visual (`FinancialNetwork3D.tsx`) with mouse parallax, mobile scaling, and CSS fallback.
  - Redesign navigation bar with sun/moon theme switch, active view glow, and mobile drawer.
  - Redesign all 12 views: Landing Page, Dashboard, Portfolio, Explorer, Insights, Import, Goals, Academy, Architecture, Security, Settings, Auth.
  - Theme-adaptive Recharts Donut & Area visualizers adapting grid lines and fills.
- **Relevant Files:**
  - `frontend/src/index.css`, `frontend/src/components/FinancialNetwork3D.tsx`, `frontend/src/components/Navbar.tsx`, `frontend/src/views/*`
- **Dependencies:** All previous phases
- **Verification:** `vite build` passes in 695ms with zero errors; full theme persistence in `localStorage`.
- **Status:** **COMPLETE**

---

## Phase 13 — Testing & Verification
- **Objective:** Perform end-to-end verification across frontend compilation, backend API endpoints, theme transitions, and responsive viewports.
- **Tasks:**
  - Validate production bundle compilation via `vite build`.
  - Verify all 16 FastAPI endpoints return expected HTTP status and schemas.
  - Test theme persistence, WebGL fallback, and viewport responsiveness (390px to 1440px).
- **Relevant Files:**
  - `TESTING.md`, `backend/tests/`
- **Dependencies:** Phase 12
- **Verification:** All tests and smoke test workflows verified.
- **Status:** **COMPLETE**

---

## Phase 14 — Documentation & GitHub Release
- **Objective:** Document the complete architecture, application flows, implementation status, and testing criteria.
- **Tasks:**
  - Create `TRD.md`, `APP_FLOW.md`, `IMPLEMENTATION_PLAN.md`, `TESTING.md`.
  - Update `README.md` with links and current architecture details.
  - Push clean git commits to `main` branch on GitHub.
- **Relevant Files:**
  - `TRD.md`, `APP_FLOW.md`, `IMPLEMENTATION_PLAN.md`, `TESTING.md`, `README.md`
  - Dependencies: Phase 13
  - Verification: Git tracking clean; remote repository synchronized.
  - Status: COMPLETE

---

## Phase 15 — Production Authentication
- **Objective:** Upgrade authentication from prototype to production-grade security with Argon2id password hashing, JWT access tokens, refresh token rotation, user data isolation, and email verification.
- **Tasks:**
  - Implement Argon2id password hashing via `argon2-cffi` with legacy fallback support.
  - Add JWT access tokens and refresh tokens in `backend/services/auth_service.py`.
  - Implement endpoints: `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`, `POST /api/auth/refresh`, `POST /api/auth/forgot-password`, `POST /api/auth/reset-password`, `POST /api/auth/verify-email`.
  - Build modern Signup, Login, Forgot Password, Reset Password, and Verify Email views with password strength indicator, confirm password, and show/hide toggles.
  - Preserve 1-click Demo Mode authentication for hackathon evaluation (`POST /api/auth/demo`).
- **Relevant Files:** `backend/services/auth_service.py`, `backend/services/email_service.py`, `frontend/src/views/AuthView.tsx`, `backend/security.py`
- **Verification:** Automated tests verify Argon2id hashing, token validation, user isolation, and password reset.
- **Status:** COMPLETE

---

## Phase 16 — Public Market Experience
- **Objective:** Enable public exploration of markets, asset classes, and individual quotes without forcing users to log in immediately.
- **Tasks:**
  - Redesign landing page flow to provide open exploration with clear primary CTAs: "Explore Markets", "Explore Wealth OS", "Create Account", "Log In", and secondary "Try Demo".
  - Implement dedicated Public Market Explorer view at `/markets` (`MarketsView.tsx`).
  - Add Market Data Service abstraction (`backend/services/market_data_service.py`) supporting `DemoMarketDataProvider` and `RealMarketDataProvider` via `MARKET_DATA_PROVIDER=demo|real`.
  - Add market overview bar (NIFTY 50, SENSEX, Sovereign 10Y Yield, REIT/InvIT Index) and live status.
  - Display normalized quotes across Equities, Sovereign Bonds, REITs, and InvITs with search and category filters.
- **Relevant Files:** `backend/services/market_data_service.py`, `frontend/src/views/MarketsView.tsx`, `frontend/src/views/LandingPage.tsx`
- **Verification:** Public users can search and view quotes without authentication; action clicks prompt auth gracefully.
- **Status:** COMPLETE

---

## Phase 17 — PostgreSQL & Data Persistence
- **Objective:** Introduce full SQLAlchemy ORM abstraction supporting SQLite (development) and PostgreSQL (production) with Alembic migrations and tenant isolation.
- **Tasks:**
  - Define declarative SQLAlchemy models in `backend/db_models.py` (users, assets, holdings, transactions, goals, snapshots, refresh_tokens, watchlists, paper_accounts, paper_orders, audit_logs).
  - Update `backend/database.py` to support `DATABASE_URL` for PostgreSQL and SQLite.
  - Configure Alembic migrations (`alembic.ini`, `backend/alembic/env.py`, initial revision).
  - Create safe standalone demo seeding script `backend/seed_demo.py` callable via `python -m backend.seed_demo`.
  - Enforce strict user data isolation in all query services.
- **Relevant Files:** `backend/db_models.py`, `backend/database.py`, `backend/seed_demo.py`, `alembic.ini`, `backend/alembic/*`
- **Verification:** Alembic autogenerates initial schema; SQLite and PostgreSQL connections verified; seeding succeeds.
- **Status:** COMPLETE

---

## Phase 18 — Local AI / Ollama
- **Objective:** Power the intelligence layer exclusively with local Ollama LLMs with zero external hosted API token dependencies.
- **Tasks:**
  - Implement `backend/services/local_ai_service.py` communicating with local Ollama (`http://localhost:11434`).
  - Configure model via `OLLAMA_MODEL` (e.g. `llama3.1:8b`).
  - Add internal AI health check endpoint `GET /api/ai/health`.
  - Implement robust offline fallback hierarchy: (1) Local Ollama LLM -> (2) Deterministic knowledge engine -> (3) Clear offline status indicator. Never crash when Ollama is unavailable.
- **Relevant Files:** `backend/services/local_ai_service.py`, `backend/main.py`
- **Verification:** Local AI health endpoint returns connectivity status; offline fallback handles arbitrary questions.
- **Status:** COMPLETE

---

## Phase 19 — Conversational Copilot
- **Objective:** Upgrade Copilot from static prompts into an interactive, multi-turn conversational chatbot with portfolio awareness and financial guardrails.
- **Tasks:**
  - Support arbitrary user queries about assets, financial terminology, ratios, and portfolio breakdown.
  - Implement bounded conversational memory (`MAX_CHAT_MESSAGES=10`, `MAX_CONTEXT_TOKENS=2048`).
  - Inject safe authenticated user portfolio context (total value, asset allocation percentages, top holdings).
  - Enforce strict financial guardrails (educational only; no personalized buy/sell directives).
  - Upgrade Chat UI in `CopilotDrawer.tsx` with copy response, clear history, status indicator, and prompt chips.
- **Relevant Files:** `backend/services/local_ai_service.py`, `frontend/src/components/CopilotDrawer.tsx`
- **Verification:** Copilot answers questions with context; guardrail prompt prevents personalized buy/sell advice.
- **Status:** COMPLETE

---

## Phase 20 — Watchlist & Paper Trading
- **Objective:** Implement user-isolated watchlists and simulated paper trading to make the platform operational without real financial risk.
- **Tasks:**
  - Build Watchlist service (`backend/services/watchlist_service.py`) and endpoints (`/api/watchlist`).
  - Build Paper Trading service (`backend/services/paper_trading_service.py`) with initial ₹10,00,000 simulated cash balance.
  - Implement simulated Buy/Sell order execution with cash balance validation, holding updates, transaction records, and portfolio recalculation.
  - Create `PaperTradeModal.tsx` order ticket with live pricing and simulation warnings.
  - Create `WatchlistView.tsx` for watchlist inspection and paper order history.
- **Relevant Files:** `backend/services/watchlist_service.py`, `backend/services/paper_trading_service.py`, `frontend/src/views/WatchlistView.tsx`, `frontend/src/components/PaperTradeModal.tsx`
- **Verification:** Automated tests verify paper buy orders update cash balance, create holdings, and record transactions.
- **Status:** COMPLETE

---

## Phase 21 — Production Security
- **Objective:** Harden security posture across CORS, rate limiting, security headers, upload sanitization, and structured errors.
- **Tasks:**
  - Restrict CORS origins via `FRONTEND_URL` in production; avoid wildcard origins.
  - Implement sliding-window rate limiting on auth, chat, and paper trading endpoints in `backend/security.py`.
  - Add security headers middleware (`X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`).
  - Enforce CSV upload limits (5MB max size, column validation, 1,000 rows max, malformed row handling).
  - Standardize API error responses: `{ "success": false, "error": { "code": "...", "message": "..." } }`.
- **Relevant Files:** `backend/security.py`, `backend/main.py`, `backend/services/import_service.py`
- **Verification:** Rate limiters, header injection, and CSV validation verified via automated tests.
- **Status:** COMPLETE

---

## Phase 22 — Docker & Deployment
- **Objective:** Package the entire stack into production-ready containerized microservices.
- **Tasks:**
  - Create `backend/Dockerfile` with Python 3.11 slim, dependencies, and health checks.
  - Create `frontend/Dockerfile` with multi-stage Node build and Nginx Alpine static serving.
  - Create `frontend/nginx.conf` with SPA routing and `/api` reverse proxy.
  - Create `docker-compose.yml` orchestrating `frontend`, `backend`, `postgres`, and `ollama`.
  - Create `docker-compose.dev.yml` for local containerized development.
  - Update `.env.example` with all configuration variables and create `.dockerignore`.
- **Relevant Files:** `backend/Dockerfile`, `frontend/Dockerfile`, `frontend/nginx.conf`, `docker-compose.yml`, `docker-compose.dev.yml`, `.env.example`, `.dockerignore`
- **Verification:** Docker files linted and verified; compose configuration validated.
- **Status:** COMPLETE

---

## Phase 23 — Production Testing
- **Objective:** Run exhaustive automated testing across all platform components.
- **Tasks:**
  - Build comprehensive pytest suite in `tests/test_production_platform.py`.
  - Test system health check, local AI health, public markets discovery, demo mode auth, real user registration/login, user data isolation, watchlist persistence, paper trading execution, local AI copilot, and CSV upload.
  - Run frontend production compilation: `npm run build`.
- **Relevant Files:** `tests/test_production_platform.py`, `frontend/`
- **Verification:** All 9 automated backend test suites passed (100%); frontend bundle builds with zero errors.
- **Status:** COMPLETE

---

## Phase 24 — Production Release
- **Objective:** Finalize documentation, update TRD.md, APP_FLOW.md, TESTING.md, README.md, and commit to GitHub.
- **Tasks:**
  - Update `TRD.md` with production architecture specifications.
  - Update `APP_FLOW.md` with public visitor -> market explorer -> auth -> Wealth OS flow.
  - Update `TESTING.md` with test reports and verification steps.
  - Update `README.md` with deployment, Docker, Ollama setup, and environment variables.
  - Commit all changes cleanly to Git and push to `origin main`.
- **Relevant Files:** `TRD.md`, `APP_FLOW.md`, `TESTING.md`, `README.md`
- **Verification:** Clean git tree; all acceptance criteria satisfied.
- **Status:** COMPLETE

---

## Phase 25 — Real Market Data Foundation & Provider Abstraction
- **Objective:** Eliminate all mock/fake market data across the backend and implement an extensible `MarketDataProvider` abstraction.
- **Tasks:**
  - Implement `MarketDataProvider` protocol with canonical methods (`get_quote`, `get_quotes`, `get_historical_candles`, `get_market_depth`, `get_option_chain`, `get_fundamentals`, etc.).
  - Implement `RealMarketProvider` querying live exchange quotes, indices (NIFTY 50, SENSEX, BANK NIFTY), commodities (Gold, Silver, Crude), currencies (USD/INR), and real historical OHLCV data.
  - Build Angel One SmartAPI provider skeleton with secure server-side credential loading from environment variables.
  - Build NSE/BSE exchange session calendar engine (`market_session.py`) evaluating IST trading hours and holidays (09:15–15:30 IST).
  - Deploy high-speed TTL cache (`cache.py`) with Redis fallback.
- **Relevant Files:** `backend/market_data/provider.py`, `backend/market_data/providers/real_market_provider.py`, `backend/market_data/providers/angel_one.py`, `backend/market_data/market_session.py`, `backend/market_data/cache.py`
- **Verification:** Zero hardcoded prices in responses; verified against live market APIs.
- **Status:** COMPLETE

---

## Phase 26 — Live Markets Terminal & Real-Time Ticker
- **Objective:** Build `/markets` terminal view with real-time ticker tape, global indices, commodities, currencies, and symbol search.
- **Tasks:**
  - Build `MarketTickerTape.tsx` with animated price tick deltas (subtle green/red text pulse without flashing cards).
  - Build `MarketsView.tsx` with category filters (Equities, Indices, Commodities, Currencies, REITs, InvITs).
  - Implement real-time market breadth calculator (Advancers, Decliners, Unchanged).
  - Implement symbol search querying the verified instrument master.
- **Relevant Files:** `frontend/src/views/MarketsView.tsx`, `frontend/src/components/trading/MarketTickerTape.tsx`, `backend/main.py`
- **Verification:** Live quotes and indices stream through WebSocket and REST; zero fake data.
- **Status:** COMPLETE

---

## Phase 27 — TradingView Lightweight Charts & Technical Indicators
- **Objective:** Integrate TradingView Lightweight Charts v5 for professional financial charting with real historical candles and live tick updates.
- **Tasks:**
  - Build `LightweightChart.tsx` using `lightweight-charts` v5 (`addSeries(CandlestickSeries, ...)`).
  - Support multiple chart types: Candlestick, Line, Area, Bar, with volume histogram panel.
  - Support multi-timeframe intervals: 1m, 5m, 15m, 1h, 1D, 1W, 1M from real OHLCV data.
  - Build technical indicators service (`backend/market_data/services/indicators.py`) computing SMA, EMA, RSI, MACD, Bollinger Bands, and VWAP on real candle arrays.
  - Implement incremental active candle updates via WebSocket ticks (High/Low/Close/Volume updates in place).
- **Relevant Files:** `frontend/src/components/trading/LightweightChart.tsx`, `backend/market_data/services/indicators.py`, `frontend/src/views/InstrumentDetailView.tsx`
- **Verification:** Verified candlestick rendering and indicator overlay without chart reloading on new ticks.
- **Status:** COMPLETE

---

## Phase 28 — Watchlists & Dynamic Price Alerts Engine
- **Objective:** Deploy user-isolated watchlists with live WebSocket updates and a server-side price alerts engine.
- **Tasks:**
  - Build Alert engine (`backend/market_data/services/alerts.py`) supporting Above, Below, and % Move conditions with 30s cooldowns.
  - Expose `/api/alerts` CRUD endpoints.
  - Integrate live alerts manager into `WatchlistView.tsx` with threshold tracking.
- **Relevant Files:** `backend/market_data/services/alerts.py`, `frontend/src/views/WatchlistView.tsx`
- **Verification:** Alerts evaluate accurately against incoming quotes; duplicate alerts suppressed during cooldown.
- **Status:** COMPLETE

---

## Phase 29 — Multi-Asset Screener & Dynamic Heatmap
- **Objective:** Build an institutional screener (`/screener`) with real metrics, multi-criteria filtering, and market heatmap view.
- **Tasks:**
  - Build screener service (`backend/market_data/services/screener.py`) filtering by Price, % Change, Volume, Market Cap, P/E, and Sector.
  - Build `ScreenerView.tsx` with Table and Heatmap views.
  - Heatmap tile sizing reflects relative market capitalization; color intensity reflects verified percentage change.
- **Relevant Files:** `frontend/src/views/ScreenerView.tsx`, `backend/market_data/services/screener.py`
- **Verification:** Table filters cleanly and heatmap calculates accurate color gradients from real quotes.
- **Status:** COMPLETE

---

## Phase 30 — Real Company Fundamentals & Financial Statements
- **Objective:** Deliver verified equity fundamentals and live market news on instrument deep-dives.
- **Tasks:**
  - Build fundamentals ingestion (`get_fundamentals()`) extracting P/E, P/B, EPS, Market Cap, 52W High/Low, ROE, ROCE, and Financial Statements (Income, Balance Sheet, Cash Flow).
  - Ingest genuine market news with headlines, publishers, and timestamps.
  - Build transparent Level 2 depth disclaimer: *"Market depth unavailable for this instrument"* where broker L2 feeds are restricted.
- **Relevant Files:** `frontend/src/views/InstrumentDetailView.tsx`, `backend/market_data/providers/real_market_provider.py`
- **Verification:** Tested against real equities (e.g. RELIANCE, TCS, INFY); zero fake numbers.
- **Status:** COMPLETE

---

## Phase 31 — Options Chain & Derivatives Desk
- **Objective:** Provide a professional `/options` desk with calls, puts, and strikes.
- **Tasks:**
  - Create `OptionsView.tsx` with strike selector, calls/puts LTP, change, OI, and volume.
  - Transparently display regulatory disclaimer when broker derivatives feeds require dedicated exchange licensing.
- **Relevant Files:** `frontend/src/views/OptionsView.tsx`, `backend/market_data/models.py`
- **Verification:** Desk renders with clean ATM strike highlighting and licensing transparency.
- **Status:** COMPLETE

---

## Phase 32 — Real-Price Paper Trading & Dynamic Portfolio Valuation
- **Objective:** Wire paper trading execution to real exchange market prices and dynamically revalue portfolios.
- **Tasks:**
  - Update `paper_trading_service.py` to execute simulated buy/sell orders at current market quotes.
  - Portfolio unrealized P&L updates continuously as WebSocket ticks stream.
  - Preserve ₹10,00,000 virtual capital account with transaction auditing.
- **Relevant Files:** `backend/services/paper_trading_service.py`, `frontend/src/views/WatchlistView.tsx`
- **Verification:** Automated tests verify buy/sell orders at live prices update cash and P&L deterministically.
- **Status:** COMPLETE

---

## Phase 33 — AI Copilot Live Market Context Ingestion
- **Objective:** Ingest current real-time market snapshots into Copilot prompts.
- **Tasks:**
  - Update `local_ai_service.py` to retrieve live market overviews (NIFTY, Sensex, commodities, top movers) when users ask market questions.
  - Enforce factual grounding: distinguish between fact, calculation, and interpretation. Copilot clearly states when live data is unavailable.
- **Relevant Files:** `backend/services/local_ai_service.py`
- **Verification:** Copilot answers questions with accurate current market numbers.
- **Status:** COMPLETE

---

## Phase 34 — Terminal Experience, Connection Resilience & Dark-Only Enforcement
- **Objective:** Harden WebSocket connections, implement stale data indicators, and enforce permanent Dark Mode.
- **Tasks:**
  - Implement WebSocket client (`marketWebSocket.ts`) with exponential backoff reconnect, heartbeat, and stale-data timers.
  - Enforce permanent Dark Mode (`#09090B` background, `#18181B` cards, electric purple and emerald accents); remove all light mode toggles.
  - Verify complete end-to-end integration and run full automated test suite.
- **Relevant Files:** `frontend/src/services/marketWebSocket.ts`, `frontend/src/index.css`, `frontend/src/context/AppContext.tsx`, `tests/test_live_market_platform.py`
- **Verification:** 16/16 backend tests pass; frontend builds with 0 errors.
- **Status:** COMPLETE

