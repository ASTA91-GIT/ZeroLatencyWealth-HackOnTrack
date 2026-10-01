import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  ChevronDown,
  Scale,
  Coins,
  Sliders,
  CheckCircle2,
  Building,
  Shield,
  Activity,
  ArrowUpRight,
  Layers,
  TrendingUp,
  TrendingDown,
  Briefcase
} from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

const FAQS: FaqItem[] = [
  {
    question: 'How do REITs pay dividends or distributions to investors?',
    answer: 'Under SEBI regulations, REITs must disburse at least 90% of their net distributable cash flows. Tenants (like Amazon, Microsoft, IBM) pay rent on multi-year leases, and these lease payments are consolidated and disbursed directly into your bank account on a quarterly basis.',
    category: 'REITs'
  },
  {
    question: 'Are InvIT distributions taxable in India?',
    answer: 'InvIT and REIT distributions are typically split into three components: Interest, Dividend, and Return of Capital (amortization). Interest and dividend may be taxable depending on the SPV tax regime, while Return of Capital reduces your cost basis until exhausted.',
    category: 'InvITs'
  },
  {
    question: 'Why should I hold bonds when equities offer higher compounding?',
    answer: 'Equities can experience severe 20% to 50% drawdowns during bear markets or recessions. High-rated sovereign bonds provide guaranteed periodic coupon payments and capital preservation, acting as a financial stabilizer so you are never forced to sell equities at a market bottom.',
    category: 'Bonds'
  },
  {
    question: 'Can I sell my REIT or InvIT units whenever I want?',
    answer: 'Yes! Unlike physical real estate or toll booths that take months to liquidate, REITs and InvITs are listed on the National Stock Exchange (NSE) and BSE. You can buy or sell single units during regular trading hours with T+1 settlement.',
    category: 'Liquidity'
  }
];

