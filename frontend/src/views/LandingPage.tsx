import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  ArrowRight,
  Layers,
  ShieldCheck,
  Cpu,
  BarChart3,
  Building,
  TrendingUp,
  Compass,
  FileSpreadsheet,
  CheckCircle2,
  Workflow
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setCurrentView, loginAsDemoUser, loading } = useApp();

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 selection:bg-cyan-500 selection:text-black">
      {/* Hero Section */}
      <section className="relative pt-20 pb-24 overflow-hidden border-b border-white/[0.06]">
        {/* Futuristic Ambient Glow Backgrounds */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-cyan-500/15 via-blue-600/10 to-purple-600/10 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Hackathon Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs font-semibold tracking-wide mb-8 shadow-[0_0_20px_rgba(0,242,254,0.15)]">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>HACK ON TRACK ROUND 1 — PS2 SUPER APP</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
            Your entire portfolio.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">
              Finally in one view.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            ZeroLatency Wealth brings equities, bonds, REITs and InvITs into one intelligent portfolio experience.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={loginAsDemoUser}
              disabled={loading}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-sm font-bold text-black bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 hover:from-cyan-300 hover:to-white shadow-[0_0_30px_rgba(0,242,254,0.4)] transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4 fill-black" />
              <span>Explore Demo</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setCurrentView('architecture')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-sm font-semibold text-slate-300 bg-white/[0.04] border border-white/10 hover:border-cyan-500/40 hover:text-white transition-all"
            >
              <Workflow className="w-4 h-4 text-cyan-400" />
              <span>See How It Works</span>
            </button>
          </div>

          {/* Live Data Simulation Disclaimer */}
          <p className="mt-4 text-[11px] text-slate-500">
            SIMULATION / DEMO DATA • No real bank or brokerage credentials required.
          </p>

          {/* Visual Pipeline Animation */}
          <div className="mt-16 p-8 rounded-2xl bg-[#0c101d]/80 border border-white/[0.08] backdrop-blur-xl max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
            <div className="text-left text-xs uppercase tracking-widest text-slate-400 font-semibold mb-6 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                ZeroLatency Ingestion & Normalization Engine
              </span>
              <span className="text-cyan-400 font-mono">AUTOMATED PIPELINE</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Step 1: Fragmented Sources */}
              <div className="space-y-2">
                <span className="text-[11px] text-slate-400 font-medium">1. FRAGMENTED SOURCES</span>
                <div className="space-y-2">
                  <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-xs font-mono text-slate-300 flex items-center justify-between">
                    <span>Broker A (Zerodha)</span>
                    <span className="text-[10px] text-blue-400">Equities / ETFs</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-xs font-mono text-slate-300 flex items-center justify-between">
                    <span>Broker B (Groww)</span>
                    <span className="text-[10px] text-purple-400">REITs</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-xs font-mono text-slate-300 flex items-center justify-between">
                    <span>Depository (CDSL)</span>
                    <span className="text-[10px] text-emerald-400">Govt Bonds</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-xs font-mono text-slate-300 flex items-center justify-between">
                    <span>CSV Statement</span>
                    <span className="text-[10px] text-amber-400">InvITs / Debentures</span>
                  </div>
                </div>
              </div>

              {/* Step 2: Normalization Engine */}
              <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-cyan-950/30 border border-cyan-500/30 relative">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 mb-3 shadow-[0_0_20px_rgba(0,242,254,0.3)]">
                  <Cpu className="w-6 h-6 animate-pulse" />
                </div>
                <span className="text-xs font-bold text-white tracking-wide">DATA NORMALIZATION</span>
                <span className="text-[10px] text-cyan-400 font-mono mt-1 text-center">
                  SEBI Scheme Schema • Deduplication • Yield Aggregation
                </span>
                <div className="mt-3 flex items-center gap-1.5 text-[10px] text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Zero Latency Sync</span>
                </div>
              </div>

              {/* Step 3: Unified Portfolio */}
              <div className="space-y-3 p-4 rounded-xl bg-white/[0.02] border border-emerald-500/30">
                <span className="text-[11px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  3. UNIFIED PORTFOLIO
                </span>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Benchmark Total:</span>
                    <span className="font-bold text-white font-mono">₹8,42,500</span>
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden flex">
                    <div style={{ width: '52%' }} className="bg-blue-400" title="Equities 52%" />
                    <div style={{ width: '18%' }} className="bg-emerald-400" title="Bonds 18%" />
                    <div style={{ width: '15%' }} className="bg-purple-400" title="REITs 15%" />
                    <div style={{ width: '10%' }} className="bg-amber-400" title="InvITs 10%" />
                    <div style={{ width: '5%' }} className="bg-cyan-400" title="Other 5%" />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 pt-1">
                    <span>4 Asset Classes</span>
                    <span className="text-emerald-400 font-semibold">+₹47,500 P/L (+5.97%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: The Fragmentation Problem */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-white/[0.06]">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs uppercase font-mono tracking-widest text-cyan-400 font-bold mb-3">
            THE RETAIL INVESTING CHALLENGE
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
            Why Multi-Asset Investing is Broken Today
          </h3>
          <p className="mt-4 text-slate-400 text-sm sm:text-base">
            Retail investors hold accounts across multiple brokers, CAS statements, and mutual fund portals with zero consolidated visibility.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-cyan-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="text-lg font-bold text-white">Fragmented Holdings</h4>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              Equities on Broker A, bonds on Depository portals, and REITs on Broker B. Investors cannot calculate accurate net worth or total yield.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-cyan-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h4 className="text-lg font-bold text-white">Equity Concentration Bias</h4>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              Over 85% of retail wealth in India is heavily concentrated in volatile individual stocks due to lack of accessible fixed-income and alternative products.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-cyan-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4">
              <Compass className="w-5 h-5" />
            </div>
            <h4 className="text-lg font-bold text-white">REIT & InvIT Blindspot</h4>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              Grade-A real estate and infrastructure cash flows offer 7%–10% yields with regular quarterly distributions, yet remain poorly understood by everyday retail investors.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: Understand Every Asset */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-white/[0.06]">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs uppercase font-mono tracking-widest text-cyan-400 font-bold mb-3">
            MULTI-ASSET AWARENESS
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
            Four Asset Classes. One Unified Framework.
          </h3>
          <p className="mt-4 text-slate-400 text-sm sm:text-base">
            ZeroLatency simplifies complex financial instruments into intuitive return mechanisms and cash flow models.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Equity */}
          <div className="p-5 rounded-2xl bg-[#0c101d] border border-blue-500/20 hover:border-blue-400/50 transition-all">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold">
              EQUITY (52%)
            </span>
            <h4 className="text-base font-bold text-white mt-3">Capital Compounding</h4>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Ownership shares in top domestic enterprises. Delivers capital appreciation and corporate dividends with higher market volatility.
            </p>
            <div className="mt-4 pt-3 border-t border-white/10 flex justify-between text-xs font-mono">
              <span className="text-slate-500">Yield:</span>
              <span className="text-blue-400">~1.2% - 2.1%</span>
            </div>
          </div>

          {/* Bond */}
          <div className="p-5 rounded-2xl bg-[#0c101d] border border-emerald-500/20 hover:border-emerald-400/50 transition-all">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
              BONDS (18%)
            </span>
            <h4 className="text-base font-bold text-white mt-3">Sovereign Defensive Anchor</h4>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Direct loans to the Government or AAA institutions. Guaranteed semi-annual coupon distributions and capital return upon maturity.
            </p>
            <div className="mt-4 pt-3 border-t border-white/10 flex justify-between text-xs font-mono">
              <span className="text-slate-500">Yield:</span>
              <span className="text-emerald-400">~7.18% - 8.15%</span>
            </div>
          </div>

          {/* REIT */}
          <div className="p-5 rounded-2xl bg-[#0c101d] border border-purple-500/20 hover:border-purple-400/50 transition-all">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-bold">
              REITs (15%)
            </span>
            <h4 className="text-base font-bold text-white mt-3">Commercial Real Estate</h4>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Institutional ownership of premier Grade-A corporate office parks. 90% of net rent distributed quarterly under SEBI mandate.
            </p>
            <div className="mt-4 pt-3 border-t border-white/10 flex justify-between text-xs font-mono">
              <span className="text-slate-500">Yield:</span>
              <span className="text-purple-400">~6.8% - 7.4%</span>
            </div>
          </div>

          {/* InvIT */}
          <div className="p-5 rounded-2xl bg-[#0c101d] border border-amber-500/20 hover:border-amber-400/50 transition-all">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
              InvITs (10%)
            </span>
            <h4 className="text-base font-bold text-white mt-3">Essential Infrastructure</h4>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Ownership of power transmission grids and national highway toll stretches with inflation-linked regulated tariff cash flows.
            </p>
            <div className="mt-4 pt-3 border-t border-white/10 flex justify-between text-xs font-mono">
              <span className="text-slate-500">Yield:</span>
              <span className="text-amber-400">~9.8% - 10.4%</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: AI-Powered Explanations & ZeroLatency Copilot */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-white/[0.06]">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#0c101d] via-[#121829] to-[#07090e] border border-cyan-500/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-bold mb-4">
                <Sparkles className="w-3.5 h-3.5 fill-cyan-400" />
                <span>INTELLIGENT FINANCIAL COPILOT</span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                Ask anything about your portfolio in plain English.
              </h3>
              <p className="mt-4 text-slate-400 text-sm sm:text-base leading-relaxed">
                ZeroLatency Copilot understands your exact multi-broker portfolio snapshot. Ask about asset classes, yield differences, or risk factors without intrusive buy/sell advice.
              </p>

              <div className="mt-6 space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>Answers "What is a REIT?" and "Explain InvITs simply"</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>Reports live portfolio allocation percentages and cash flows</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>Strict educational neutrality — zero personalized stock tips</span>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  onClick={loginAsDemoUser}
                  className="px-6 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black text-xs font-bold tracking-wide shadow-[0_0_20px_rgba(0,242,254,0.3)] transition-all cursor-pointer"
                >
                  Try Copilot with Demo Data
                </button>
              </div>
            </div>

            {/* Simulated Chat Dialogue Card */}
            <div className="p-5 rounded-2xl bg-[#07090e]/90 border border-white/10 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-white/10 text-slate-500 text-[10px]">
                <span>COPILOT SESSION</span>
                <span className="text-cyan-400">CONNECTED</span>
              </div>

              <div className="flex gap-2 justify-end">
                <div className="bg-cyan-600/30 border border-cyan-500/40 p-2.5 rounded-xl rounded-tr-none text-cyan-200">
                  What percentage of my portfolio is invested in REITs?
                </div>
              </div>

              <div className="flex gap-2 justify-start">
                <div className="bg-white/[0.04] border border-white/10 p-3 rounded-xl rounded-tl-none text-slate-300 space-y-1.5">
                  <p className="text-white font-semibold">
                    REITs represent approximately <span className="text-purple-400 font-bold">14.9% (₹1,25,435)</span> of your demo portfolio.
                  </p>
                  <p className="text-[11px] text-slate-400 font-sans">
                    You hold 3 commercial Grade-A real estate trusts across Broker A, Broker B, and CSV statements with an average indicative yield of 7.0%.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex gap-1.5 flex-wrap">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
                  "Explain InvITs simply."
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
                  "How are bonds different from equities?"
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div>
          © 2026 ZeroLatency Wealth • Hack on Track Round 1 Prototype
        </div>
        <div className="flex items-center gap-6">
          <button onClick={() => setCurrentView('architecture')} className="hover:text-cyan-400 transition-colors">
            System Architecture
          </button>
          <button onClick={() => setCurrentView('security')} className="hover:text-cyan-400 transition-colors">
            Security & Privacy
          </button>
          <button onClick={loginAsDemoUser} className="text-cyan-400 hover:underline">
            Launch Demo Mode
          </button>
        </div>
      </footer>
    </div>
  );
};
