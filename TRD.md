# ZERO LATENCY WEALTH — Technical Requirements Document

> **"One Portfolio. Every Asset. Clearer Understanding."**  
> **Hack on Track Round 1 — Problem Statement 2 (PS2):** Super App for Unified Multi-Asset Investing & Awareness  
> **Repository:** [https://github.com/ASTA91-GIT/ZeroLatencyWealth-HackOnTrack](https://github.com/ASTA91-GIT/ZeroLatencyWealth-HackOnTrack)  
> **Version:** 1.0.0 (Production Hackathon Baseline)  
> **Status:** CURRENT SOURCE OF TRUTH

---

## 1. Product Overview
**ZeroLatency Wealth** is a high-frequency, responsive financial web application designed to solve retail investor portfolio fragmentation and multi-asset awareness gaps in the Indian investment ecosystem. The platform serves as a unified terminal consolidating investments across **Equities**, **Corporate & Sovereign Bonds**, **Real Estate Investment Trusts (REITs)**, and **Infrastructure Investment Trusts (InvITs)**, paired with an intelligent, deterministic educational AI Copilot.

---

## 2. Problem Statement
Retail investors face two structural hurdles:
1. **Portfolio Fragmentation:** Investor holdings are distributed across multiple brokerages (Zerodha, Groww, Upstox, ICICI Securities), central depositories (CDSL, NSDL), and physical certificates without a single unified real-time dashboard.
2. **Asset Concentration & Ignorance:** Over 85% of retail retail participation is concentrated strictly in equities and fixed deposits. Alternative cash-flow instruments such as **REITs** (commercial real estate rental pass-throughs), **InvITs** (infrastructure revenue distributions), and **Sovereign Gold / Fixed Income Bonds** are poorly understood, lacking awareness of statutory yields and safety mechanics.

---

## 3. Product Objectives
- **Consolidation:** Ingest and normalize multi-source holding records into a unified portfolio command center.
- **Demystification:** Provide intuitive multi-asset awareness tools, statutory return explanations, yield sandboxes, and visual asset mechanics.
- **Compliance & Safety:** Maintain deterministic AI guardrails strictly barring speculative buy/sell recommendations.
- **Zero Barrier Demo:** Offer an instant 1-click evaluation mode loaded with an official ₹8,42,500 canonical benchmark portfolio requiring zero API keys or external signups.

---

## 4. Scope
- **In Scope (Implemented):**
  - Consolidated multi-broker portfolio tracking (₹8,42,500 canonical benchmark).
  - Four distinct asset pillars: Equities, Bonds, REITs, InvITs (plus Liquid Cash).
  - Three.js WebGL 3D financial network hero animation with mouse parallax and mobile scaling.
  - Complete Light Mode + Dark Mode design system with persistent state and adaptive Recharts.
  - Simulated multi-broker automated sync (Broker A, Broker B, Depository) and real client-side CSV statement parsing.
  - Deterministic AI Copilot with regulatory anti-advice guardrails and contextual holding awareness.
  - Interactive multi-asset allocation sandbox and historical income forecasts.
  - Local relational SQLite persistence with instantaneous canonical reset.
- **Out of Scope / Production Roadmap (Conceptual):**
  - Direct live OAuth connection to SEBI Account Aggregator (AA) ecosystem (Setu/Anumati).
  - Automated broker API trade execution or order routing.
  - Real-time depository CAS XML parsing with digital certificate validation.

---

## 5. Functional Requirements

| Requirement ID | Module | Description | Implementation Status |
| :--- | :--- | :--- | :--- |
| **FR-01** | Unified Dashboard | Display Total Value, Net Invested, Unrealized P/L, Day Change, and Weighted Yield. | **STATUS: IMPLEMENTED** |
| **FR-02** | Allocation Visualizer | Render interactive Donut and Area performance charts adapting dynamically to light/dark themes. | **STATUS: IMPLEMENTED** |
| **FR-03** | Holdings Table | Comprehensive filterable table with asset class filtering, search, and custody breakdown. | **STATUS: IMPLEMENTED** |
| **FR-04** | Asset Deep-Dive | Interactive modal detailing risk rating, indicated yield, liquidity tier, and distribution rules. | **STATUS: IMPLEMENTED** |
| **FR-05** | Educational Copilot | Chat assistant responding to natural language questions with holding awareness and advice blocking. | **STATUS: IMPLEMENTED** |
| **FR-06** | Ingestion Simulator | Simulated multi-broker synchronization pipes and real CSV file statement parser. | **STATUS: IMPLEMENTED** |
| **FR-07** | Goals Engine | Simulated life milestone funding calculator powered by projected multi-asset income. | **STATUS: IMPLEMENTED** |
| **FR-08** | Learning Sandbox | Real-time slider simulator recalculating estimated weighted yields across user-defined asset mixes. | **STATUS: IMPLEMENTED** |
| **FR-09** | Benchmark Reset | 1-click atomic restoration of canonical evaluation portfolio state. | **STATUS: IMPLEMENTED** |
| **FR-10** | Live Account Aggregator | Production consent-driven AA integration via RBI/SEBI standard APIs. | **STATUS: CONCEPTUAL** |

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
- **Server:** Uvicorn ASGI
- **Data Validation:** Pydantic v2
- **Database:** SQLite3 embedded relational engine (`backend/zerolatency.db`)
- **Multipart Ingestion:** `python-multipart` (CSV statement processing)

---

## 8. System Architecture

```
                    ┌───────────────────────────────────────────┐
                    │          RETAIL INVESTOR / JUDGE          │
                    └─────────────────────┬─────────────────────┘
                                          │
                                          ▼
                    ┌───────────────────────────────────────────┐
                    │         REACT 19 FRONTEND TERMINAL        │
                    │   (Vite, Three.js 3D, Tailwind CSS v4)    │
                    └─────────────────────┬─────────────────────┘
                                          │ HTTP / JSON API
                                          ▼
                    ┌───────────────────────────────────────────┐
                    │             FASTAPI REST GATEWAY          │
                    │          (CORS, Pydantic Validation)      │
                    └──────┬──────────────┬──────────────┬──────┘
                           │              │              │
            ┌──────────────▼─┐     ┌──────▼──────┐   ┌───▼───────────┐
            │ Authentication │     │ Aggregation │   │  Analytics &  │
            │  & Session     │     │ & Ingestion │   │  Diagnostics  │
            └──────────────┬─┘     └──────┬──────┘   └───┬───────────┘
                           │              │              │
                           └──────────────┼──────────────┘
                                          ▼
                    ┌───────────────────────────────────────────┐
                    │      DATA NORMALIZATION & TAXONOMY        │
                    │   (EQUITY, BOND, REIT, INVIT Pillars)     │
                    └─────────────────────┬─────────────────────┘
                                          │
                                          ▼
                    ┌───────────────────────────────────────────┐
                    │           ZERO LATENCY COPILOT            │
                    │     (Deterministic Awareness Engine)      │
                    └─────────────────────┬─────────────────────┘
                                          │
                                          ▼
                    ┌───────────────────────────────────────────┐
                    │          SQLITE PERSISTENCE LAYER         │
                    │     (Users, Assets, Holdings, Goals)      │
                    └───────────────────────────────────────────┘
```

---

## 9. Frontend Architecture
The frontend is structured as a single-page terminal utilizing React Context for global state management:
- **`AppContext.tsx`:** Manages active view (`landing`, `dashboard`, `portfolio`, `explorer`, `insights`, `goals`, `learning`, `import`, `security`, `architecture`, `settings`, `login`, `register`), holdings cache, toast feedback, and light/dark theme synchronization.
- **View Isolation:** Each major view is encapsulated within `frontend/src/views/` without circular dependencies.
- **Component Reusability:** Modular atomic components (`Navbar`, `Logo`, `FinancialNetwork3D`, `AssetDetailModal`, `CopilotDrawer`, `ToastContainer`).

---

## 10. Backend Architecture
The backend is organized as a modular FastAPI service layer:
- **`main.py`:** Application bootstrapping, CORS middleware, lifespan database seeding, and REST endpoint definitions.
- **`models.py`:** Strict Pydantic v2 schemas validating request payloads and formatting API responses.
- **`database.py`:** Connection management, schema migration scripts, and benchmark data seeding.
- **`services/`:**
  - `portfolio_service.py`: Valuation math, allocation weightings, and benchmark resets.
  - `analytics_service.py`: Risk profiling, concentration detection, and cash flow projections.
  - `copilot_service.py`: Natural language query processing, holding synthesis, and advice policy enforcement.
  - `import_service.py`: Automated multi-broker sync simulation and CSV file parsing.
  - `goals_service.py`: CRUD operations for financial goal tracking.
  - `auth_service.py`: 1-click demo login and session token distribution.

---

## 11. Database Architecture
The SQLite database (`backend/zerolatency.db`) enforces relational foreign-key integrity across 6 tables:

### 1. `users`
- `id` (TEXT, PK): Unique user identifier (e.g., `demo-user-001`).
- `email` (TEXT, UNIQUE): Account email address.
- `name` (TEXT): Display name.
- `password_hash` (TEXT): Cryptographic hash or demo placeholder.
- `is_demo` (INTEGER): Flag designating benchmark demo accounts (1) vs registered (0).
- `created_at` (TIMESTAMP).

### 2. `assets`
- `id` (TEXT, PK): Asset identifier (e.g., `EQ_01`, `REIT_01`, `BOND_01`, `INVIT_01`).
- `symbol` (TEXT, UNIQUE): Exchange ticker (e.g., `NIFTYBEES`, `EMBASSY`, `PGINVIT`).
- `name` (TEXT): Official instrument name.
- `asset_type` (TEXT): Pillar taxonomy (`EQUITY`, `BOND`, `REIT`, `INVIT`, `OTHER`).
- `category` (TEXT): Regulatory sub-category.
- `sector` (TEXT): Industry sector.
- `description` (TEXT): Detailed instrument background and return mechanism.
- `risk_level` (TEXT): `Low`, `Moderate`, `Moderate-High`, `High`.
- `annual_yield` (REAL): Indicated annual cash distribution yield (%).
- `liquidity_score` (TEXT): `High`, `Moderate`, `Low`.
- `price` (REAL): Current mark-to-market unit price (₹).
- `change_24h` (REAL): 24-hour percentage price change (%).

### 3. `holdings`
- `id` (TEXT, PK): Holding record identifier.
- `user_id` (TEXT, FK -> users.id).
- `asset_id` (TEXT, FK -> assets.id).
- `source` (TEXT): Custody source (`Broker A`, `Broker B`, `Depository`, `Imported CSV`).
- `units` (REAL): Quantity of units held.
- `avg_buy_price` (REAL): Average acquisition cost per unit (₹).
- `current_price` (REAL): Live market valuation per unit (₹).
- `updated_at` (TIMESTAMP).

### 4. `transactions`
- `id` (TEXT, PK).
- `user_id` (TEXT, FK -> users.id).
- `asset_id` (TEXT, FK -> assets.id).
- `type` (TEXT): `BUY`, `DIVIDEND`, `INTEREST`, `DISTRIBUTION`.
- `units` (REAL).
- `price` (REAL).
- `amount` (REAL).
- `date` (TEXT).
- `source` (TEXT).

### 5. `goals`
- `id` (TEXT, PK): Unique goal identifier.
- `user_id` (TEXT, FK -> users.id).
- `title` (TEXT): Goal objective (e.g., "Emergency Fund", "Home Downpayment").
- `category` (TEXT): `Emergency`, `Travel`, `Education`, `Home`, `Retirement`.
- `target_amount` (REAL): Total capital target (₹).
- `current_amount` (REAL): Accumulated balance (₹).
- `time_period` (TEXT): Horizon duration (e.g., "12 Months", "24 Months").
- `icon` (TEXT): Icon identifier.
- `created_at` (TIMESTAMP).

### 6. `portfolio_snapshots`
- `id` (TEXT, PK).
- `user_id` (TEXT, FK -> users.id).
- `date` (TEXT): Historical timestamp (YYYY-MM).
- `total_value` (REAL), `invested_value` (REAL), `equity_val` (REAL), `bond_val` (REAL), `reit_val` (REAL), `invit_val` (REAL), `other_val` (REAL).

---

## 12. Authentication Architecture
- **Demo Mode:** Instantaneous 1-click access via `POST /api/auth/demo` returning a pre-authenticated session token and loading `demo-user-001`.
- **Credential Auth:** `POST /api/auth/login` and `POST /api/auth/register` validating email/password combinations.
- **Session Header:** API requests pass `Authorization: Bearer <token>` (defaulting to the demo user context if omitted during evaluation).
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
- `ENVIRONMENT`: `development` | `production`
- `PORT`: `8000`
- `HOST`: `127.0.0.1`
- `VITE_API_URL`: `http://127.0.0.1:8000`
- `DATABASE_URL`: `sqlite:///./backend/zerolatency.db`
- `JWT_SECRET`: Secret token signing key
- `LLM_PROVIDER`: `none` (default deterministic) | `openai` | `gemini`

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
