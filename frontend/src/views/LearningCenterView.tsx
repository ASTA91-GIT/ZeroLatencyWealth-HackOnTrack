import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  ChevronDown,
  Scale,
  Coins,
  Sliders,
  CheckCircle2
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
  const { setCurrentView } = useApp();

  const [activeTab, setActiveTab] = useState<'concepts' | 'comparisons' | 'simulator' | 'faqs'>('concepts');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="fintech-card p-6">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
            ZeroLatency Academy & Multi-Asset Center
          </h1>
        </div>
        <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 max-w-3xl leading-relaxed">
          Master multi-asset portfolio mechanics. Contrast equities, sovereign debt, commercial REITs, and infrastructure InvITs through interactive comparisons and sandbox simulators.
        </p>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-white/10 pb-3">
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
                ? 'bg-purple-600/10 dark:bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30 shadow-[0_0_12px_rgba(168,85,247,0.15)]'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/[0.03]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Core Fundamentals */}
      {activeTab === 'concepts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="fintech-card p-6 space-y-3 border-l-4 border-l-blue-500">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 border border-blue-500/20 font-bold uppercase">
              GROWTH INSTRUMENT
            </span>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">What is an Equity?</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
              Equities represent fractional enterprise ownership. By holding shares, you participate directly in corporate expansion and capital compounding. Over long horizons, equities historically outperform inflation but undergo periodic market corrections.
            </p>
            <div className="pt-2 flex items-center justify-between text-xs text-blue-600 dark:text-blue-300 border-t border-zinc-200 dark:border-white/10">
              <span>Primary Engine: Capital Appreciation</span>
              <span className="font-mono">Yield: ~1.2%</span>
            </div>
          </div>

          <div className="fintech-card p-6 space-y-3 border-l-4 border-l-emerald-500">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-300 border border-emerald-500/20 font-bold uppercase">
              DEBT SECURITY
            </span>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">What is a Bond?</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
              A bond is a loan extended by an investor to a government or corporation. The borrower commits to paying periodic fixed coupon interest (e.g. 7.18% semi-annually) and repaying 100% of the face value principal at maturity date.
            </p>
            <div className="pt-2 flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-300 border-t border-zinc-200 dark:border-white/10">
              <span>Primary Engine: Guaranteed Coupons</span>
              <span className="font-mono">Yield: ~7.2%</span>
            </div>
          </div>

          <div className="fintech-card p-6 space-y-3 border-l-4 border-l-purple-500">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300 border border-purple-500/20 font-bold uppercase">
              REAL ESTATE TRUST
            </span>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">What is a REIT?</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
              A REIT is an investment trust owning high-grade commercial real estate (IT parks, tech campuses, corporate office buildings). SEBI mandates that at least 90% of net rent collections must be distributed to investors quarterly.
            </p>
            <div className="pt-2 flex items-center justify-between text-xs text-purple-600 dark:text-purple-300 border-t border-zinc-200 dark:border-white/10">
              <span>Primary Engine: 90% Lease Rent Payouts</span>
              <span className="font-mono">Yield: ~7.0%</span>
            </div>
          </div>

          <div className="fintech-card p-6 space-y-3 border-l-4 border-l-amber-500">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-300 border border-amber-500/20 font-bold uppercase">
              INFRASTRUCTURE TRUST
            </span>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">What is an InvIT?</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
              An InvIT holds revenue-generating infrastructure assets (interstate power transmission networks, toll expressways). Cash flows are tied to regulated tariffs or vehicular tolls, distributed regularly with attractive yields.
            </p>
            <div className="pt-2 flex items-center justify-between text-xs text-amber-600 dark:text-amber-300 border-t border-zinc-200 dark:border-white/10">
              <span>Primary Engine: Essential Tariffs & Tolls</span>
              <span className="font-mono">Yield: ~10.2%</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Head-to-Head Comparisons */}
      {activeTab === 'comparisons' && (
        <div className="space-y-6">
          <div className="fintech-card p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">REIT vs. InvIT: Commercial Property vs Infrastructure</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400 font-mono">
                    <th className="py-2.5 px-3">Dimension</th>
                    <th className="py-2.5 px-3 text-purple-600 dark:text-purple-400 font-bold">REIT (Real Estate Trust)</th>
                    <th className="py-2.5 px-3 text-amber-600 dark:text-amber-400 font-bold">InvIT (Infrastructure Trust)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-white/5 text-zinc-700 dark:text-zinc-300">
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-white">Underlying Assets</td>
                    <td className="py-2.5 px-3">Grade-A IT parks, commercial office complexes, retail centers</td>
                    <td className="py-2.5 px-3">Power transmission grids, toll highways, gas pipelines, telecom towers</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-white">Cash Flow Nature</td>
                    <td className="py-2.5 px-3">Corporate office leases (contractual with 3-year escalation clauses)</td>
                    <td className="py-2.5 px-3">Regulated state power transmission tariffs & vehicular toll collections</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-white">Yield Range</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-purple-600 dark:text-purple-300">~6.5% – 7.5% per annum</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-amber-600 dark:text-amber-300">~9.5% – 11.0% per annum</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-white">Terminal Land Value</td>
                    <td className="py-2.5 px-3">High (commercial land and prime tech campuses tend to appreciate)</td>
                    <td className="py-2.5 px-3">Concession contracts amortize to zero at termination (20-30 years)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-white">Distribution Frequency</td>
                    <td className="py-2.5 px-3">Quarterly</td>
                    <td className="py-2.5 px-3">Quarterly or Semi-Annual</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="fintech-card p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">Equities vs. Bonds: Growth vs. Capital Preservation</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400 font-mono">
                    <th className="py-2.5 px-3">Dimension</th>
                    <th className="py-2.5 px-3 text-blue-600 dark:text-blue-400 font-bold">Equities (Shares)</th>
                    <th className="py-2.5 px-3 text-emerald-600 dark:text-emerald-400 font-bold">Bonds (Fixed Income)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-white/5 text-zinc-700 dark:text-zinc-300">
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-white">Relationship</td>
                    <td className="py-2.5 px-3">You are a partial owner of the company</td>
                    <td className="py-2.5 px-3">You are a lender to the government or corporate entity</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-white">Return Structure</td>
                    <td className="py-2.5 px-3">Unlimited capital compounding + discretionary dividends</td>
                    <td className="py-2.5 px-3">Predetermined contractual coupon payments + full principal at maturity</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-white">Capital Risk</td>
                    <td className="py-2.5 px-3">Moderate to high; subject to business cycles and market selloffs</td>
                    <td className="py-2.5 px-3">Virtually zero default risk on Sovereign Government of India bonds</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-white">Role in Portfolio</td>
                    <td className="py-2.5 px-3">Wealth generation & compounding engine</td>
                    <td className="py-2.5 px-3">Capital preservation anchor & volatility dampener</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Interactive Allocation Sandbox */}
      {activeTab === 'simulator' && (
        <div className="fintech-card p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                Interactive Multi-Asset Allocation Sandbox
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                Adjust the weights of Equities, Bonds, REITs, and InvITs to see how the overall estimated yield and cash flow behave.
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-zinc-500">Simulated Yield:</span>
              <p className="text-2xl font-black text-purple-600 dark:text-purple-400 font-mono">{simulatedYield}% / year</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-zinc-200 dark:border-white/10">
            {/* Sliders */}
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">Equities ({normalizedEq.toFixed(0)}%)</span>
                  <span className="text-zinc-500 font-mono">Compounding Engine</span>
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

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Bonds ({normalizedBd.toFixed(0)}%)</span>
                  <span className="text-zinc-500 font-mono">Sovereign Defensive Anchor</span>
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

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-purple-600 dark:text-purple-400 font-semibold">REITs ({normalizedRt.toFixed(0)}%)</span>
                  <span className="text-zinc-500 font-mono">Commercial Rental Cash Flow</span>
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

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-amber-600 dark:text-amber-400 font-semibold">InvITs ({normalizedIn.toFixed(0)}%)</span>
                  <span className="text-zinc-500 font-mono">Essential Utility Yields</span>
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

            {/* Sandbox Simulation Results */}
            <div className="p-5 rounded-xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/10 space-y-4 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-zinc-500">
                  Simulated Cash Flow on ₹10,00,000 Portfolio
                </h4>
                <div className="mt-3 space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-zinc-200 dark:border-white/5">
                    <span className="text-zinc-600 dark:text-zinc-400">Annual Estimated Cash Flow:</span>
                    <span className="font-mono font-bold text-zinc-900 dark:text-white">
                      {formatCurrency(1000000 * (Number(simulatedYield) / 100))}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-200 dark:border-white/5">
                    <span className="text-zinc-600 dark:text-zinc-400">Monthly Average Cash Flow:</span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency((1000000 * (Number(simulatedYield) / 100)) / 12)}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-200 dark:border-white/5">
                    <span className="text-zinc-600 dark:text-zinc-400">Volatility Dampening Index:</span>
                    <span className="font-mono text-purple-600 dark:text-purple-300 font-semibold">
                      {normalizedEq > 70 ? 'High Volatility' : normalizedEq > 40 ? 'Moderate & Balanced' : 'Defensive Yield'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-500/20 text-[11px] text-purple-800 dark:text-purple-200">
                Notice: Combining REITs and InvITs with Sovereign Bonds allows retail portfolios to maintain steady cash flow without liquidating equity positions during downturns.
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
                className="fintech-card overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-zinc-50 dark:hover:bg-white/[0.02]"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 font-bold uppercase">
                      {faq.category}
                    </span>
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-white">{faq.question}</h4>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${isOpen ? 'rotate-180 text-purple-500' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed border-t border-zinc-200 dark:border-white/[0.06] pt-3">
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
