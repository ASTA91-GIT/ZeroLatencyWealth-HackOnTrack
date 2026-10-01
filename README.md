# ZERO LATENCY WEALTH — PRODUCTION FINTECH WEB PLATFORM
> **"One Portfolio. Every Asset. Clearer Understanding."**
>
> **Hack on Track Round 1 — Problem Statement 2 (PS2):** Super App for Unified Multi-Asset Investing & Awareness
> **Team Name:** ZERO LATENCY
> **Product Name:** ZERO LATENCY WEALTH
> **Repository:** [https://github.com/ASTA91-GIT/ZeroLatencyWealth-HackOnTrack](https://github.com/ASTA91-GIT/ZeroLatencyWealth-HackOnTrack)
> **Status:** Production Transformed, Dockerized, and Fully Operable

---

## 📚 Engineering Documentation

Comprehensive technical documentation matching the live codebase is available in the repository root:

- [Technical Requirements Document (TRD.md)](./TRD.md) — Production architecture, 12 database entities, APIs, and calculations.
- [Application Flow (APP_FLOW.md)](./APP_FLOW.md) — Public visitor discovery, unauthenticated market exploration, authentication, and Wealth OS.
- [Implementation Plan (IMPLEMENTATION_PLAN.md)](./IMPLEMENTATION_PLAN.md) — 24 completed implementation phases (Phases 1–14 baseline + Phases 15–24 production transformation).
- [Testing & Verification (TESTING.md)](./TESTING.md) — Complete test reports across all 37 FastAPI endpoints, 9 automated test vectors, and production build checks.

---

## ⚠️ Mandatory Financial & Simulation Notice
> **"All financial data displayed in this platform is for educational and simulation purposes and is not financial advice."**
> ZeroLatency Wealth features an operable **Paper Trading / Simulated Investment Desk** (with ₹10,00,000 virtual cash balance) and an unauthenticated **Market Explorer**. It does not connect to real brokerage accounts or execute actual real-money financial transactions, nor does it provide personalized investment advice or speculative buy/sell recommendations.

---

## 📌 Core Product Direction: Public Discovery → Authenticated Wealth OS

Unlike hackathon prototypes that force an immediate login wall, ZeroLatency Wealth behaves like a modern fintech platform:

```
                          PUBLIC VISITOR
                                 │
                ┌────────────────┴────────────────┐
                ▼                                 ▼
      Explore Public Landing             Explore Live Markets
   (Branding, 4 Pillars, 3D WebGL)    (/markets, Tickers, Quotes)
                │                                 │
                └────────────────┬────────────────┘
                                 │
                 User selects protected action:
            "Add to Watchlist" / "Paper Trade" / "Open Wealth OS"
                                 │
                                 ▼
                  ┌───────────────────────────────┐
                  │ Create your free account      │
                  │ to continue                   │
                  │ [ Sign Up ] [ Log In ]        │
                  │ (or Try Demo for evaluation)  │
                  └──────────────┬────────────────┘
                                 │
                                 ▼
                      AUTHENTICATED WEALTH OS
                                 │
      ┌──────────────────────────┼──────────────────────────┐
      ▼                          ▼                          ▼
Personal Dashboard       Personal Watchlists       Paper Trading Desk
(Holdings & Insights)   (Live Price Tracking)   (Simulated Order Ticket)
      │                          │                          │
      └──────────────────────────┼──────────────────────────┘
                                 ▼
                     LOCAL AI COPILOT (OLLAMA)
                (Conversational Assistant with
                 Contextual Portfolio Memory)
```

---

## ⚡ Canonical Benchmark Demo Mode (Preserved for Hackathon Judges)

To ensure zero friction for hackathon evaluators, the **Hackathon Demo Mode** remains permanently accessible via 1 click:
- Evaluator clicks **"Try Demo"** on the navbar, landing hero, or auth gatekeeper modal.
- Automatically authenticates as `demo-user-001` with the canonical **₹8,42,500** benchmark portfolio.
- Clearly tagged with a glowing neon **`DEMO MODE`** badge in the navbar.
- Demo data is strictly isolated and can be restored at any time via **"Reset Demo Data"**.

### Canonical Benchmark Specs
- **Total Portfolio Value:** ₹8,42,500
- **Invested Capital Basis:** ₹7,95,000
- **Unrealized Gain / P/L:** +₹47,500 (+5.97%)
- **Projected Annual Income:** ₹37,362 (4.43% weighted yield)
- **13 Holdings Across 4 Asset Pillars:**
  - **Equities (52.0%):** Nifty 50 ETF, TCS, HDFC Bank, Reliance Industries
  - **Bonds (18.1%):** 7.18% GS 2033 Sovereign Bond, NABARD AAA Infra Bond, L&T Finance Debenture
  - **REITs (14.9%):** Embassy Office Parks REIT, Mindspace Business Parks, Brookfield India Real Estate Trust
  - **InvITs (10.0%):** PowerGrid InvIT (PGInvIT), IRB InvIT Fund
  - **Liquid Cash (5.0%):** LiquidBeES overnight fund

---

## 🤖 Local AI Chatbot (Ollama) — No External AI API Dependencies

ZeroLatency Wealth features a genuine conversational assistant powered exclusively by a **Local LLM via Ollama**:
- **NO Cloud AI Dependencies:** Zero external API tokens required (no OpenAI, Gemini, Claude, or Hugging Face cloud dependencies).
- **Configurable Model:** Configured via `OLLAMA_MODEL` (e.g., `llama3.1:8b`, `mistral`, `gemma2`).
- **Conversational Memory:** Maintains a bounded multi-turn conversation context history.
- **Portfolio-Aware Reasoning:** Injects the authenticated user's portfolio value, asset allocation, and top holdings safely into system prompts.
- **Regulatory Anti-Advice Guardrails:** Blocks direct buy/sell tips or speculative stock recommendations, redirecting users to educational analysis.
- **Resilient Fallback Hierarchy:** If Ollama is offline or uninstalled on the evaluator's machine, the backend **never crashes**; it gracefully transitions to the comprehensive deterministic financial knowledge engine with an informative offline status badge.

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** React 19 + TypeScript 5.9
- **Tooling:** Vite 8.3 (Ultra-fast build & HMR)
- **Styling:** Vanilla CSS design tokens + Tailwind CSS v4 (Purple + Neon Fintech Design System)
- **3D Graphics:** Three.js (WebGL financial network lattice with mouse parallax dynamics)
- **Data Visualizations:** Recharts (Theme-adaptive Donut & Performance Area Charts)
- **Icons:** Lucide React

### Backend
- **Framework:** Python 3.10+ (FastAPI 0.141)
- **Production Server:** Uvicorn ASGI (Development) / Gunicorn + Uvicorn Workers (Production)
- **Database & ORM:** SQLAlchemy 2.0+ ORM with Alembic schema migrations
- **Databases Supported:** SQLite (rapid local dev) & PostgreSQL (production container/cloud)
- **Authentication:** Argon2id cryptographic password hashing (`argon2-cffi`), JWT access & refresh tokens
- **Local AI Engine:** Self-hosted Ollama HTTP API client (`httpx`)
- **Security:** Sliding-window rate limiter, security headers middleware, strict CORS origins, 5MB file upload guards

---

## 📁 Repository Structure

```
ZeroLatencyWealth-HackOnTrack/
├── backend/
│   ├── alembic/                    # Alembic migration revisions & environment
│   │   ├── versions/
│   │   │   └── 5a30a6feb8dd_initial_production_schema.py
│   │   └── env.py
│   ├── services/
│   │   ├── auth_service.py         # Argon2id, JWT, refresh tokens, password reset
│   │   ├── market_data_service.py  # MarketDataProvider (demo vs real)
│   │   ├── local_ai_service.py     # Local Ollama client & conversational engine
│   │   ├── paper_trading_service.py# Virtual order ticket & cash ledger
│   │   ├── watchlist_service.py    # Multi-tenant watchlists CRUD
│   │   ├── email_service.py        # SMTP email service with dev outbox fallback
│   │   ├── portfolio_service.py    # Summary, holdings query, and reset handlers
│   │   ├── analytics_service.py    # Multi-asset insights, income forecast & risk scoring
│   │   ├── import_service.py       # 5MB validated CSV statement parser
│   │   └── goals_service.py        # Goal milestones CRUD
│   ├── database.py                 # Dual engine setup (SQLite / PostgreSQL)
│   ├── db_models.py                # 12 SQLAlchemy ORM models
│   ├── models.py                   # Pydantic request & response schemas
│   ├── security.py                 # Rate limiting, security headers, auth dependency
│   ├── seed_demo.py                # Safe production demo seeder
│   ├── main.py                     # FastAPI app with 37 REST API endpoints
│   ├── requirements.txt            # Python dependencies
│   └── Dockerfile                  # Backend production Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FinancialNetwork3D.tsx # Interactive Three.js WebGL hero animation
│   │   │   ├── Logo.tsx            # ZL monogram brand mark
│   │   │   ├── Navbar.tsx          # Dynamic public vs auth navigation
│   │   │   ├── AuthPromptModal.tsx # Non-blocking gatekeeper auth modal
│   │   │   ├── PaperTradeModal.tsx # Simulated order ticket modal
│   │   │   ├── AssetDetailModal.tsx# Multi-Asset deep dive modal
│   │   │   ├── CopilotDrawer.tsx   # Ollama conversational AI drawer
│   │   │   └── ToastContainer.tsx  # User feedback alerts
│   │   ├── context/
│   │   │   └── AppContext.tsx      # Global state, auth, watchlist, paper trading
│   │   ├── services/
│   │   │   └── api.ts              # Typed API client with Bearer tokens
│   │   ├── types/
│   │   │   └── index.ts            # TypeScript interfaces
│   │   ├── views/
│   │   │   ├── LandingPage.tsx     # Public landing page with market preview
│   │   │   ├── MarketsView.tsx     # Public stock & asset explorer (/markets)
│   │   │   ├── WatchlistView.tsx   # Personal watchlist & order history desk
│   │   │   ├── DashboardView.tsx   # Authenticated financial command center
│   │   │   ├── UnifiedPortfolioView.tsx # Filterable multi-asset holdings table
│   │   │   ├── AssetExplorerView.tsx    # Beginner-friendly asset guides
│   │   │   ├── PortfolioInsightsView.tsx# AI observations & cash flows
│   │   │   ├── GoalsView.tsx       # Financial milestone progress bars
│   │   │   ├── LearningCenterView.tsx   # Academy & allocation sandbox
│   │   │   ├── PortfolioImportView.tsx  # 5MB CSV statement upload
│   │   │   ├── SecurityPrivacyView.tsx  # Security safeguards
│   │   │   ├── ArchitectureView.tsx     # Full-stack architecture explorer
│   │   │   ├── SettingsView.tsx    # Profile & data management
│   │   │   └── AuthView.tsx        # Login, Signup, Forgot/Reset Password
│   │   ├── App.tsx                 # Root layout & view router
│   │   ├── main.tsx                # React entrypoint
│   │   └── index.css               # Design system & purple fintech styling
│   ├── nginx.conf                  # Nginx production reverse proxy config
│   ├── package.json
│   └── Dockerfile                  # Multi-stage production frontend Dockerfile
├── tests/
│   └── test_production_platform.py # 9/9 automated end-to-end regression tests
├── alembic.ini                     # Database migration configuration
├── docker-compose.yml              # Production Docker Compose (FE + BE + PG + Ollama)
├── docker-compose.dev.yml          # Development Docker Compose
├── .env.example                    # Environment variable template
├── TRD.md                          # Technical Requirements Document
├── APP_FLOW.md                     # Application Flow Document
├── IMPLEMENTATION_PLAN.md          # 24-Phase Implementation Plan
├── TESTING.md                      # Testing & Verification Report
└── README.md                       # Complete platform documentation
```

---

## 🚀 Setup & Local Development

### 1. Prerequisites
- **Node.js** v18+ and **npm** v9+
- **Python** 3.10+ (with `pip`)
- **Ollama** *(Optional, for local AI)*: [https://ollama.com](https://ollama.com)

### 2. Clone the Repository
```bash
git clone https://github.com/ASTA91-GIT/ZeroLatencyWealth-HackOnTrack.git
cd ZeroLatencyWealth-HackOnTrack
```

### 3. Environment Configuration
Copy the template configuration file:
```bash
cp .env.example .env
```
*(Default values work out-of-the-box for local development with SQLite and mock email logger).*

### 4. Backend Setup & Startup
Install Python dependencies and run database migrations:
```bash
# Install dependencies
pip install -r backend/requirements.txt

# Run database schema migrations
python -m alembic upgrade head

# Seed demo benchmark data safely
python -m backend.seed_demo

# Start the FastAPI backend server
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```
- API Gateway: `http://127.0.0.1:8000`
- Interactive OpenAPI Docs: `http://127.0.0.1:8000/docs`
- Health Check: `http://127.0.0.1:8000/api/health`

### 5. Frontend Setup & Startup
In a separate terminal window:
```bash
cd frontend
npm install
npm run dev
```
- Frontend live at: `http://127.0.0.1:5173`

---

## 🦙 Local Ollama AI Setup Guide

To run the local conversational assistant on your workstation:

1. **Install Ollama:** Download and install from [ollama.com](https://ollama.com).
2. **Start Ollama Service:**
   ```bash
   ollama serve
   ```
3. **Pull Configured Model:**
   ```bash
   ollama pull llama3.1:8b
   ```
   *(Or pull a lighter model such as `ollama pull mistral` or `ollama pull gemma2:2b` depending on available RAM/VRAM).*
4. **Configure `.env`:**
   ```ini
   OLLAMA_BASE_URL=http://localhost:11434
   OLLAMA_MODEL=llama3.1:8b
   ```
5. **Verify AI Health:**
   Check `http://localhost:8000/api/ai/health`. When Ollama is running, the top-right AI drawer will display `LOCAL AI ONLINE`. If Ollama is not running, the application gracefully switches to the deterministic knowledge engine without crashing.

---

## 🐳 Docker Deployment

The platform provides dual multi-container Docker Compose environments:

### Option A: Production Multi-Container Stack (Frontend + Backend + PostgreSQL + Ollama)
```bash
# Start all production services in the background
docker compose up -d --build

# Run migrations in the backend container
docker compose exec backend alembic upgrade head

# Seed canonical demo benchmark
docker compose exec backend python -m backend.seed_demo
```
- Production Frontend (Nginx): `http://localhost:80`
- Production Backend (FastAPI): `http://localhost:8000`
- PostgreSQL Database: `localhost:5432`
- Ollama Local AI: `http://localhost:11434`

### Option B: Development Stack (Hot-Reloading Frontend + Backend + PostgreSQL)
```bash
docker compose -f docker-compose.dev.yml up --build
```

---

## ⚙️ Environment Variables Reference

| Variable Name | Default Value | Description |
| :--- | :--- | :--- |
| `APP_ENV` | `development` | Environment mode (`development` / `production`) |
| `APP_URL` | `http://localhost:8000` | Base backend URL |
| `FRONTEND_URL` | `http://localhost:5173` | Allowed CORS frontend origin |
| `DATABASE_URL` | `sqlite:///./backend/zerolatency.db` | Database connection string (SQLite or PostgreSQL) |
| `JWT_SECRET` | `zl-super-secret-production-signing-key-replace-in-prod-2026` | Cryptographic secret for signing JWTs |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `60` | Access token lifespan |
| `REFRESH_TOKEN_EXPIRE_DAYS` | `7` | Refresh token validity window |
| `OLLAMA_BASE_URL` | `http://localhost:11434` | URL of local Ollama instance |
| `OLLAMA_MODEL` | `llama3.1:8b` | Configured local LLM model name |
| `MARKET_DATA_PROVIDER` | `demo` | Market provider mode (`demo` or `real`) |
| `MARKET_DATA_API_KEY` | `""` | Server-side API key for commercial market provider |
| `PAPER_TRADING_ENABLED` | `true` | Toggle simulated paper trading desk |
| `REQUIRE_EMAIL_VERIFICATION` | `false` | Enforce email verification before login |
| `SMTP_HOST` | `smtp.example.com` | SMTP host for emails (falls back to safe logger) |
| `SMTP_PORT` | `587` | SMTP port |
| `SMTP_USERNAME` | `user` | SMTP username |
| `SMTP_PASSWORD` | `password` | SMTP password |
| `SMTP_FROM` | `noreply@zerolatency.wealth` | Sender address for transactional emails |

---

## 🧪 Automated Testing Suite

Execute the comprehensive automated production test suite covering all 9 core requirements:
```bash
python tests/test_production_platform.py
```
**Test Results:**
- `test_health_checks` — `PASS` (Platform & Local AI health endpoints verified)
- `test_public_market_explorer` — `PASS` (Unauthenticated quotes & market overview)
- `test_user_registration` — `PASS` (Argon2id hashing & duplicate email checks)
- `test_user_login` — `PASS` (JWT access & refresh tokens issued)
- `test_user_data_isolation` — `PASS` (User A cannot access User B's portfolio)
- `test_watchlist_crud` — `PASS` (Personal watchlist add, list, and delete)
- `test_paper_trading_execution` — `PASS` (Simulated order ticket, cash ledger balance deduction)
- `test_local_ai_and_fallback` — `PASS` (Ollama chat & deterministic advice guardrails)
- `test_demo_mode_preservation` — `PASS` (Canonical ₹8,42,500 portfolio verified)

**Overall Suite: 9 passed, 0 failed (100% Pass Rate).**

---

## 🛡️ Security Hardening Checklist

- [x] **Argon2id Password Storage:** Passwords hashed using memory-hard Argon2id (`argon2-cffi`).
- [x] **Stateless JWT with Rotation:** Short-lived access tokens (60 min) and rotating refresh tokens (7 days).
- [x] **Tenant Data Isolation:** All financial operations extract the authenticated `user_id` from Bearer tokens.
- [x] **Sliding-Window Rate Limiting:** Rate limiting on auth, paper trading, and local AI endpoints.
- [x] **Strict CORS Policy:** Restricted to configured `FRONTEND_URL` in production.
- [x] **HTTP Security Headers:** CSP, HSTS, X-Frame-Options (`DENY`), and X-Content-Type-Options (`nosniff`).
- [x] **File Ingestion Guards:** 5MB file ceiling and 1,000-row statement safety limits on CSV uploads.
- [x] **Zero Secret Leakage:** `.env` and SQLite database files excluded from Git tracking.

---

## ❓ Troubleshooting

### 1. `OLLAMA OFFLINE` Badge in Copilot
- **Cause:** Ollama is not running or the model has not been pulled.
- **Fix:** Start Ollama using `ollama serve` and pull your model via `ollama pull llama3.1:8b`. The application will continue working smoothly using the deterministic knowledge engine in the interim.

### 2. Database Migration Issues
- **Fix:** If switching between SQLite and PostgreSQL, ensure `DATABASE_URL` is updated in `.env` and execute `python -m alembic upgrade head`.

### 3. Frontend Build Errors
- **Fix:** Run `cd frontend && npm run build` to verify type safety and module bundle integrity.

---

## 🏆 Hackathon Submission Information
- **Event:** Hack on Track Round 1
- **Problem Statement:** PS2 — Super App for Unified Multi-Asset Investing & Awareness
- **Team Name:** ZERO LATENCY
- **Product:** ZERO LATENCY WEALTH
- **Repository:** [https://github.com/ASTA91-GIT/ZeroLatencyWealth-HackOnTrack](https://github.com/ASTA91-GIT/ZeroLatencyWealth-HackOnTrack)