export const LearningCenterView: React.FC = () => {
  const { holdings, setCurrentView, setSelectedMarketSymbol, openPaperTradeModal } = useApp();

  const [activeTab, setActiveTab] = useState<'concepts' | 'comparisons' | 'simulator' | 'faqs'>('concepts');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Group user's actual portfolio holdings by asset type (Requirement #18: Connect education to real holdings)
  const reitHoldings = holdings.filter((h) => h.asset_type?.toUpperCase() === 'REIT');
  const invitHoldings = holdings.filter((h) => h.asset_type?.toUpperCase() === 'INVIT');
  const bondHoldings = holdings.filter((h) => h.asset_type?.toUpperCase() === 'BOND');
  const equityHoldings = holdings.filter((h) => h.asset_type?.toUpperCase() === 'EQUITY');

  // Interactive Multi-Asset Allocation Sandbox state
  const [eqWeight, setEqWeight] = useState<number>(50);
  const [bdWeight, setBdWeight] = useState<number>(20);
  const [rtWeight, setRtWeight] = useState<number>(15);
  const [inWeight, setInWeight] = useState<number>(15);

  const totalWeight = eqWeight + bdWeight + rtWeight + inWeight;
  const normalizedEq = (eqWeight / totalWeight) * 100;
  const normalizedBd = (bdWeight / totalWeight) * 100;
  const normalizedRt = (rtWeight / totalWeight) * 100;
  const normalizedIn = (inWeight / totalWeight) * 100;

  // Estimated portfolio yield
  const simulatedYield = (
    (normalizedEq * 1.5 + normalizedBd * 7.2 + normalizedRt * 7.0 + normalizedIn * 10.2) / 100
  ).toFixed(2);

  const formatCurrency = (val: number) => {
    return '₹' + Math.round(val).toLocaleString('en-IN');
  };

  const handleOpenInstrument = (symbol: string) => {
    setSelectedMarketSymbol(symbol);
    setCurrentView('instrument-detail');
  };

  return (
    <div className="space-y-6 pb-20 text-zinc-100">
      {/* Header */}
      <div className="fintech-card p-6 border border-zinc-800 bg-[#09090B]">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-purple-400" />
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            ZeroLatency Academy & Multi-Asset Intelligence
          </h1>
        </div>
        <p className="text-xs text-zinc-400 mt-1 max-w-3xl leading-relaxed">
          Master multi-asset portfolio mechanics. Connect real market data, yield calculations, and cash flow structures directly to your personal holdings.
        </p>
      </div>

      {/* REQUIREMENT #18 & #19: YOUR CONTEXTUAL EXPOSURE */}
      {(reitHoldings.length > 0 || invitHoldings.length > 0 || bondHoldings.length > 0) && (
        <div className="fintech-card p-6 bg-[#121214] border border-purple-500/30 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-purple-400" />
              <h2 className="text-sm font-bold text-white tracking-tight uppercase">
                YOUR CONTEXTUAL PORTFOLIO EXPOSURE
              </h2>
            </div>
            <span className="text-[10px] font-mono text-purple-400">
              Live Holdings Connected to Education
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* REIT Exposure */}
            {reitHoldings.length > 0 && (
              <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-800/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-300 font-mono">YOUR REIT EXPOSURE</span>
                  <span className="text-[10px] text-zinc-400">{reitHoldings.length} assets</span>
                </div>
                <div className="space-y-1">
                  {reitHoldings.map((h) => (
                    <div
                      key={h.id}
                      onClick={() => handleOpenInstrument(h.symbol)}
                      className="flex items-center justify-between text-xs hover:text-purple-300 cursor-pointer"
                    >
                      <span className="font-mono font-bold text-white">{h.symbol} ({h.units} units)</span>
                      <span className="font-mono text-zinc-300">{formatCurrency(h.current_value)}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-purple-900/40 flex items-center justify-between text-[11px]">
                  <span className="text-zinc-400">Target Yield:</span>
                  <span className="text-purple-300 font-mono font-bold">~6.8% - 7.2%</span>
                </div>
              </div>
            )}

            {/* InvIT Exposure */}
            {invitHoldings.length > 0 && (
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300 font-mono">YOUR INVIT EXPOSURE</span>
                  <span className="text-[10px] text-zinc-400">{invitHoldings.length} assets</span>
                </div>
                <div className="space-y-1">
                  {invitHoldings.map((h) => (
                    <div
                      key={h.id}
                      onClick={() => handleOpenInstrument(h.symbol)}
                      className="flex items-center justify-between text-xs hover:text-amber-300 cursor-pointer"
                    >
                      <span className="font-mono font-bold text-white">{h.symbol} ({h.units} units)</span>
                      <span className="font-mono text-zinc-300">{formatCurrency(h.current_value)}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-amber-900/40 flex items-center justify-between text-[11px]">
                  <span className="text-zinc-400">Target Yield:</span>
                  <span className="text-amber-300 font-mono font-bold">~9.5% - 10.2%</span>
                </div>
              </div>
            )}

            {/* Sovereign Debt / Bond Exposure */}
            {bondHoldings.length > 0 && (
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-300 font-mono">YOUR BOND EXPOSURE</span>
                  <span className="text-[10px] text-zinc-400">{bondHoldings.length} assets</span>
                </div>
                <div className="space-y-1">
                  {bondHoldings.map((h) => (
                    <div
                      key={h.id}
                      onClick={() => handleOpenInstrument(h.symbol)}
                      className="flex items-center justify-between text-xs hover:text-emerald-300 cursor-pointer"
                    >
                      <span className="font-mono font-bold text-white">{h.symbol} ({h.units} units)</span>
                      <span className="font-mono text-zinc-300">{formatCurrency(h.current_value)}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-emerald-900/40 flex items-center justify-between text-[11px]">
                  <span className="text-zinc-400">Coupon Rate:</span>
                  <span className="text-emerald-300 font-mono font-bold">~7.18% Guaranteed</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
        {[
          { id: 'concepts', label: 'Core Fundamentals' },
          { id: 'comparisons', label: 'Head-to-Head Comparisons' },
          { id: 'simulator', label: 'Allocation Sandbox' },
          { id: 'faqs', label: 'Knowledge Base FAQs' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-purple-950/60 text-purple-300 border border-purple-500/40 shadow-[0_0_12px_rgba(168,85,247,0.15)]'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Core Fundamentals with Live Market Data (Requirement #19) */}
      {activeTab === 'concepts' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* REIT Module */}
            <div className="fintech-card p-6 space-y-3 border-l-4 border-l-purple-500 bg-[#121214] border border-zinc-800">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-bold uppercase">
                  REAL ESTATE INVESTMENT TRUST (REIT)
                </span>
                <span className="text-[10px] font-mono text-zinc-500">SEBI Regulated</span>
              </div>
              <h3 className="text-base font-bold text-white">What is a REIT & How it Generates Income</h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                A REIT owns Grade-A commercial real estate campuses leased to Fortune 500 multinationals. By SEBI mandate, <strong>90% of net rent collections must be disbursed to unit-holders</strong> every quarter.
              </p>

              <div className="space-y-1.5 pt-1 text-xs">
                <div className="flex items-center gap-2 text-zinc-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                  <span><strong>Distributions:</strong> Quarterly dividends + interest + return of capital.</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                  <span><strong>Liquidity:</strong> Traded intraday on NSE & BSE with T+1 rolling settlement.</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                  <span><strong>Risks:</strong> Tenant vacancy rates, commercial refinancing interest costs.</span>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between text-xs text-purple-300 border-t border-zinc-800">
                <span>Top Listed: EMBASSY, MINDSPACE, BROOKFIELD</span>
                <button
                  onClick={() => setCurrentView('markets')}
                  className="hover:underline flex items-center gap-0.5 font-bold"
                >
                  <span>Trade REITs</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* InvIT Module */}
            <div className="fintech-card p-6 space-y-3 border-l-4 border-l-amber-500 bg-[#121214] border border-zinc-800">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-bold uppercase">
                  INFRASTRUCTURE INVESTMENT TRUST (INVIT)
                </span>
                <span className="text-[10px] font-mono text-zinc-500">SEBI Regulated</span>
              </div>
              <h3 className="text-base font-bold text-white">What is an InvIT & Essential Tolls / Tariffs</h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                InvITs hold essential utility and infrastructure assets like inter-state electricity transmission networks and operational toll highways. Cash flows are guaranteed through regulated government availability tariffs.
              </p>

              <div className="space-y-1.5 pt-1 text-xs">
                <div className="flex items-center gap-2 text-zinc-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  <span><strong>Distributions:</strong> High yields (~9.5% to 11%) paid semi-annually or quarterly.</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  <span><strong>Defensive Cash Flow:</strong> Independent of stock market volatility or corporate earnings.</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  <span><strong>Risks:</strong> Concession expiration periods, interest rate fluctuations.</span>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between text-xs text-amber-300 border-t border-zinc-800">
                <span>Top Listed: POWERGRID InvIT, IRB InvIT</span>
                <button
                  onClick={() => setCurrentView('markets')}
                  className="hover:underline flex items-center gap-0.5 font-bold"
                >
                  <span>Trade InvITs</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Sovereign Debt / Bond Module */}
            <div className="fintech-card p-6 space-y-3 border-l-4 border-l-emerald-500 bg-[#121214] border border-zinc-800">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold uppercase">
                  SOVEREIGN & CORPORATE DEBT (BONDS)
                </span>
                <span className="text-[10px] font-mono text-zinc-500">RBI Regulated</span>
              </div>
              <h3 className="text-base font-bold text-white">What is a Sovereign Bond & Coupon Mechanics</h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                A Government Security (G-Sec) is backed by the sovereign faith of the Reserve Bank of India. It pays a fixed semi-annual coupon and guarantees 100% principal repayment at redemption, eliminating credit default risk.
              </p>

              <div className="space-y-1.5 pt-1 text-xs">
                <div className="flex items-center gap-2 text-zinc-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span><strong>Guaranteed Coupon:</strong> E.g., 7.18% annual yield paid predictably on fixed dates.</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span><strong>Drawdown Anchor:</strong> Bonds buffer equity market crashes, reducing overall portfolio volatility.</span>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between text-xs text-emerald-300 border-t border-zinc-800">
                <span>Benchmarks: GS2033, NABARD AAA</span>
                <button
                  onClick={() => setCurrentView('markets')}
                  className="hover:underline flex items-center gap-0.5 font-bold"
                >
                  <span>View G-Secs</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Equity & ETF Module */}
            <div className="fintech-card p-6 space-y-3 border-l-4 border-l-blue-500 bg-[#121214] border border-zinc-800">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-bold uppercase">
                  EQUITIES & INDEX ETFS
                </span>
                <span className="text-[10px] font-mono text-zinc-500">NSE / BSE</span>
              </div>
              <h3 className="text-base font-bold text-white">What is an Equity & Compounding Trajectory</h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Equities represent ownership stakes in productive enterprises. While subject to short-term volatility, long-term compounding historically beats inflation, acting as the primary wealth-generation engine.
              </p>

              <div className="space-y-1.5 pt-1 text-xs">
                <div className="flex items-center gap-2 text-zinc-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                  <span><strong>Capital Appreciation:</strong> Corporate earnings growth expands enterprise valuation.</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                  <span><strong>Broad Diversification:</strong> NIFTY 50 and SENSEX ETFs eliminate single-company risk.</span>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between text-xs text-blue-300 border-t border-zinc-800">
                <span>Core: NIFTYBEES, RELIANCE, TCS</span>
                <button
                  onClick={() => setCurrentView('markets')}
                  className="hover:underline flex items-center gap-0.5 font-bold"
                >
                  <span>Browse Equities</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Head-to-Head Comparisons */}
      {activeTab === 'comparisons' && (
        <div className="space-y-6">
          <div className="fintech-card p-6 space-y-4 bg-[#121214] border border-zinc-800">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-purple-400" />
              <h3 className="text-base font-bold text-white">REIT vs. InvIT: Commercial Property vs Infrastructure</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-400 font-mono">
                    <th className="py-2.5 px-3">Dimension</th>
                    <th className="py-2.5 px-3 text-purple-400 font-bold">REIT (Real Estate Trust)</th>
                    <th className="py-2.5 px-3 text-amber-400 font-bold">InvIT (Infrastructure Trust)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-white">Underlying Assets</td>
                    <td className="py-2.5 px-3">Grade-A IT parks, commercial office complexes, retail centers</td>
                    <td className="py-2.5 px-3">Power transmission grids, toll highways, gas pipelines, telecom towers</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-white">Cash Flow Nature</td>
                    <td className="py-2.5 px-3">Corporate office leases (contractual with 3-year escalation clauses)</td>
                    <td className="py-2.5 px-3">Regulated state power transmission tariffs & vehicular toll collections</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-white">Yield Range</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-purple-300">~6.5% – 7.5% per annum</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-amber-300">~9.5% – 11.0% per annum</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-white">Capital Appreciation</td>
                    <td className="py-2.5 px-3">Moderate-to-High (land and commercial property replacement values rise)</td>
                    <td className="py-2.5 px-3">Low-to-Moderate (infrastructure depreciates over concession term)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-white">Distribution Frequency</td>
                    <td className="py-2.5 px-3 font-mono">Quarterly (Mandatory 90% payout)</td>
                    <td className="py-2.5 px-3 font-mono">Semi-annually or Quarterly</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Interactive Sandbox */}
      {activeTab === 'simulator' && (
        <div className="fintech-card p-6 space-y-6 bg-[#121214] border border-zinc-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-purple-400" />
              <h3 className="text-base font-bold text-white">
                Multi-Asset Allocation Sandbox Simulator
              </h3>
            </div>
            <span className="text-xs font-mono text-purple-400 font-bold">
              Blended Yield: {simulatedYield}% / yr
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-blue-400 font-semibold">Equities ({normalizedEq.toFixed(0)}%)</span>
                  <span className="font-mono text-zinc-400">Target Growth: 12% - 15%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={eqWeight}
                  onChange={(e) => setEqWeight(Number(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-emerald-400 font-semibold">Bonds ({normalizedBd.toFixed(0)}%)</span>
                  <span className="font-mono text-zinc-400">Coupon Yield: 7.2%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={bdWeight}
                  onChange={(e) => setBdWeight(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-purple-400 font-semibold">REITs ({normalizedRt.toFixed(0)}%)</span>
                  <span className="font-mono text-zinc-400">Rental Yield: 7.0%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={rtWeight}
                  onChange={(e) => setRtWeight(Number(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-amber-400 font-semibold">InvITs ({normalizedIn.toFixed(0)}%)</span>
                  <span className="font-mono text-zinc-400">Distribution Yield: 10.2%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={inWeight}
                  onChange={(e) => setInWeight(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
              <span className="text-xs font-bold text-white block">Projected 10-Lakh Portfolio Cash Flow</span>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-zinc-800">
                  <span className="text-zinc-400">Projected Annual Cash Inflow:</span>
                  <span className="font-mono font-bold text-white">
                    {formatCurrency(1000000 * (Number(simulatedYield) / 100))}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-800">
                  <span className="text-zinc-400">Monthly Average Cash Flow:</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {formatCurrency((1000000 * (Number(simulatedYield) / 100)) / 12)}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-800">
                  <span className="text-zinc-400">Volatility Dampening Index:</span>
                  <span className="font-mono text-purple-300 font-semibold">
                    {normalizedEq > 70 ? 'High Volatility' : normalizedEq > 40 ? 'Moderate & Balanced' : 'Defensive Yield'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Knowledge Base FAQs */}
      {activeTab === 'faqs' && (
        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="fintech-card overflow-hidden transition-all bg-[#121214] border border-zinc-800"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-zinc-900/60"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-bold uppercase">
                      {faq.category}
                    </span>
                    <h4 className="text-sm font-bold text-white">{faq.question}</h4>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${isOpen ? 'rotate-180 text-purple-400' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-zinc-300 leading-relaxed border-t border-zinc-800 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
