import React, { useState } from 'react';
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
  Search,
  LogIn,
  UserPlus,
  ChevronRight,
  ShieldAlert,
  GraduationCap
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setCurrentView, loginAsDemoUser, loading, isAuthenticated } = useApp();
  const [quickSearch, setQuickSearch] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentView('markets');
  };

  const featuredAssets = [
    { symbol: 'NIFTYBEES', name: 'Nippon Nifty 50 ETF', type: 'EQUITY', price: '₹262.50', change: '+0.85%', yield: '1.2%' },
    { symbol: 'GS2033-718', name: '7.18% GS 2033 Sovereign Bond', type: 'BOND', price: '₹101.40', change: '+0.05%', yield: '7.18%' },
    { symbol: 'EMBASSY', name: 'Embassy Office Parks REIT', type: 'REIT', price: '₹375.00', change: '+0.90%', yield: '6.80%' },
    { symbol: 'PGINVIT', name: 'PowerGrid Infrastructure Trust', type: 'INVIT', price: '₹101.20', change: '+0.30%', yield: '10.40%' },
  ];

  return (
    <div className="space-y-24 pb-20 text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
      {/* 1. HERO SECTION WITH 3D INTERACTIVE NETWORK & PRIMARY CTAs */}
      <section className="relative pt-12 sm:pt-20 pb-16 overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-purple-600/10 dark:bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & Primary Call to Actions */}
          <div className="lg:col-span-6 space-y-6 text-left relative z-10">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-700 dark:text-purple-300 text-xs font-semibold tracking-wider uppercase font-mono">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              <span>THE ZERO LATENCY WEALTH OPERATING SYSTEM</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.08] text-zinc-900 dark:text-white">
              Smarter Wealth.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-500 dark:from-purple-400 dark:via-violet-400 dark:to-indigo-300">
                Zero Friction.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-xl">
              Unify equities, sovereign bonds, commercial REITs, and infrastructure InvITs into one real-time financial command center powered by private local AI.
            </p>

            {/* Primary Four CTAs (Requirement #1 & #41) */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setCurrentView('markets')}
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-[0_0_25px_rgba(139,92,246,0.35)] hover:shadow-[0_0_35px_rgba(139,92,246,0.5)] transform hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <Compass className="w-4 h-4 fill-white" />
                <span>Explore Markets</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCurrentView('signup')}
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-zinc-900 dark:text-white bg-zinc-100 dark:bg-white/[0.08] border border-zinc-200 dark:border-white/10 hover:border-purple-400 dark:hover:border-purple-500/40 hover:text-purple-600 transition-all cursor-pointer"
              >
                <UserPlus className="w-4 h-4 text-purple-500" />
                <span>Create Account</span>
              </button>

              <button
                onClick={() => setCurrentView('login')}
                className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:text-purple-600 dark:hover:text-purple-300 transition-all cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-zinc-400" />
                <span>Log In</span>
              </button>

              {/* Secondary Demo Mode CTA */}
              <button
                onClick={loginAsDemoUser}
                disabled={loading}
                className="flex items-center justify-center gap-1.5 px-4 py-3.5 rounded-xl text-xs font-mono font-bold text-purple-600 dark:text-purple-300 bg-purple-500/10 border border-purple-500/30 hover:bg-purple-500/20 transition-all cursor-pointer"
                title="1-Click Judge & Evaluation Demo Mode"
              >
                <Sparkles className="w-3.5 h-3.5 fill-current" />
                <span>Try Demo</span>
              </button>
            </div>

            {/* Quick Search Widget */}
            <form onSubmit={handleSearchSubmit} className="pt-2 max-w-md">
              <div className="relative">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search stocks, bonds, REITs, or InvITs (e.g. NIFTY, Embassy, 7.18% GS)..."
                  value={quickSearch}
                  onChange={(e) => setQuickSearch(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/10 focus:border-purple-500 rounded-xl pl-10 pr-24 py-2.5 text-xs text-zinc-900 dark:text-white focus:outline-none transition-all placeholder:text-zinc-400"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-purple-600 text-white font-bold text-[11px] hover:bg-purple-500 transition-all cursor-pointer"
                >
                  Explore
                </button>
              </div>
            </form>

            {/* Trust Badges */}
            <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-zinc-500 dark:text-zinc-400 font-mono">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                ₹10,00,000 Simulated Paper Capital
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-500" />
                Private Local Ollama AI (Zero Hosted Token Leakage)
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

      {/* 2. FEATURED STOCKS & LIVE MARKET PREVIEW (Requirement #1) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-purple-600 dark:text-purple-400 font-bold">
              MARKET DISCOVERY
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-white mt-1">
              Featured Instruments Across 4 Asset Pillars
            </h2>
          </div>
          <button
            onClick={() => setCurrentView('markets')}
            className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View Full Market Explorer</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredAssets.map((asset) => (
            <div
              key={asset.symbol}
              onClick={() => setCurrentView('markets')}
              className="p-5 rounded-2xl bg-white dark:bg-[#121118] border border-zinc-200 dark:border-white/[0.08] hover:border-purple-500/50 shadow-sm transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-base font-black text-zinc-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {asset.symbol}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30">
                  {asset.type}
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-1">
                {asset.name}
              </p>
              <div className="mt-4 flex items-baseline justify-between pt-3 border-t border-zinc-100 dark:border-white/[0.04]">
                <span className="text-lg font-bold font-mono text-zinc-900 dark:text-white">
                  {asset.price}
                </span>
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {asset.change}
                </span>
              </div>
              <div className="mt-2 text-[10px] font-mono text-purple-600 dark:text-purple-400">
                Indicative Yield: {asset.yield}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. MULTI-ASSET PILLARS EDUCATION (Requirement #1) */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-purple-600 dark:text-purple-400 font-bold">
            ARCHITECTURAL DIVERSIFICATION
          </span>
          <h2 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
            Beyond Pure Stocks. A Resilient Portfolio Engine.
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
            ZeroLatency Wealth models the 4 fundamental pillars regulated under Indian capital markets to protect and compound wealth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#121118] border border-blue-500/20 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              EQ
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">Equities & ETFs</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Long-term growth engine capturing corporate profit expansion and dividend income across broad bluechip indices.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#121118] border border-emerald-500/20 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              BD
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">Sovereign Bonds</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              RBI-backed sovereign debt and institutional AAA bonds providing guaranteed semi-annual coupons and capital preservation.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#121118] border border-purple-500/20 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              RT
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">Commercial REITs</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Fractional ownership of Grade-A IT parks. Mandatory 90% cash flow distribution delivers quarterly rental yields of 6.5–7.5%.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#121118] border border-amber-500/20 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              IN
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">Infrastructure InvITs</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Interstate power grids and toll highways generating inflation-linked tariffs with attractive 9.5–10.5% cash yields.
            </p>
          </div>
        </div>
      </section>

      {/* 4. LOCAL AI COPILOT PREVIEW SECTION (Requirement #1 & #15) */}
      <section className="p-8 sm:p-12 rounded-3xl bg-zinc-50 dark:bg-[#121118] border border-purple-500/30 shadow-2xl relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-600 dark:text-purple-300 text-xs font-mono font-bold">
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>PRIVATE LOCAL AI ENGINE (OLLAMA)</span>
            </div>
            <h2 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
              An AI Copilot That Respects Your Financial Privacy
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Unlike cloud services that transmit your financial net worth to external third-party vendors, ZeroLatency Wealth runs locally via <strong>Ollama</strong>. Ask arbitrary financial questions, analyze yields, or explore your portfolio without API token limits.
            </p>
            <div className="space-y-2 pt-2 text-xs text-zinc-700 dark:text-zinc-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-500" />
                <span>Zero external API token quotas or per-prompt cloud bills</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-500" />
                <span>Portfolio-aware context with safe guardrails against speculative tips</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-500" />
                <span>Instant fallback to deterministic financial engine when offline</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 p-5 rounded-2xl bg-white dark:bg-[#0c0b12] border border-zinc-200 dark:border-white/10 shadow-lg space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between text-[11px] text-zinc-400 border-b border-zinc-100 dark:border-white/10 pb-2">
              <span>PROMPT SIMULATION</span>
              <span className="text-purple-400">OLLAMA 3.1:8B</span>
            </div>
            <div className="p-2.5 rounded-lg bg-zinc-100 dark:bg-white/[0.04] text-zinc-900 dark:text-white">
              <strong className="text-purple-500">You:</strong> "Why are REIT yields higher than standard stocks?"
            </div>
            <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 text-zinc-800 dark:text-zinc-200 text-[11px] leading-relaxed">
              <strong className="text-purple-400 block mb-1">ZeroLatency Copilot:</strong>
              Under SEBI and international regulations, REITs must disburse at least 90% of net distributable cash flows to unitholders. Because they distribute contractual commercial rents directly rather than reinvesting capital into expansion, their dividend yields typically range between 6.5%–7.5%.
            </div>
          </div>
        </div>
      </section>

      {/* 5. ENTERPRISE SECURITY & DATA PRIVACY (Requirement #1 & #37) */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-bold">
            ZERO TRUST SECURITY
          </span>
          <h2 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
            Built from the Ground Up for Data Isolation
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#121118] border border-zinc-200 dark:border-white/10 space-y-2">
            <Lock className="w-6 h-6 text-purple-500" />
            <h4 className="text-sm font-bold text-zinc-900 dark:text-white">Argon2id Password Storage</h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              State-of-the-art memory-hard password hashing designed to withstand modern GPU/ASIC brute force attacks.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#121118] border border-zinc-200 dark:border-white/10 space-y-2">
            <ShieldCheck className="w-6 h-6 text-emerald-500" />
            <h4 className="text-sm font-bold text-zinc-900 dark:text-white">Strict Tenant Isolation</h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              User A never sees User B's portfolio or orders. User IDs are extracted strictly from cryptographic JWT sessions.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#121118] border border-zinc-200 dark:border-white/10 space-y-2">
            <Coins className="w-6 h-6 text-amber-500" />
            <h4 className="text-sm font-bold text-zinc-900 dark:text-white">Risk-Free Paper Trading</h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Real-time portfolio recalculations and simulated order execution without risking real money or requiring brokerage keys.
            </p>
          </div>
        </div>
      </section>

      {/* 6. BOTTOM CONVERSION SECTION */}
      <section className="text-center p-12 rounded-3xl bg-gradient-to-b from-purple-900/30 to-[#121118] border border-purple-500/30 space-y-6">
        <h2 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tight max-w-2xl mx-auto">
          Start Exploring Multi-Asset Markets with Zero Friction
        </h2>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-lg mx-auto">
          Join ZeroLatency Wealth today. Experience live market explorer, simulated paper trading, and local AI assistance.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => setCurrentView('signup')}
            className="px-8 py-3.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 shadow-[0_0_25px_rgba(168,85,247,0.4)] transition-all cursor-pointer"
          >
            Create Your Free Account
          </button>
          <button
            onClick={() => setCurrentView('markets')}
            className="px-7 py-3.5 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-white/[0.05] border border-zinc-200 dark:border-white/10 hover:border-purple-400 transition-all cursor-pointer"
          >
            Browse Public Markets
          </button>
        </div>
      </section>
    </div>
  );
};
