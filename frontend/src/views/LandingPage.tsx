import React from 'react';
import { useApp } from '../context/AppContext';
import { FinancialNetwork3D } from '../components/FinancialNetwork3D';
import {
  Sparkles,
  ArrowRight,
  Layers,
  ShieldCheck,
  Cpu,
  BarChart3,
  TrendingUp,
  Compass,
  CheckCircle2,
  Workflow,
  Lock,
  Building,
  Coins,
  ChevronRight
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setCurrentView, loginAsDemoUser, loading } = useApp();

  return (
    <div className="space-y-24 pb-20 text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
      {/* 1. HERO SECTION WITH 3D INTERACTIVE NETWORK */}
      <section className="relative pt-12 sm:pt-20 pb-16 overflow-hidden">
        {/* Subtle ambient lighting */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-purple-600/10 dark:bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-6 space-y-6 text-left relative z-10">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-700 dark:text-purple-300 text-xs font-semibold tracking-wider uppercase font-mono">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              <span>SMARTER WEALTH. ZERO FRICTION.</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.08] text-zinc-900 dark:text-white">
              Your Wealth.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-500 dark:from-purple-400 dark:via-violet-400 dark:to-indigo-300">
                Your Edge.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-xl">
              ZeroLatency Wealth unifies equities, sovereign bonds, commercial REITs, and infrastructure InvITs into one real-time financial command center.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={loginAsDemoUser}
                disabled={loading}
                className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-[0_0_25px_rgba(139,92,246,0.35)] hover:shadow-[0_0_35px_rgba(139,92,246,0.5)] transform hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 fill-white" />
                <span>Get Started — Explore Demo</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCurrentView('architecture')}
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/10 hover:border-purple-400 dark:hover:border-purple-500/40 hover:text-purple-600 dark:hover:text-white transition-all cursor-pointer"
              >
                <Workflow className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Explore Platform</span>
              </button>
            </div>

            {/* Quick trust metrics */}
            <div className="pt-4 flex items-center gap-6 text-xs text-zinc-500 dark:text-zinc-400 font-mono">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                ₹8,42,500 Canonical Benchmark
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-500" />
                4 SEBI Asset Pillars
              </span>
            </div>
          </div>

          {/* Right Column: 3D Interactive Financial Network Visual */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            <div className="w-full h-[440px] sm:h-[500px] rounded-3xl border border-zinc-200/80 dark:border-white/[0.08] bg-zinc-50/50 dark:bg-[#121118]/70 backdrop-blur-xl relative overflow-hidden shadow-2xl">
              {/* Top status bar inside 3D canvas */}
              <div className="absolute top-4 left-5 right-5 z-20 flex items-center justify-between text-[11px] font-mono">
                <span className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
                  <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
                  REAL-TIME MULTI-ASSET TOPOLOGY
                </span>
                <span className="text-purple-600 dark:text-purple-400 font-bold">LIVE 3D WEBGL</span>
              </div>

              {/* The 3D Three.js Component */}
              <FinancialNetwork3D />

              {/* Bottom interactive badge */}
              <div className="absolute bottom-4 left-5 right-5 z-20 flex items-center justify-between text-[10px] text-zinc-500 dark:text-zinc-400 border-t border-zinc-200/60 dark:border-white/10 pt-2 font-mono">
                <span>Interactive • Hover to rotate mesh</span>
                <span className="text-purple-600 dark:text-purple-300">Equities • Bonds • REITs • InvITs</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE FRAGMENTATION PROBLEM SECTION */}
      <section className="space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs uppercase font-mono tracking-widest text-purple-600 dark:text-purple-400 font-bold">
            THE RETAIL INVESTING CHALLENGE
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Why Multi-Asset Awareness is Broken Today
          </h2>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Retail investors typically manage fragmented broker accounts with near-total concentration in equities, leaving stable alternative yields undiscovered.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="fintech-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">Fragmented Custody</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Equities on Broker A, REITs on Broker B, and Sovereign Bonds in depository records. Investors cannot calculate total net worth or unified cash flows.
            </p>
          </div>

          <div className="fintech-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-600 dark:text-violet-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">Single-Asset Concentration</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Over 85% of retail wealth is heavily concentrated in volatile stocks, making portfolios vulnerable to market drawdowns without defensive anchors.
            </p>
          </div>

          <div className="fintech-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Coins className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">Alternative Yield Blindspot</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Grade-A commercial REITs and infrastructure InvITs disburse 90% of net cash flow (6.5%–10.5% yields), yet remain misunderstood by everyday investors.
            </p>
          </div>
        </div>
      </section>

      {/* 3. HOW ZERO LATENCY WORKS (4-STEP PIPELINE) */}
      <section className="fintech-card p-8 sm:p-10 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-white/10 pb-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-purple-600 dark:text-purple-400 font-bold">
              INGESTION & INTELLIGENCE PIPELINE
            </span>
            <h3 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight mt-1">
              How ZeroLatency Normalizes Your Wealth
            </h3>
          </div>
          <button
            onClick={() => setCurrentView('architecture')}
            className="flex items-center gap-1.5 text-xs text-purple-600 dark:text-purple-400 font-bold hover:underline cursor-pointer"
          >
            <span>Interactive Architecture Map</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 space-y-2">
            <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400 font-bold">PHASE 01</span>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-white">Multi-Source Ingestion</h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Pulls holdings from Broker A, Broker B, Central Depositories (CDSL/NSDL), and CSV statements.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 space-y-2">
            <span className="text-[10px] font-mono text-violet-600 dark:text-violet-400 font-bold">PHASE 02</span>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-white">Data Normalization</h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Standardizes disparate tickers, lots, denominations, and acquisition cost bases into a uniform schema.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 space-y-2">
            <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 font-bold">PHASE 03</span>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-white">SEBI Classification</h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Accurately categorizes instruments into Equities, Sovereign Debt, Commercial REITs, and InvITs.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 space-y-2">
            <span className="text-[10px] font-mono text-purple-600 dark:text-purple-300 font-bold">PHASE 04</span>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-white">Copilot Awareness</h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
              ZeroLatency Copilot synthesizes live holdings to explain distributions, risk factors, and mechanics.
            </p>
          </div>
        </div>
      </section>

      {/* 4. UNDERSTAND EVERY ASSET (FOUR PILLARS) */}
      <section className="space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs uppercase font-mono tracking-widest text-purple-600 dark:text-purple-400 font-bold">
            MULTI-ASSET UNIFICATION
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight">
            Four Essential Pillars of Modern Wealth
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Equity */}
          <div className="fintech-card p-5 space-y-3 border-l-4 border-l-blue-500">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 border border-blue-500/20">
                EQUITY (52%)
              </span>
              <span className="text-xs font-mono font-bold text-blue-500">~1.5% Yield</span>
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">Capital Compounding</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Ownership stakes in premier bluechip enterprises driving multi-year capital compounding.
            </p>
          </div>

          {/* Bonds */}
          <div className="fintech-card p-5 space-y-3 border-l-4 border-l-emerald-500">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-300 border border-emerald-500/20">
                BONDS (18%)
              </span>
              <span className="text-xs font-mono font-bold text-emerald-500">~7.2% Yield</span>
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">Sovereign Debt Anchor</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Guaranteed semi-annual coupon distributions and capital preservation backed by RBI / Sovereign debt.
            </p>
          </div>

          {/* REITs */}
          <div className="fintech-card p-5 space-y-3 border-l-4 border-l-purple-500">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300 border border-purple-500/20">
                REITs (15%)
              </span>
              <span className="text-xs font-mono font-bold text-purple-500">~7.0% Yield</span>
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">Commercial Tech Parks</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Institutional ownership of Grade-A office campuses leased to Fortune 500 multinationals with 90% payout.
            </p>
          </div>

          {/* InvITs */}
          <div className="fintech-card p-5 space-y-3 border-l-4 border-l-amber-500">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-300 border border-amber-500/20">
                InvITs (10%)
              </span>
              <span className="text-xs font-mono font-bold text-amber-500">~10.2% Yield</span>
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">Essential Utilities</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Regulated transmission power grids and national expressways delivering inflation-linked cash flows.
            </p>
          </div>
        </div>
      </section>

      {/* 5. DASHBOARD PREVIEW & COPILOT HIGHLIGHT */}
      <section className="fintech-card p-8 sm:p-12 space-y-8 relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/25 font-bold uppercase">
              ZERO LATENCY COPILOT
            </span>
            <h3 className="text-3xl font-black text-zinc-900 dark:text-white leading-tight">
              An intelligent awareness partner for your entire portfolio.
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              Ask questions about your holdings in natural language. Copilot understands your exact multi-broker balance, explains distribution mechanics, and observes concentration risks without offering speculative advice.
            </p>

            <div className="space-y-2 text-xs text-zinc-700 dark:text-zinc-300 pt-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Deterministic educational fallback — runs 100% offline without API keys</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Strict anti-advice guardrail — neutral awareness instead of stock recommendations</span>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={loginAsDemoUser}
                className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-[0_0_20px_rgba(139,92,246,0.35)] transition-all cursor-pointer"
              >
                Try Copilot in Demo Mode
              </button>
            </div>
          </div>

          {/* Interactive Simulated Copilot Dialogue Card */}
          <div className="p-6 rounded-2xl bg-zinc-900 text-zinc-100 border border-purple-500/30 space-y-4 font-mono text-xs shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 text-[10px] text-zinc-400">
              <span>COPILOT SESSION CONTEXT</span>
              <span className="text-purple-400 font-bold">₹8,42,500 BENCHMARK</span>
            </div>

            <div className="flex justify-end">
              <div className="bg-purple-600/30 border border-purple-500/40 p-3 rounded-xl rounded-tr-none text-purple-200">
                What percentage of my portfolio is in commercial REITs?
              </div>
            </div>

            <div className="flex justify-start">
              <div className="bg-white/[0.05] border border-white/10 p-3.5 rounded-xl rounded-tl-none space-y-2 text-zinc-300">
                <p className="font-semibold text-white">
                  REIT exposure accounts for approximately <span className="text-purple-400 font-bold">14.9% (₹1,25,435)</span> of your demo holdings.
                </p>
                <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
                  You hold 3 institutional commercial real estate trusts across Broker A, Broker B, and CSV statements with an average indicative yield of 7.0%.
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-2 text-[10px]">
              <span className="px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800">
                "Explain InvITs simply"
              </span>
              <span className="px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800">
                "Bonds vs Equities"
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION & FOOTER */}
      <section className="text-center py-12 space-y-6">
        <h3 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white">
          Ready to experience frictionless multi-asset wealth?
        </h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-lg mx-auto">
          Explore the complete working prototype with preloaded benchmark demo data.
        </p>

        <div>
          <button
            onClick={loginAsDemoUser}
            className="px-8 py-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-[0_0_30px_rgba(139,92,246,0.4)] transition-all cursor-pointer"
          >
            Launch Interactive Demo Mode
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-10 border-t border-zinc-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 dark:text-zinc-400">
        <div>
          © 2026 ZeroLatency Wealth • Hack on Track Round 1 Prototype
        </div>
        <div className="flex items-center gap-6">
          <button onClick={() => setCurrentView('architecture')} className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
            Architecture
          </button>
          <button onClick={() => setCurrentView('security')} className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
            Security & Privacy
          </button>
          <button onClick={loginAsDemoUser} className="text-purple-600 dark:text-purple-400 font-bold hover:underline">
            Launch Demo
          </button>
        </div>
      </footer>
    </div>
  );
};
