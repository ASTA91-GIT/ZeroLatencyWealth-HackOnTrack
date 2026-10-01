# ZERO LATENCY WEALTH — Technical Requirements Document

> **"One Portfolio. Every Asset. Clearer Understanding."**
> **Hack on Track Round 1 — Problem Statement 2 (PS2):** Super App for Unified Multi-Asset Investing & Awareness
> **Repository:** [https://github.com/ASTA91-GIT/ZeroLatencyWealth-HackOnTrack](https://github.com/ASTA91-GIT/ZeroLatencyWealth-HackOnTrack)
> **Version:** 2.0.0 (Production-Ready Operable Fintech Architecture)
> **Status:** CURRENT SOURCE OF TRUTH (PRODUCTION TRANSFORMED)

---

## 1. Product Overview
**ZeroLatency Wealth** is a high-frequency, responsive financial web application designed to solve retail investor portfolio fragmentation and multi-asset awareness gaps in the Indian investment ecosystem. The platform serves as a unified terminal consolidating investments across **Equities**, **Corporate & Sovereign Bonds**, **Real Estate Investment Trusts (REITs)**, and **Infrastructure Investment Trusts (InvITs)**, paired with an intelligent, privacy-first **Local AI Copilot (powered by local Ollama without external cloud API dependencies)**, an operable **Paper Trading Desk**, a public **Market & Asset Explorer**, and enterprise-grade multi-tenant data isolation.

---

## 2. Problem Statement
Retail investors face two structural hurdles:
1. **Portfolio Fragmentation:** Investor holdings are distributed across multiple brokerages (Zerodha, Groww, Upstox, ICICI Securities), central depositories (CDSL, NSDL), and physical certificates without a single unified real-time dashboard.
2. **Asset Concentration & Ignorance:** Over 85% of retail retail participation is concentrated strictly in equities and fixed deposits. Alternative cash-flow instruments such as **REITs** (commercial real estate rental pass-throughs), **InvITs** (infrastructure revenue distributions), and **Sovereign Gold / Fixed Income Bonds** are poorly understood, lacking awareness of statutory yields and safety mechanics.

---

## 3. Product Objectives
- **Consolidation:** Ingest and normalize multi-source holding records into a unified portfolio command center.
- **Demystification & Public Discovery:** Provide an unauthenticated public exploration experience with real-time stock/market quotes, statutory yield mechanics, and educational pillars before account creation.
- **Privacy-First Local AI:** Run a genuine conversational AI chatbot powered by a self-hosted local LLM (Ollama) with context memory and zero external API keys or cloud tokens.
- **Risk-Free Operability:** Provide an operable simulated Paper Trading desk (₹10,00,000 virtual balance) with live order placement, transaction logging, and real-time portfolio recalculation.
- **Compliance & Safety:** Maintain deterministic AI guardrails strictly barring speculative buy/sell recommendations.
- **Zero Barrier Demo:** Offer an instant 1-click evaluation mode loaded with an official ₹8,42,500 canonical benchmark portfolio alongside real multi-user account registration.

---

## 4. Scope
- **In Scope (Implemented & Production-Ready):**
  - Public unauthenticated portal: Landing page, `/markets` stock explorer, asset classes, and learning curriculum.
  - Non-blocking gatekeeper prompt modal redirecting unauthenticated visitors to Sign Up / Log In when accessing Wealth OS actions.
  - Production Authentication: Argon2id password hashing, JWT access/refresh token rotation, email verification, password reset tokens, and session termination.
  - Multi-Tenant Isolation: Per-user portfolios, transactions, holdings, watchlists, paper accounts, and audit logging.
  - Local Ollama AI integration: Local conversational assistant with bounded conversation memory, portfolio context awareness, educational financial guardrails, and deterministic fallback.
  - Market Data Provider Abstraction: `MarketDataProvider` protocol supporting `demo` and `real` providers without exposing credentials to frontend.
  - Personal Watchlists & Paper Trading: ₹10,00,000 cash balance, BUY/SELL order ticket execution, holding synchronization, and order history.
  - Dual Database Support: SQLite for rapid local dev + PostgreSQL for enterprise production, backed by SQLAlchemy ORM and Alembic migrations.
  - Hackathon Demo Mode: Preserved 1-click evaluation access with canonical ₹8,42,500 benchmark.
  - Security Hardening: Sliding-window rate limiting, security headers (CSP, HSTS, X-Frame-Options), 5MB CSV validation, and strict CORS.
  - Docker Containerization: Production & dev multi-container Docker Compose with Frontend, Backend, PostgreSQL, and optional Ollama.

---

## 5. Functional Requirements

| Requirement ID | Module | Description | Implementation Status |
| :--- | :--- | :--- | :--- |
| **FR-01** | Unified Dashboard | Display Total Value, Net Invested, Unrealized P/L, Day Change, and Weighted Yield. | **STATUS: IMPLEMENTED** |
| **FR-02** | Allocation Visualizer | Render interactive Donut and Area performance charts adapting dynamically to light/dark themes. | **STATUS: IMPLEMENTED** |
| **FR-03** | Holdings Table | Comprehensive filterable table with asset class filtering, search, and custody breakdown. | **STATUS: IMPLEMENTED** |
| **FR-04** | Asset Deep-Dive | Interactive modal detailing risk rating, indicated yield, liquidity tier, and distribution rules. | **STATUS: IMPLEMENTED** |
| **FR-05** | Educational Copilot | Chat assistant responding to natural language questions with holding awareness and advice blocking. | **STATUS: IMPLEMENTED** |
| **FR-06** | Ingestion Simulator | Simulated multi-broker synchronization pipes and validated CSV statement parser (5MB limit). | **STATUS: IMPLEMENTED** |
| **FR-07** | Goals Engine | Simulated life milestone funding calculator powered by projected multi-asset income. | **STATUS: IMPLEMENTED** |
| **FR-08** | Learning Sandbox | Real-time slider simulator recalculating estimated weighted yields across user-defined asset mixes. | **STATUS: IMPLEMENTED** |
| **FR-09** | Benchmark Reset | 1-click atomic restoration of canonical evaluation portfolio state. | **STATUS: IMPLEMENTED** |
| **FR-10** | Live Account Aggregator | Production consent-driven AA integration via RBI/SEBI standard APIs. | **STATUS: CONCEPTUAL** |
| **FR-11** | Public Market Explorer | Public unauthenticated `/markets` route with live quotes, sector filters, search, and asset details. | **STATUS: IMPLEMENTED** |
| **FR-12** | Production Auth | Argon2id hashing, JWT access/refresh tokens, signup, login, password reset, email verification. | **STATUS: IMPLEMENTED** |
| **FR-13** | User Data Isolation | Strict tenant isolation ensuring User A can never query or modify User B's portfolio or orders. | **STATUS: IMPLEMENTED** |
| **FR-14** | Personal Watchlist | Add/remove instruments from personal watchlists with live price monitoring. | **STATUS: IMPLEMENTED** |
| **FR-15** | Paper Trading Desk | Simulated ₹10,00,000 capital account, BUY/SELL order ticket, cash ledger, holding updates. | **STATUS: IMPLEMENTED** |
| **FR-16** | Local Ollama AI | Local LLM service with conversational memory, portfolio context injection, and offline fallback. | **STATUS: IMPLEMENTED** |
| **FR-17** | Market Data Service | Abstracted provider layer (`demo` vs `real`) configurable server-side via environment variables. | **STATUS: IMPLEMENTED** |
| **FR-18** | Security Hardening | Rate limiting, CORS origin restrictions, security headers, file upload guards, audit logs. | **STATUS: IMPLEMENTED** |

---

## 6. Non-Functional Requirements
- **Sub-Second Performance:** Local FastAPI service queries execute with sub-5ms latency; frontend bundles build in < 1 second.
- **Deterministic Reliability:** 100% functional demo mode operating without third-party LLM rate-limit or cloud outages.
- **Data Sovereignty:** All mock financial state resides locally on the evaluator's machine within SQLite; zero broker credentials collected.
- **Accessibility & Motion Safety:** Complies with `prefers-reduced-motion` media queries; accessible WCAG AA color contrast across both light and dark themes.

---

## 7. Technology Stack

### Frontend Architecture
- **Language & Framework:** TypeScript 5.9, React 19.2
- **Build Tooling:** Vite 8.3
- **Styling:** Vanilla CSS design tokens + Tailwind CSS v4
- **3D Graphics:** Three.js (WebGL rendering engine)
- **Charts:** Recharts 3.10 (Theme-adaptive SVG visualizers)
- **Icons:** Lucide React
- **Typography:** System Inter/SF Pro with monospace numerical font families

### Backend Architecture
- **Runtime & Framework:** Python 3.10+ (tested through 3.14), FastAPI 0.141
- **Server:** Uvicorn ASGI (Development) / Gunicorn + Uvicorn Workers (Production)
- **Data Validation & Schemas:** Pydantic v2
- **ORM & Migrations:** SQLAlchemy 2.0+ ORM with Alembic schema migration framework
- **Databases:** SQLite3 (local embedded development) & PostgreSQL (production, via `DATABASE_URL`)
- **Password Security:** Argon2id hashing algorithm via `argon2-cffi` (with bcrypt fallback)
- **Session Security:** Cryptographic JSON Web Tokens (PyJWT) with access token expiration and refresh token rotation
- **Local AI Engine:** Local Ollama HTTP API client (`httpx`) connecting to self-hosted models (e.g., `llama3.1:8b`, `mistral`, `gemma2`) with bounded chat memory and deterministic rule-based knowledge fallback
- **Multipart Ingestion:** `python-multipart` with 5MB payload ceiling and 1,000-row statement safety limits
- **Rate Limiting:** Sliding-window in-memory rate limiter per IP/client for auth, paper trade, and AI endpoints
- **Security Middleware:** Custom security headers (CSP, HSTS, X-Content-Type-Options, Frame protection) and strict CORS origins

---

## 8. System Architecture

```
                    ┌───────────────────────────────────────────┐
                    │          RETAIL INVESTOR / VISITOR        │
                    └─────────────────────┬─────────────────────┘
                                          │
                        Public Routes     │  Protected Actions (Auth Token)
                        (/, /markets)     │  (/dashboard, /watchlist, /paper)
                                          ▼
                    ┌───────────────────────────────────────────┐
                    │         REACT 19 FRONTEND TERMINAL        │
                    │   (Vite, Three.js 3D, Context API, CSS)   │
                    └─────────────────────┬─────────────────────┘
                                          │ HTTP / JSON REST API
                                          ▼
                    ┌───────────────────────────────────────────┐
                    │             FASTAPI REST GATEWAY          │
                    │   (Security Headers, Rate Limiter, CORS)  │
                    └──────┬──────────────┬──────────────┬──────┘
                           │              │              │
            ┌──────────────▼─┐     ┌──────▼──────┐   ┌───▼───────────┐
            │ Authentication │     │ Market Data │   │   Local AI    │
            │  (Argon2id,    │     │   Service   │   │  (Ollama API  │
            │   JWT, Tokens) │     │ (Demo/Real) │   │   + Fallback) │
            └──────────────┬─┘     └──────┬──────┘   └───┬───────────┘
                           │              │              │
            ┌──────────────▼─┐     ┌──────▼──────┐   ┌───▼───────────┐
            │ Paper Trading  │     │ Watchlists  │   │  Portfolio &  │
            │  (Simulated    │     │  & Alerts   │   │ Ingestion CSV │
            │   Order Desk)  │     │             │   │  Engine       │
            └──────────────┬─┘     └──────┬──────┘   └───┬───────────┘
                           │              │              │
                           └──────────────┼──────────────┘
                                          │
                                          ▼
                    ┌───────────────────────────────────────────┐
                    │          SQLALCHEMY ORM & ALEMBIC         │
                    └─────────────────────┬─────────────────────┘
                                          │
                         ┌────────────────┴────────────────┐
                         ▼                                 ▼
           ┌───────────────────────────┐     ┌───────────────────────────┐
           │      SQLITE DATABASE      │     │    POSTGRESQL DATABASE    │
           │    (Local Development)    │     │   (Production Deployment) │
           └───────────────────────────┘     └───────────────────────────┘
```

---

## 9. Frontend Architecture
The frontend is structured as a single-page terminal utilizing React Context for global state management:
- **`AppContext.tsx`:** Manages active view (`landing`, `markets`, `dashboard`, `portfolio`, `watchlist`, `explorer`, `insights`, `goals`, `learning`, `import`, `security`, `architecture`, `settings`, `login`, `signup`), session tokens, current user, paper accounts, watchlist cache, gatekeeper prompt modal, toast feedback, and light/dark theme synchronization.
- **Gatekeeper Auth Modal (`AuthPromptModal.tsx`):** Non-blocking modal intercepting protected actions ("Add to Watchlist", "Paper Trade", "Open Wealth OS", "Copilot") for unauthenticated visitors.
- **View Isolation:** Each major view is encapsulated within `frontend/src/views/` without circular dependencies.
- **Component Reusability:** Modular atomic components (`Navbar`, `Logo`, `FinancialNetwork3D`, `AssetDetailModal`, `PaperTradeModal`, `CopilotDrawer`, `ToastContainer`).

---

## 10. Backend Architecture
The backend is organized as a modular, production-ready FastAPI service layer:
- **`main.py`:** Application bootstrapping, rate limiting, security headers, CORS middleware, standardized error responses, health checks (`/api/health`, `/api/ai/health`), and 37 REST API endpoints.
- **`db_models.py`:** 12 declarative SQLAlchemy ORM models mapped to relational database tables.
- **`models.py`:** Strict Pydantic v2 schemas validating request payloads and formatting API responses.
- **`database.py`:** Dual-engine connection management (SQLite / PostgreSQL), auto-migrations for development, and benchmark data seeding.
- **`security.py`:** Sliding-window rate limiter, security headers middleware, and authenticated user dependency with tenant isolation.
- **`services/`:**
  - `auth_service.py`: Real registration, login, Argon2id hashing, token refresh, password reset, email verification, and 1-click demo access.
  - `market_data_service.py`: `MarketDataProvider` abstraction interface supporting `DemoMarketDataProvider` and `RealMarketDataProvider`.
  - `paper_trading_service.py`: Virtual account management (₹10,00,000 balance), BUY/SELL order ticket execution, cash ledger, and holding sync.
  - `watchlist_service.py`: Tenant-isolated watchlist CRUD operations.
  - `local_ai_service.py`: Self-hosted Ollama LLM assistant with bounded memory, portfolio context injection, and deterministic knowledge fallback.
  - `email_service.py`: SMTP notification service with development console outbox fallback.
  - `portfolio_service.py`: Valuation math, allocation weightings, and benchmark resets.
  - `analytics_service.py`: Risk profiling, concentration detection, and cash flow projections.
  - `import_service.py`: 5MB validated CSV statement processing and multi-broker synchronization pipes.
  - `goals_service.py`: CRUD operations for financial goal tracking.

---

## 11. Database Architecture
The production schema enforces relational foreign-key integrity and multi-tenant data isolation across 12 tables:

### 1. `users`
- `id` (VARCHAR(64), PK): Unique user UUID / identifier.
- `email` (VARCHAR(255), UNIQUE, INDEX): Account email address.
- `name` (VARCHAR(255)): Display name.
- `password_hash` (VARCHAR(255)): Argon2id cryptographic password hash.
- `is_demo` (BOOLEAN): Flag designating canonical demo accounts (1) vs registered accounts (0).
- `email_verified` (BOOLEAN): Email verification status flag.
- `created_at` (TIMESTAMP).

### 2. `refresh_tokens`
- `id` (VARCHAR(64), PK), `user_id` (FK -> users.id), `token` (VARCHAR(512), UNIQUE, INDEX), `expires_at` (TIMESTAMP), `created_at` (TIMESTAMP).

### 3. `password_reset_tokens`
- `id` (VARCHAR(64), PK), `user_id` (FK -> users.id), `token` (VARCHAR(255), UNIQUE, INDEX), `expires_at` (TIMESTAMP), `used` (BOOLEAN).

### 4. `email_verification_tokens`
- `id` (VARCHAR(64), PK), `user_id` (FK -> users.id), `token` (VARCHAR(255), UNIQUE, INDEX), `expires_at` (TIMESTAMP).

### 5. `assets`
- `id` (VARCHAR(64), PK): Asset identifier (e.g., `EQ_01`, `REIT_01`, `BOND_01`, `INVIT_01`).
- `symbol` (VARCHAR(32), UNIQUE, INDEX): Exchange ticker (e.g., `NIFTYBEES`, `EMBASSY`, `PGINVIT`).
- `name`, `asset_type`, `category`, `sector`, `description`, `risk_level`, `annual_yield`, `liquidity_score`, `price`, `change_24h`.

### 6. `holdings`
- `id` (VARCHAR(64), PK), `user_id` (FK -> users.id), `asset_id` (FK -> assets.id), `source`, `units`, `avg_buy_price`, `current_price`, `updated_at`.

### 7. `transactions`
- `id` (VARCHAR(64), PK), `user_id` (FK -> users.id), `asset_id` (FK -> assets.id), `type` (`BUY`, `SELL`, `DIVIDEND`, `INTEREST`), `units`, `price`, `amount`, `date`, `source`.

### 8. `goals`
- `id` (VARCHAR(64), PK), `user_id` (FK -> users.id), `title`, `category`, `target_amount`, `current_amount`, `time_period`, `icon`, `created_at`.

### 9. `portfolio_snapshots`
- `id` (VARCHAR(64), PK), `user_id` (FK -> users.id), `date`, `total_value`, `invested_value`, `equity_val`, `bond_val`, `reit_val`, `invit_val`, `other_val`.

### 10. `watchlists`
- `id` (VARCHAR(64), PK), `user_id` (FK -> users.id), `asset_id` (FK -> assets.id), `notes`, `created_at`.

### 11. `paper_accounts` & `paper_orders`
- **`paper_accounts`:** `id` (VARCHAR(64), PK), `user_id` (FK -> users.id, UNIQUE), `cash_balance` (REAL, default ₹10,00,000), `initial_balance` (REAL), `created_at`, `updated_at`.
- **`paper_orders`:** `id` (VARCHAR(64), PK), `user_id` (FK -> users.id), `symbol`, `side` (`BUY`/`SELL`), `quantity`, `price`, `total_amount`, `status` (`FILLED`), `created_at`.

### 12. `audit_logs`
- `id` (VARCHAR(64), PK), `user_id`, `action`, `resource`, `details`, `ip_address`, `timestamp`.

---

## 12. Authentication Architecture
- **Production Credential Auth:** `POST /api/auth/register` creates user accounts with Argon2id password hashing and optional email verification token generation. `POST /api/auth/login` verifies credentials and issues a cryptographic JWT access token + refresh token pair.
- **Refresh Token Rotation:** `POST /api/auth/refresh` allows transparent frontend token rejuvenation without forcing re-login.
- **Password Recovery:** `POST /api/auth/forgot-password` dispatches a secure reset link (or development outbox notification) followed by `POST /api/auth/reset-password`.
- **Demo Mode Preservation:** Instantaneous 1-click access via `POST /api/auth/demo` returning a pre-authenticated session token and loading `demo-user-001` with the canonical ₹8,42,500 benchmark.
- **Tenant Isolation:** All protected endpoints resolve the calling user via JWT Bearer tokens; frontends cannot spoof or query other users' portfolios.
- **STATUS: IMPLEMENTED**

---

## 13. Portfolio Aggregation Engine
- **Simulated Ingestion:** `POST /api/import/demo` simulates API synchronization with `Broker A`, `Broker B`, or `Depository`, demonstrating multi-custody consolidation without external dependencies.
- **CSV Statement Ingestion:** `POST /api/import/csv` parses uploaded user CSV files, mapping columns (`Symbol`, `Name`, `AssetType`, `Units`, `BuyPrice`, `CurrentPrice`), verifying numeric validity, and merging holdings.
- **STATUS: IMPLEMENTED**

---

## 14. Asset Classification & Normalization
Incoming assets are normalized into 4 primary statutory pillars:
1. **EQUITY:** Listed corporate shares and index ETFs targeting capital appreciation.
2. **BOND:** Sovereign Debt, State Development Loans, and Corporate Debentures targeting capital preservation.
3. **REIT:** SEBI-registered commercial real estate trusts distributing >=90% of net cash flows.
4. **INVIT:** Infrastructure trusts owning transmission lines, toll roads, and pipelines with mandatory cash payouts.
5. **OTHER:** Liquid overnight debt funds (e.g., LiquidBeES) serving as cash buffers.
- **STATUS: IMPLEMENTED**

---

## 15. Portfolio Calculations & Valuation Formulas
1. **Invested Basis:**
   $$\text{Invested Value} = \sum (\text{units}_i \times \text{avg\_buy\_price}_i)$$
2. **Current Valuation:**
   $$\text{Total Value} = \sum (\text{units}_i \times \text{current\_price}_i)$$
3. **Unrealized Gain/Loss:**
   $$\text{Unrealized P/L} = \text{Total Value} - \text{Total Invested}$$
   $$\text{Unrealized P/L \%} = \left(\frac{\text{Unrealized P/L}}{\text{Total Invested}}\right) \times 100$$
4. **Projected Annual Income:**
   $$\text{Annual Income} = \sum \left(\text{Current Value}_i \times \frac{\text{annual\_yield}_i}{100}\right)$$
5. **Weighted Portfolio Yield:**
   $$\text{Weighted Yield \%} = \left(\frac{\text{Projected Annual Income}}{\text{Total Value}}\right) \times 100$$
- **STATUS: IMPLEMENTED**

---

## 16. AI Copilot Architecture
- **Knowledge Engine:** Self-contained deterministic knowledge base in `backend/services/copilot_service.py`.
- **Regulatory Guardrail Interceptor:** Regex filters detecting advice queries (`"should I buy"`, `"should I sell"`, `"recommend a stock"`) and intercepting them with a statutory educational disclaimer.
- **Context Synthesis:** Binds live holding records to context-specific prompts (`context_asset_id` or queries mentioning specific symbols).
- **Zero-Latency Fallback:** Requires no external OpenAI/Gemini API keys, guaranteeing 100% availability during evaluation.
- **STATUS: IMPLEMENTED**

---

## 17. Portfolio Insights Engine
Computes algorithmic diagnostics delivered via `GET /api/insights`:
- **Quantitative Observations:** Automated allocation summaries highlighting equity exposure, real estate yields, and bond safety cushions.
- **Income Projections:** Monthly averages and distribution frequency breakdowns (Quarterly REIT distributions, semi-annual bond coupons).
- **Concentration Risk Alerts:** Flags any single asset whose allocation exceeds **20%** of total portfolio value.
- **Historical Growth Snapshots:** 12-month historical mark-to-market trends.
- **STATUS: IMPLEMENTED**

---

## 18. Portfolio Import System
- **Broker Simulation:** Ingests simulated portfolios from Broker A (Equities), Broker B (REITs & Sovereign Gold), and Depository (InvITs & Tax-Free Bonds).
- **CSV Importer:** Robust client-side file upload interface with column validation and instant portfolio recalculation.
- **STATUS: IMPLEMENTED**

---

## 19. Goals Engine
- **Simulated Life Milestones:** Create, track, and delete targeted goals (Emergency Fund, Higher Education, Home Purchase, Travel, Retirement).
- **Yield Attribution:** Shows how passive income from REITs, InvITs, and Bonds steadily closes capital shortfalls.
- **STATUS: IMPLEMENTED**

---

## 20. Learning Center & Allocation Sandbox
- **Interactive Multi-Asset Sandbox:** Real-time percentage sliders for Equities, Bonds, REITs, and InvITs dynamically calculating portfolio yield.
- **Comparison Matrix:** Clear tabular comparisons covering underlying assets, return mechanisms, liquidity, and taxation.
- **STATUS: IMPLEMENTED**

---

## 21. Theme System
- **Dual Themes:** Full Light Mode and Dark Mode support.
- **Design Tokens:** Centralized CSS variables in `frontend/src/index.css`.
- **Persistence:** Saved in `localStorage` under `zl_theme`.
- **Zero White Flashing:** Applied immediately to `<html>` class list on initialization.
- **Chart Adaptation:** Donut and Area charts adapt grid strokes, fills, and tooltips dynamically.
- **STATUS: IMPLEMENTED**

---

## 22. Three.js / WebGL Architecture
- **Component:** `frontend/src/components/FinancialNetwork3D.tsx`.
- **Geometry & Materials:** 70+ glowing nodes with dynamic distance-based lattice lines.
- **Mouse Parallax:** Smooth damping tracking mouse movement across the viewport.
- **Mobile Responsive:** Automatically reduces particle density on screens under 768px.
- **Reduced Motion:** Detects `prefers-reduced-motion` and provides a CSS animated gradient fallback.
- **STATUS: IMPLEMENTED**

---

## 23. Complete API Specification

| HTTP Verb | Path | Request Body | Response Model | Description | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/demo` | None | `AuthResponse` | 1-Click demo authentication with benchmark data | **IMPLEMENTED** |
| `POST` | `/api/auth/login` | `LoginRequest` | `AuthResponse` | Session authentication | **IMPLEMENTED** |
| `POST` | `/api/auth/register` | `RegisterRequest` | `AuthResponse` | New user registration | **IMPLEMENTED** |
| `GET` | `/api/portfolio` | Query: `asset_type`, `source`, `search` | `List[HoldingModel]` | Filterable list of consolidated holdings | **IMPLEMENTED** |
| `GET` | `/api/portfolio/summary` | None | `PortfolioSummary` | Complete portfolio valuation and allocations | **IMPLEMENTED** |
| `POST` | `/api/portfolio/reset` | None | `dict` | Revert portfolio to canonical ₹8.42L benchmark | **IMPLEMENTED** |
| `GET` | `/api/assets` | None | `List[AssetModel]` | Master catalog of registered instruments | **IMPLEMENTED** |
| `GET` | `/api/assets/{asset_id}` | Path param | `AssetModel` | Detailed instrument metadata & return rules | **IMPLEMENTED** |
| `GET` | `/api/insights` | None | `PortfolioInsightsResponse` | Algorithmic observations & risk metrics | **IMPLEMENTED** |
| `GET` | `/api/goals` | None | `List[GoalModel]` | List simulated life goals | **IMPLEMENTED** |
| `POST` | `/api/goals` | `GoalCreate` | `GoalModel` | Create a new simulated goal | **IMPLEMENTED** |
| `PUT` | `/api/goals/{goal_id}` | `GoalUpdate` | `GoalModel` | Update an existing goal | **IMPLEMENTED** |
| `DELETE` | `/api/goals/{goal_id}` | Path param | `dict` | Delete an existing goal | **IMPLEMENTED** |
| `POST` | `/api/import/demo` | `SimulatedImportRequest` | `ImportResponse` | Simulate broker or depository synchronization | **IMPLEMENTED** |
| `POST` | `/api/import/csv` | `multipart/form-data` | `ImportResponse` | Parse and import user holding CSV file | **IMPLEMENTED** |
| `POST` | `/api/copilot/chat` | `ChatRequest` | `ChatResponse` | Query AI Copilot with portfolio context | **IMPLEMENTED** |

---

## 24. Error Handling
- **Backend:** Standard HTTP status codes (400 Bad Request, 401 Unauthorized, 404 Not Found, 500 Server Error) returning structured JSON error details.
- **Frontend:** Centralized `ToastContainer` displaying emerald success, rose error, amber warning, and purple informational banners with auto-dismissal.

---

## 25. Loading & Empty States
- **Skeleton Loaders:** Pulse animation cards displayed during initial holding and summary fetch.
- **Empty Filters:** Friendly zero-state guidance if search queries yield no results with 1-click filter reset.

---

## 26. Security & Privacy Architecture
- **Zero Credential Storage:** No broker master passwords, trading PINs, or TOTP secrets are requested or persisted.
- **Sandbox Isolation:** All demo state is confined to a local SQLite database file.
- **Stateless Bearer Tokens:** Session authorization headers for user data boundary enforcement.
- **STATUS: IMPLEMENTED**
- **Production Account Aggregator Framework:** Future integration with RBI/SEBI licensed Account Aggregators (Setu, Anumati) utilizing consent-based digital certificates.
- **STATUS: CONCEPTUAL**

---

## 27. Environment Variables
Described in `.env.example`:
- `APP_ENV`: `development` | `production`
- `APP_URL`: `http://localhost:8000`
- `FRONTEND_URL`: `http://localhost:5173`
- `DATABASE_URL`: `sqlite:///./backend/zerolatency.db` (or `postgresql://postgres:postgres@localhost:5432/zerolatency`)
- `JWT_SECRET`: Secret signing key (replace with random 64-char key in production)
- `ACCESS_TOKEN_EXPIRE_MINUTES`: `60`
- `REFRESH_TOKEN_EXPIRE_DAYS`: `7`
- `OLLAMA_BASE_URL`: `http://localhost:11434`
- `OLLAMA_MODEL`: `llama3.1:8b` (or `mistral`, `gemma2`)
- `SMTP_HOST`: SMTP server host
- `SMTP_PORT`: `587`
- `SMTP_USERNAME` / `SMTP_PASSWORD`: SMTP credentials
- `SMTP_FROM`: Sender address
- `MARKET_DATA_PROVIDER`: `demo` | `real`
- `MARKET_DATA_API_KEY`: Server-side provider key (optional)
- `PAPER_TRADING_ENABLED`: `true`
- `REQUIRE_EMAIL_VERIFICATION`: `false` (demo) | `true` (prod)

---

## 28. Canonical Demo Benchmark Data
- **Total Portfolio Value:** ₹8,42,500
- **Total Invested Capital:** ₹7,95,000
- **Unrealized Gain / P/L:** +₹47,500 (+5.97%)
- **Projected Annual Yield:** ₹37,362 (4.43% weighted yield)
- **Asset Classes:** Equities (52.0%), Bonds (18.1%), REITs (14.9%), InvITs (10.0%), Cash (5.0%)
- **Active Holdings:** 13 instruments across 4 custody sources (Broker A, Broker B, Depository, Imported CSV)

---

## 29. Development Setup
```bash
# Backend Setup
pip install fastapi uvicorn pydantic python-multipart httpx
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload

# Frontend Setup
cd frontend
npm install
npm run dev
```

---

## 30. Deployment Considerations
- **Production Bundle:** Frontend compiles into static HTML/CSS/JS via `npm run build` deployable to Vercel, Netlify, or AWS S3/CloudFront.
- **API Server:** ASGI application containerized with Docker and deployed behind Nginx / Traefik reverse proxy.
- **Database:** Easily upgradable from SQLite to PostgreSQL by updating `DATABASE_URL` via SQLAlchemy/Alembic.

---

## 31. Current Limitations
- External broker syncing is simulated via mock connectors rather than direct live broker APIs.
- Copilot AI operates using a comprehensive deterministic knowledge engine; external LLMs require configuring an API key.

---

## 32. Future Enhancements
- Integration with RBI Account Aggregator (AA) framework for consent-driven automated holding pulls.
- Automated tax harvesting analysis comparing short-term vs long-term capital gains across asset classes.
- Mobile native application wrapper using React Native or Capacitor.
