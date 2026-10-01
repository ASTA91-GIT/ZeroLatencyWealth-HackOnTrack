# ZERO LATENCY WEALTH
> **"One Portfolio. Every Asset. Clearer Understanding."**
>
> **Hack on Track Round 1 — Problem Statement 2 (PS2)**  
> *Super App for Unified Multi-Asset Investing & Awareness*  
> **Team Name:** ZERO LATENCY  
> **Product Name:** ZERO LATENCY WEALTH  
> **Repository:** [https://github.com/ASTA91-GIT/ZeroLatencyWealth-HackOnTrack](https://github.com/ASTA91-GIT/ZeroLatencyWealth-HackOnTrack)

---

## 📚 Engineering Documentation

Comprehensive technical documentation matching the live codebase is available in the repository root:

- [Technical Requirements Document (TRD.md)](./TRD.md) — 32 comprehensive engineering sections detailing architecture, models, APIs, and calculations.
- [Application Flow (APP_FLOW.md)](./APP_FLOW.md) — End-to-end navigational flows, AI Copilot decision trees, and multi-broker ingestion pipelines.
- [Implementation Plan (IMPLEMENTATION_PLAN.md)](./IMPLEMENTATION_PLAN.md) — 14-phase roadmap tracking completed modules and redesign milestones.
- [Testing & Verification (TESTING.md)](./TESTING.md) — Complete test reports across all 16 FastAPI endpoints, frontend builds, theme switches, and canonical benchmark math.

---

## ⚠️ Mandatory Hackathon Financial Disclaimer
> **"All financial data displayed in this hackathon prototype is fictional/demo data and is not financial advice."**  
> ZeroLatency Wealth is an educational and portfolio consolidation prototype developed for **Hack on Track Round 1**. It does not connect to real brokerage accounts or execute actual financial transactions, nor does it provide personalized investment advice or buy/sell recommendations.

---

## 📌 Problem Statement & Product Overview

### The Problem
Retail investors' holdings are fragmented across brokers (Zerodha, Groww, Upstox, ICICI), depositories (CDSL, NSDL), and manual statements, leaving them without a single consolidated source of truth. Consequently, participation is heavily concentrated (~85%+) in equities, while high-yielding alternative asset classes such as **REITs** (Real Estate Investment Trusts), **InvITs** (Infrastructure Investment Trusts), and **Sovereign Bonds** remain poorly understood.

### The Solution: ZeroLatency Wealth
ZeroLatency Wealth solves two core challenges:
1. **Unified Portfolio**: Aggregates disparate holdings across Equities, Sovereign Bonds, Commercial REITs, and Infrastructure InvITs from multiple custody sources into a single real-time command dashboard.
2. **Multi-Asset Awareness**: Demystifies non-equity alternative assets through interactive return-mechanism diagrams, yield sandboxes, and the portfolio-aware **ZeroLatency Copilot** AI.

---

## ⚡ Canonical Benchmark Demo Portfolio

When evaluating or clicking **"Continue with Demo"**, ZeroLatency Wealth initializes the canonical evaluation benchmark:

| Metric | Benchmark Value | Description |
|---|---|---|
| **Total Portfolio Value** | **₹8,42,500** | Live consolidated valuation |
| **Invested Capital Basis** | **₹7,95,000** | Net acquisition cost |
| **Unrealized Gain / P/L** | **+₹47,500 (+5.97%)** | Net cumulative returns |
| **Projected Annual Income** | **~₹37,362 (4.43% Yield)** | Passive cash flow from REITs, InvITs, and Bond coupons |
| **Total Holdings** | **13 Instruments** | Spanning 4 independent custody sources |

### Asset Allocation Breakdown
- **Equities (52.0% • ₹4,38,315):** Nifty 50 ETF, TCS, HDFC Bank, Reliance Industries *(Compounding Engine)*
- **Bonds (18.1% • ₹1,52,380):** 7.18% GS 2033 Sovereign Bond, NABARD AAA Infra Bond, L&T Finance Debenture *(Capital Preservation Anchor)*
- **REITs (14.9% • ₹1,25,435):** Embassy Office Parks REIT, Mindspace Business Parks, Brookfield India Real Estate Trust *(90% Commercial Rental Yield)*
- **InvITs (10.0% • ₹84,140):** PowerGrid InvIT (PGInvIT), IRB InvIT Fund *(Regulated Transmission & Highway Toll Yields)*
- **Other / Cash (5.0% • ₹42,230):** LiquidBeES overnight cash fund *(Liquidity Buffer)*

---

## 🎨 Design System & Visual Identity (Purple + Neon Fintech)

The user interface features a distinctive **Purple + Neon Fintech** design language:
- **Color Palette:** Deep Violet (`#7C3AED`), Electric Neon Purple (`#A855F7`), Midnight Violet (`#5B21B6`), and Fintech Indigo (`#6366F1`).
- **Complete Dual Themes:** Seamless Dark Mode (`#09090B` background, `#111113` surface) and Light Mode (`#FAF9FF` background, `#FFFFFF` cards) with smooth CSS transitions and `localStorage` persistence.
- **3D WebGL Financial Hero:** Interactive Three.js canvas featuring 70+ glowing nodes connected with distance-based lattice lines, mouse parallax dynamics, and `prefers-reduced-motion` detection.
- **Adaptive Visual Analytics:** Recharts Donut Allocation and 12-month trailing Area curves that dynamically adapt grid lines and tooltips to the active theme.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 + TypeScript
- **Tooling:** Vite 8 (Ultra-fast build & HMR)
- **Styling:** Vanilla CSS design tokens + Tailwind CSS v4
- **3D Visuals:** Three.js (WebGL financial network lattice)
- **Data Visualizations:** Recharts (Theme-adaptive Donut & Performance Area Charts)
- **Icons:** Lucide React

### Backend
- **Language & Framework:** Python 3.10+ (FastAPI 0.141)
- **Server:** Uvicorn ASGI
- **Data Validation:** Pydantic v2
- **Database:** SQLite local database (`zerolatency.db`) with relational integrity
- **AI Explanation Layer:** ZeroLatency Copilot service abstraction (includes deterministic fallback requiring zero external API keys)

---

## 🏛️ System Architecture

```
                            RETAIL INVESTOR / JUDGE
                                       ↓
                        REACT 19 FRONTEND TERMINAL
                 (Vite + Tailwind CSS v4 + Three.js 3D)
                                       ↓
                           FASTAPI GATEWAY & CORS
                                       ↓
         ┌─────────────────────────────┼─────────────────────────────┐
         ↓                             ↓                             ↓
AUTHENTICATION & SESSION        PORTFOLIO INGESTION          ANALYTICS & YIELD
  (1-Click Demo Login)          (Brokers A/B, CAS, CSV)            ENGINE
         ↓                             ↓                             ↓
DATA NORMALIZATION & SEBI CLASSIFICATION (Pillars: Equity, Bond, REIT, InvIT)
                                       ↓
                         ZERO LATENCY COPILOT
                   (Deterministic Awareness Engine)
                                       ↓
                        SQLITE LOCAL DATABASE
```

---

## 📁 Project Structure

```
ZeroLatencyWealth-HackOnTrack/
├── backend/
│   ├── main.py                     # FastAPI application endpoints & lifespan seeding
│   ├── database.py                 # SQLite schema creation & benchmark seeding logic
│   ├── models.py                   # Pydantic request & response schemas
│   └── services/
│       ├── auth_service.py         # Demo & session authentication service
│       ├── portfolio_service.py    # Summary, holdings query, and reset handlers
│       ├── analytics_service.py    # Multi-asset insights, income forecast & risk scoring
│       ├── copilot_service.py      # Deterministic AI education engine with advice guardrails
│       ├── import_service.py       # Simulated broker sync & CSV statement parser
│       └── goals_service.py        # Hypothetical goal milestones CRUD
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FinancialNetwork3D.tsx # Interactive Three.js WebGL hero animation
│   │   │   ├── Logo.tsx            # Futuristic ZL monogram brand mark
│   │   │   ├── Navbar.tsx          # Top bar with DEMO MODE badge, theme switch, & nav
│   │   │   ├── AssetDetailModal.tsx# Multi-Asset deep dive inspection modal
│   │   │   ├── CopilotDrawer.tsx   # Persistent slide-out AI assistant panel
│   │   │   └── ToastContainer.tsx  # User feedback alerts
│   │   ├── context/
│   │   │   └── AppContext.tsx      # Global state, theme persistence, and portfolio sync
│   │   ├── services/
│   │   │   └── api.ts              # Typed API client for FastAPI backend
│   │   ├── types/
│   │   │   └── index.ts            # TypeScript interfaces
│   │   ├── views/
│   │   │   ├── LandingPage.tsx     # Hero with 3D canvas, problem, and visual pipeline
│   │   │   ├── DashboardView.tsx   # Financial command center, Donut & Area charts
│   │   │   ├── UnifiedPortfolioView.tsx # Filterable multi-asset holdings table
│   │   │   ├── AssetExplorerView.tsx    # Beginner-friendly asset class guides & diagrams
│   │   │   ├── PortfolioInsightsView.tsx# AI observations, risk & income forecasts
│   │   │   ├── GoalsView.tsx       # Hypothetical financial milestones with progress bars
│   │   │   ├── LearningCenterView.tsx   # Academy, REIT vs InvIT, allocation sandbox
│   │   │   ├── PortfolioImportView.tsx  # Broker aggregation simulator & real CSV upload
│   │   │   ├── SecurityPrivacyView.tsx  # IMPLEMENTED vs CONCEPTUAL security matrix
│   │   │   ├── ArchitectureView.tsx     # Interactive 10-node full-stack architecture
│   │   │   ├── SettingsView.tsx    # Profile, currency toggle, theme mode, and exporter
│   │   │   └── AuthView.tsx        # 1-Click Demo login & credential forms
│   │   ├── App.tsx                 # Root application layout & view switcher
│   │   ├── main.tsx                # React entrypoint
│   │   └── index.css               # Design system & purple fintech styling tokens
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts              # Tailwind CSS plugin & backend API proxy
├── TRD.md                          # Technical Requirements Document
├── APP_FLOW.md                     # Application Flow Document
├── IMPLEMENTATION_PLAN.md          # 14-Phase Implementation Plan
├── TESTING.md                      # Testing & Verification Report
├── .env.example                    # Template environment variables
├── .gitignore                      # Git exclusion rules
└── README.md                       # Comprehensive project documentation
```

---

## 🚀 Setup & Installation Instructions

### 1. Prerequisites
- **Node.js** v18+ and **npm** v9+
- **Python** 3.10+ (with `pip`)
- **Git**

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
*(The application works out-of-the-box with default fallback values; no external API key is required).*

### 4. Backend Setup & Startup
Install Python dependencies and start the FastAPI ASGI server:
```bash
pip install fastapi uvicorn pydantic python-multipart httpx

# Start the FastAPI backend
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
```
- Backend live at: `http://127.0.0.1:8000`
- Swagger OpenAPI documentation: `http://127.0.0.1:8000/docs`

### 5. Frontend Setup & Startup
In a separate terminal:
```bash
cd frontend
npm install
npm run dev
```
- Frontend live at: `http://127.0.0.1:5173`

---

## 🧪 Demo Mode Instructions

1. Open `http://127.0.0.1:5173` in your browser.
2. Click **"Explore Demo"** on the hero banner, or navigate to Sign In and select **"Continue with Demo Mode"**.
3. The platform will automatically load the canonical benchmark portfolio (**₹8,42,500**).
4. Notice the persistent **`DEMO MODE`** glowing badge in the top navigation.
5. Toggle between **Dark Mode** and **Light Mode** using the sun/moon icon.
6. You can reset modified or newly imported holdings at any time by clicking the **"Reset Demo"** button.

---

## 📡 API Overview

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/demo` | Authenticate as 1-click Demo User with benchmark holdings |
| `POST` | `/api/auth/login` | Email/password session authentication |
| `POST` | `/api/auth/register` | New user registration |
| `GET` | `/api/portfolio/summary` | Retrieve total value, invested capital, P/L, yields, and allocations |
| `GET` | `/api/portfolio` | Retrieve unified holdings with query filters (`asset_type`, `source`, `search`) |
| `POST` | `/api/portfolio/reset` | Atomically reset demo data back to canonical benchmark |
| `GET` | `/api/assets` | Retrieve master reference catalog across Equities, Bonds, REITs, InvITs |
| `GET` | `/api/assets/{id}` | Detailed asset metadata, risk rating, and liquidity score |
| `GET` | `/api/insights` | Retrieve AI observations, concentration flags, and income projections |
| `GET` | `/api/goals` | List user hypothetical financial goals and progress |
| `POST` | `/api/goals` | Create a new hypothetical goal with target amount and horizon |
| `POST` | `/api/import/demo` | Simulate automated ingestion from Broker A, Broker B, or Depository |
| `POST` | `/api/import/csv` | Ingest and parse user-uploaded CSV statement |
| `POST` | `/api/copilot/chat` | Educational ZeroLatency Copilot query with portfolio context |

---

## 🏆 Hackathon Information
- **Event:** Hack on Track Round 1
- **Problem Statement:** PS2 — Super App for Unified Multi-Asset Investing & Awareness
- **Team Name:** ZERO LATENCY
- **Product:** ZERO LATENCY WEALTH
