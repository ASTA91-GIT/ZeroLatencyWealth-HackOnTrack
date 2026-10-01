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
- **Dependencies:** Phase 13
- **Verification:** Git tracking clean; remote repository synchronized.
- **Status:** **COMPLETE**
