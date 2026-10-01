# ZERO LATENCY WEALTH — Application Flow

> **"One Portfolio. Every Asset. Clearer Understanding."**  
> **Hack on Track Round 1 — Problem Statement 2 (PS2)**  
> **Repository:** [https://github.com/ASTA91-GIT/ZeroLatencyWealth-HackOnTrack](https://github.com/ASTA91-GIT/ZeroLatencyWealth-HackOnTrack)  
> **Source of Truth:** Current Codebase Implementation

---

## 1. High-Level Navigation & Flow Diagram

```
                                  LANDING PAGE (/)
                          (3D WebGL Network, Hero, Pipeline)
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 │                                               │
                 ▼                                               ▼
         [Explore Demo]                                   [Sign In / Register]
                 │                                               │
                 ▼                                               ▼
     Demo Authentication Flow                         Session Auth (JWT)
   (POST /api/auth/demo -> ₹8.42L)                               │
                 │                                               │
                 └───────────────────────┬───────────────────────┘
                                         ▼
                               FINANCIAL DASHBOARD
                         (KPIs, Donut & Area Curves)
                                         │
        ┌──────────────┬──────────────┬──┴───────────┬──────────────┬──────────────┐
        ▼              ▼              ▼              ▼              ▼              ▼
     UNIFIED         ASSET        PORTFOLIO      PORTFOLIO        GOALS &       LEARNING
    PORTFOLIO      EXPLORER       INSIGHTS        IMPORT        MILESTONES       CENTER
   (Holdings &    (4 Pillars &    (Risk/Yield   (Simulated &    (Simulated     (Sandbox &
   Deep Dives)     Mechanics)     Projections)   CSV Upload)     Targets)      Comparison)
        │              │                                                           │
        └───────┬──────┴───────────────────────────────────────────────────────────┘
                ▼
        ASSET DETAIL MODAL ─────────────► ZERO LATENCY COPILOT
      (Underlying Mechanics)              (Deterministic AI Assistant)
                │                                    │
                └──────────────────┬─────────────────┘
                                   ▼
                          GLOBAL SYSTEM VIEWS
                  ┌────────────────┴────────────────┐
                  ▼                                 ▼
         ARCHITECTURE VIEW               SECURITY & PRIVACY
      (10 Subsystems & JSON)             (Safeguards Matrix)
                  │                                 │
                  └────────────────┬────────────────┘
                                   ▼
                             SETTINGS VIEW
                    (Currency, Theme, Reset Benchmark)
```

---

## 2. Application Entry & Bootstrap Flow
1. **URL Request:** Evaluator visits `http://127.0.0.1:5173`.
2. **Context Initialization (`AppContext.tsx`):**
   - Retrieves stored theme from `localStorage` (`zl_theme`) or detects OS color scheme (`prefers-color-scheme: dark`).
   - Immediately attaches `.dark` class to `document.documentElement` to prevent white page flash.
   - Sets initial view to `'landing'`.
3. **Lifespan Startup (`backend/main.py`):**
   - Initializes SQLite tables via `init_db()`.
   - Seeds canonical ₹8,42,500 demo holdings via `seed_demo_data()`.

---

## 3. Landing Page Flow (`views/LandingPage.tsx`)
- **Hero Section:**
  - Eyebrow: `SMARTER WEALTH. ZERO FRICTION.`
  - Headline: `Your Wealth. Your Edge.`
  - Value Proposition: Consolidated multi-asset visibility and awareness across Equities, Sovereign Bonds, REITs, and InvITs.
  - Interactive Visual: High-performance Three.js WebGL financial network canvas (`FinancialNetwork3D.tsx`).
- **Primary Actions:**
  - `Explore Demo`: Triggers `loginAsDemoUser()`, transitions directly to `'dashboard'`.
  - `Explore Platform`: Smooth scrolls down to Platform Capabilities.
- **Section Breakdown:**
  1. *Hero with 3D Financial Network*
  2. *Market Fragmentation Dilemma*
  3. *4-Phase Ingestion & Normalization Pipeline*
  4. *Multi-Asset Class Educational Overview*
  5. *Live Terminal Statistics ($4.43\%$ average yield, ₹8.42L benchmark)*
  6. *Security & Privacy Principles*
  7. *Call to Action & Comprehensive Footer*

---

## 4. Authentication & Demo Mode Flow (`views/AuthView.tsx`)

### Demo Mode Flow (Primary Evaluator Path)
1. User clicks **"Continue with Demo Mode"**.
2. Frontend calls `api.getDemoUser()` $\rightarrow$ `POST /api/auth/demo`.
3. Backend retrieves demo user `demo-user-001`, generates session token, and returns user profile.
4. `AppContext` stores user state, triggers an informational toast (`"Signed in as Demo User: Alex Mercer"`), and automatically loads the Dashboard view.
5. Persistent **`DEMO MODE`** glowing badge activates in the Navbar with an instant **"Reset"** button.

### Registered User Flow
1. User inputs Name, Email, and Password $\rightarrow$ calls `POST /api/auth/register` or `POST /api/auth/login`.
2. Backend creates or verifies account in `users` table and issues a bearer token.

---

## 5. Dashboard Flow (`views/DashboardView.tsx`)
- **API Call:** On mount, triggers `api.getPortfolioSummary()` $\rightarrow$ `GET /api/portfolio/summary`.
- **Display Hierarchy:**
  1. **Tier 1 (Header):** Portfolio title, last updated timestamp, canonical reset button, and "View Holdings" link.
  2. **Tier 2 (KPI Metric Cards):**
     - Total Portfolio Value: `₹8,42,500` (+5.97% / +₹47,500 return).
     - Projected Annual Cash Flow: `₹37,362` (4.43% weighted yield).
     - Tracked Assets: `13 Instruments` across 4 custody sources.
     - Custody Sources: `Broker A (58%)`, `Broker B (24%)`, `Depository (18%)`.
  3. **Tier 3 (Visual Analytics Grid):**
     - **Donut Allocation Chart:** Recharts visualizer rendering Equities (52.0%), Bonds (18.1%), REITs (14.9%), InvITs (10.0%), and Cash (5.0%).
     - **Portfolio Growth Trajectory:** 12-month historical mark-to-market area curve with purple neon gradient fill.
  4. **Tier 4 (Multi-Asset Diversification Breakdown):** Explanatory cards detailing statutory distribution mechanics for each asset class.
  5. **Tier 5 (Consolidated Holdings Preview):** 5-row table preview with direct "Inspect" action.

---

## 6. Unified Portfolio Flow (`views/UnifiedPortfolioView.tsx`)
- **API Call:** Calls `api.getHoldings()` $\rightarrow$ `GET /api/portfolio`.
- **Filtering & Search:**
  - Asset class filter pills: `ALL`, `EQUITY`, `BOND`, `REIT`, `INVIT`, `OTHER`.
  - Source filter dropdown: `All Sources`, `Broker A`, `Broker B`, `Depository`, `Imported CSV`.
  - Real-time text search querying symbol, name, and sector.
- **Holdings Table Columns:**
  - Security Symbol & Company Name
  - Statutory Asset Class Badge (with color-coded pillars)
  - Custody Source Tag
  - Holding Units & Average Buy Price
  - Current Unit Market Price
  - Total Mark-to-Market Value
  - Unrealized Gain/Loss (₹ and %)
  - Indicated Annual Cash Flow Yield (%)
- **Actions:**
  - Clicking any holding row or "Inspect" opens the **Asset Detail Modal**.

---

## 7. Asset Detail Flow (`components/AssetDetailModal.tsx`)
- **Trigger:** Selected from Holdings table or Asset Explorer.
- **Data Displayed:**
  - Full instrument name, symbol, sector, and risk level.
  - Return Mechanism (e.g., "90% commercial office lease rentals distributed quarterly").
  - Liquidity score and current 24h market price change.
  - Live user holding status (units held, average cost, current value, total P/L).
- **Copilot Action:**
  - User can click **"Ask Copilot About This Asset"**, which immediately opens the Copilot drawer with the selected asset preloaded as context.

---

## 8. AI Copilot Flow (`components/CopilotDrawer.tsx`)

```
   USER QUESTION
         │
         ▼
  COPILOT DRAWER UI
  (Prompt input / Suggestion chips)
         │
         ▼
  HTTP POST /api/copilot/chat
  { message: "...", context_asset_id: "..." }
         │
         ▼
  BACKEND COPILOT ENGINE (copilot_service.py)
         │
         ├─────────────────────────────────────────────┐
         ▼                                             ▼
  [Advice Guardrail Triggered?]                [Holding Context Present?]
  ("should I buy/sell", "target price")        ("this asset", context_asset_id)
         │                                             │
         ▼                                             ▼
  Policy Notice (Anti-Advice Intercept)        Pulls exact units, cost & current value
         │                                             │
         └──────────────────────┬──────────────────────┘
                                ▼
                     [Knowledge Base Match]
              (REIT, InvIT, Equities vs Bonds, etc.)
                                │
                                ▼
                     [Educational Response]
               (Structured Markdown + Suggestions)
                                │
                                ▼
                    DISCLAIMER ATTACHMENT
            "SIMULATION / DEMO DATA — Educational only"
                                │
                                ▼
                         DRAWER RENDER
```

### Supported Topics & Sample Queries:
- *"What is a REIT?"* $\rightarrow$ Explains 90% mandatory SEBI distribution rules, commercial tech park leases, and quarterly dividend mechanics.
- *"Explain InvITs simply."* $\rightarrow$ Details highway toll collection, power grid concessions, and predictable tariffs.
- *"How are bonds different from equities?"* $\rightarrow$ Contrasts ownership equity upside with debt priority and capital preservation.
- *"Show my demo portfolio allocation."* $\rightarrow$ Dynamically outputs active portfolio weights, total value, and weighted annual yield.
- *"Should I buy more Reliance?"* $\rightarrow$ Intercepted by statutory anti-advice policy with a redirect to multi-asset education.

---

## 9. Portfolio Insights Flow (`views/PortfolioInsightsView.tsx`)
- **API Call:** `GET /api/insights`.
- **Sections:**
  - **Algorithmic Observations:** Quantitative analysis of current equity risk and fixed-income cushions.
  - **Risk Profiling:** Volatility index (Beta ~0.72 vs Nifty 50) and liquidity tiers.
  - **Cash Flow Projections:** Estimated annual passive income (~₹37,362) broken down by REIT distributions, InvIT payouts, bond coupons, and equity dividends.
  - **Concentration Risk Alerts:** Flags any individual security holding exceeding 20% of portfolio net worth.
  - **Historical MTM Performance:** 12-month trailing valuation trend line.

---

## 10. Portfolio Import Flow (`views/PortfolioImportView.tsx`)

### Simulated Automated Multi-Broker Sync
1. User selects a custody partner: `Broker A`, `Broker B`, or `Depository`.
2. Clicks **"Simulate Automated Aggregation"**.
3. Frontend triggers an animated 5-step status pipeline:  
   `CONNECTING` $\rightarrow$ `FETCHING` $\rightarrow$ `NORMALIZING` $\rightarrow$ `CLASSIFYING` $\rightarrow$ `READY`.
4. API call: `POST /api/import/demo` with `source_name`.
5. Backend pulls mock instruments, deduplicates against master assets, updates unit balances, and recalculates portfolio summary.
6. Success toast informs user of ingested holdings count.

### Client-Side CSV Statement Ingestion
1. User clicks **"Upload Broker CSV"** or drags and drops a CSV file.
2. Frontend reads file and posts `multipart/form-data` to `POST /api/import/csv`.
3. Backend validates required headers (`Symbol`, `Units`, `BuyPrice`, `CurrentPrice`, optional `AssetType`).
4. Normalizes ticker symbols and asset categories.
5. Persists new records into SQLite and returns the imported holdings list.
6. Portfolio summary and holdings tables update automatically.

---

## 11. Goals & Milestones Flow (`views/GoalsView.tsx`)
- **API Calls:** `GET /api/goals`, `POST /api/goals`, `DELETE /api/goals/{id}`.
- **Workflow:**
  - Evaluators can inspect preloaded hypothetical goals: Emergency Fund, Higher Education, Home Purchase.
  - Clicking **"Add Target Goal"** opens a modal to input Goal Title, Category, Target Capital (₹), Current Balance (₹), and Horizon (Months).
  - Cards visually depict the remaining funding gap and calculate the projected multi-asset cash flow contribution over the investment horizon.

---

## 12. Learning Center Flow (`views/LearningCenterView.tsx`)
- **Cross-Asset Comparison Matrix:** Side-by-side comparison of Equities vs Corporate Bonds vs REITs vs InvITs across Underlying Assets, Return Drivers, Statutory Distribution Mandates, Risk Profile, and Liquidity.
- **Interactive Multi-Asset Sandbox:**
  - Users adjust sliders for Equities, Bonds, REITs, and InvITs (constrained to sum to 100%).
  - Real-time client-side calculation models how the simulated portfolio's weighted annual yield shifts based on asset class mix.
- **Frequently Asked Questions:** Expandable accordion addressing SEBI unitholder rights, taxation, and minimum lot sizes.

---

## 13. System Architecture & Pipeline Flow (`views/ArchitectureView.tsx`)
- Interactive 10-node full-stack pipeline visualizer:
  1. *Retail Investor / Judge*
  2. *React 19 Frontend*
  3. *FastAPI REST Gateway*
  4. *Authentication & Session Manager*
  5. *Portfolio Aggregation Service*
  6. *Data Normalization Engine*
  7. *Asset Classification Engine*
  8. *Analytics & Diagnostics Engine*
  9. *AI Explanation Layer (Copilot)*
  10. *SQLite Persistence Layer*
- Clicking any node displays its technical responsibilities, stack dependencies, and live JSON diagnostic payloads.

---

## 14. Security & Privacy Architecture Flow (`views/SecurityPrivacyView.tsx`)
- Displays the **Safeguards Matrix**, explicitly separating:
  - **IMPLEMENTED (4):** Zero Broker Credential Exposure, Client Session Isolation, Local Sandboxed SQLite, Deterministic AI Anti-Advice Guardrails.
  - **CONCEPTUAL (3):** Production SEBI Account Aggregator (AA) Integration, AES-256-GCM At-Rest Database Encryption, Differential Privacy Peer Benchmarking.

---

## 15. Settings & Profile Flow (`views/SettingsView.tsx`)
- **Investor Profile:** Displays display name (`Alex Mercer`), email (`demo@zerolatency.invest`), and demo badge.
- **Display Preferences:**
  - Currency switch: `₹ INR` vs `$ USD` (simulated rate conversion).
  - Theme mode toggle: `Dark Theme` vs `Light Theme`.
- **JSON Export:** Download full portfolio snapshot as `zerolatency_portfolio_export.json`.
- **Canonical Reset Button:** Calls `POST /api/portfolio/reset`, resetting all newly imported holdings back to the canonical ₹8,42,500 benchmark.

---

## 16. Theme Flow
- Toggling theme via the Navbar Sun/Moon icon or Settings switches `theme` between `'dark'` and `'light'`.
- Immediately toggles `.dark` class on `document.documentElement` and stores preference in `localStorage`.
- All cards, borders, typography, tables, and Recharts charts adapt without reloading or flashing.

---

## 17. Error & Exception Flow
- **Network / API Failures:** Handled inside `api.ts` with error toasts (`"Failed to fetch portfolio summary"`, `"Failed to communicate with Copilot"`).
- **Form Validation:** Input requirements (positive numbers, valid emails, non-empty goal titles) prevent invalid requests before submission.
- **Invalid CSV Files:** Missing columns or corrupt formatting return explicit error banners explaining the expected CSV headers.

---

## 18. Logout / Reset Flow
- Clicking **"Reset Demo Data"** restores the database to its pristine benchmark state.
- Switching to custom accounts clears the demo token from memory and redirects to the sign-in screen.
