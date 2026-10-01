import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Compass,
  Building,
  TrendingUp,
  Shield,
  Coins,
  Sparkles,
  ArrowRight,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Briefcase,
  Zap,
  ChevronRight
} from 'lucide-react';

interface AssetCategoryDetail {
  id: string;
  name: string;
  badge: string;
  tagline: string;
  accentColor: string;
  whatIsIt: string;
  howItWorks: string[];
  returnsEngine: {
    capitalGains: string;
    regularIncome: string;
    typicalYield: string;
  };
  characteristics: Array<{ label: string; value: string }>;
  liquidity: {
    level: string;
    description: string;
  };
  risks: string[];
  useCases: string[];
  diagram: {
    step1: string;
    step2: string;
    step3: string;
    distribution: string;
  };
}

const CATEGORIES: AssetCategoryDetail[] = [
  {
    id: 'REIT',
    name: 'Real Estate Investment Trusts (REITs)',
    badge: 'COMMERCIAL REAL ESTATE',
    tagline: 'Own fractional shares of Grade-A tech parks and institutional office towers.',
    accentColor: 'border-purple-500/40 bg-purple-500/10 text-purple-400',
    whatIsIt: 'A REIT is an investment vehicle that pools capital from retail investors to own, operate, and finance prime commercial properties (like IT parks leased to Microsoft, Google, IBM).',
    howItWorks: [
      'The Trust acquires prime commercial real estate with long-term tenant agreements (typically 5 to 15-year leases).',
      'Tenants pay contractual monthly lease rentals with built-in periodic escalation clauses (10–15% every 3 years).',
      'SEBI mandates that at least 90% of net distributable cash flows must be paid out to unitholders regularly (typically quarterly).'
    ],
    returnsEngine: {
      capitalGains: 'Long-term appreciation in underlying commercial land and office building values.',
      regularIncome: 'Quarterly dividend, interest, and capital repayment distributions from lease rentals.',
      typicalYield: '6.5% – 7.5% per annum'
    },
    characteristics: [
      { label: 'Asset Class', value: 'Hybrid / Alternative Real Estate' },
      { label: 'Minimum Investment', value: '1 Unit (~₹300 - ₹400 on NSE)' },
      { label: 'Payout Frequency', value: 'Quarterly distributions' },
      { label: 'Regulatory Mandate', value: '>=90% Cash Flow Distributed' },
    ],
    liquidity: {
      level: 'High on Public Exchanges',
      description: 'Trades continuously on NSE and BSE just like shares, eliminating physical property lock-in.'
    },
    risks: [
      'Vacancy risk if key corporate tenants downsize or work-from-home expands.',
      'Interest rate sensitivity: Rising interest rates can make fixed deposits relatively competitive.'
    ],
    useCases: [
      'Generating predictable quarterly cash flow for semi-retired or passive income seekers.',
      'Hedging against equity market drawdowns through tangible commercial real estate.'
    ],
    diagram: {
      step1: 'Investors Pool Capital',
      step2: 'Trust Owns Grade-A Tech Parks',
      step3: 'Fortune 500 Tenants Pay Rents',
      distribution: '90% Distributed Quarterly to Investors'
    }
  },
  {
    id: 'INVIT',
    name: 'Infrastructure Investment Trusts (InvITs)',
    badge: 'ESSENTIAL INFRASTRUCTURE',
    tagline: 'Participate in critical national utilities, power transmission, and toll highways.',
    accentColor: 'border-amber-500/40 bg-amber-500/10 text-amber-400',
    whatIsIt: 'An InvIT is an investment vehicle that pools capital to invest directly in revenue-generating physical infrastructure assets like interstate electric grids and national toll highways.',
    howItWorks: [
      'The Trust owns completed, operational infrastructure assets with long-term concession agreements.',
      'Revenues come from government-regulated transmission tariffs or toll collections paid by vehicular traffic.',
      'SEBI mandates >=90% of net distributable cash flows must be disbursed at least half-yearly or quarterly.'
    ],
    returnsEngine: {
      capitalGains: 'Modest capital appreciation (assets amortize towards concession expiry).',
      regularIncome: 'High quarterly/semi-annual cash distributions with inflation-linked tariff escalations.',
      typicalYield: '9.5% – 11.0% per annum'
    },
    characteristics: [
      { label: 'Asset Class', value: 'Infrastructure / Alternative Yield' },
      { label: 'Minimum Investment', value: '1 Unit (~₹100 on NSE)' },
      { label: 'Payout Frequency', value: 'Quarterly or Semi-Annual' },
      { label: 'Cash Flow Source', value: 'Power Tariffs & Highway Tolls' },
    ],
    liquidity: {
      level: 'Moderate on Public Exchanges',
      description: 'Exchange-traded on NSE/BSE, though trading volumes are generally lower than large-cap equities.'
    },
    risks: [
      'Traffic volume fluctuations on toll roads during economic slowing.',
      'Finite concession lifespan requiring reinvestment into new assets over 20-30 year horizons.'
    ],
    useCases: [
      'High cash yield accumulation to reinvest or fund ongoing living expenses.',
      'Portfolio inflation hedging via statutory toll fee adjustments.'
    ],
    diagram: {
      step1: 'Capital Aggregation',
      step2: 'Operational Power Grids & Highways',
      step3: 'Regulated User Tariffs & Tolls',
      distribution: 'Quarterly High-Yield Cash Payouts'
    }
  },
  {
    id: 'BOND',
    name: 'Bonds & Fixed Income Securities',
    badge: 'CAPITAL PRESERVATION',
    tagline: 'Lend directly to Sovereign Governments or AAA corporations for contractual interest.',
    accentColor: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400',
    whatIsIt: 'A bond is a debt instrument where you lend capital to a borrower (Government of India, public corporations) in exchange for fixed periodic interest (coupon) and return of face value at maturity.',
    howItWorks: [
      'The investor purchases a bond with a defined face value, coupon interest rate, and maturity year.',
      'The issuer pays contractual coupon payments (e.g. 7.18% semi-annually) directly into the investor bank account.',
      'Upon maturity date (e.g. 2033), 100% of the principal face value is returned.'
    ],
    returnsEngine: {
      capitalGains: 'Bond prices rise when macroeconomic interest rates decrease.',
      regularIncome: 'Contractually guaranteed semi-annual or annual coupon interest.',
      typicalYield: '7.1% – 8.2% per annum'
    },
    characteristics: [
      { label: 'Asset Class', value: 'Fixed Income / Debt' },
      { label: 'Credit Risk', value: 'Sovereign (Virtually Zero Default Risk)' },
      { label: 'Payment Terms', value: 'Contractual Obligation' },
      { label: 'Liquidation Priority', value: 'Senior to all equity stockholders' },
    ],
    liquidity: {
      level: 'High via RBI Retail Direct / NSE',
      description: 'Government securities can be traded or held until maturity to receive guaranteed face value.'
    },
    risks: [
      'Interest rate risk: Bond prices drop if prevailing interest rates rise.',
      'Reinvestment risk when principal is returned at maturity during a lower rate cycle.'
    ],
    useCases: [
      'Defensive bedrock ensuring portfolio survival during severe equity bear markets.',
      'Matching future liability milestones (e.g. child education in 2033) with zero price risk.'
    ],
    diagram: {
      step1: 'Investor Lends Principal',
      step2: 'Sovereign / Corporate Debt Instrument',
      step3: 'Semi-Annual Coupon Payments',
      distribution: '100% Principal Returned at Maturity'
    }
  },
  {
    id: 'EQUITY',
    name: 'Equities & Equity ETFs',
    badge: 'GROWTH & COMPOUNDING',
    tagline: 'Own fractional equity in leading enterprises driving economic expansion.',
    accentColor: 'border-blue-500/40 bg-blue-500/10 text-blue-400',
    whatIsIt: 'An equity share represents fractional ownership of a company. You participate in the profits, corporate growth, and long-term enterprise valuation.',
    howItWorks: [
      'Investors buy shares on public bourses (NSE/BSE) or index ETFs (like Nifty 50 BeES).',
      'As the company innovates, gains market share, and increases earnings, market price rises.',
      'Profitable corporations may also disburse discretionary dividends to shareholders.'
    ],
    returnsEngine: {
      capitalGains: 'Unlimited long-term capital compounding tied to corporate profitability.',
      regularIncome: 'Variable corporate dividend distributions declared by the board of directors.',
      typicalYield: '1.0% – 2.5% dividend yield + 12–15% historical compounding'
    },
    characteristics: [
      { label: 'Asset Class', value: 'Common Stock / Growth Equity' },
      { label: 'Voting Rights', value: 'Voting rights at shareholder meetings' },
      { label: 'Ownership', value: 'Residual equity claim on corporate cash flow' },
      { label: 'Time Horizon', value: 'Recommended 5–10+ years' },
    ],
    liquidity: {
      level: 'Ultra High (T+1 Settlement)',
      description: 'Immediate liquidity across NSE and BSE during market hours.'
    },
    risks: [
      'Market volatility and economic downturn drawdowns.',
      'Company-specific business and competitive obsolescence risks.'
    ],
    useCases: [
      'Beating inflation and creating intergenerational wealth over multi-year horizons.',
      'Core growth driver of long-term retirement and financial independence targets.'
    ],
    diagram: {
      step1: 'Buy Fractional Shares',
      step2: 'Business Expansion & Revenue Growth',
      step3: 'Earnings & Valuation Compounding',
      distribution: 'Capital Gains + Discretionary Dividends'
    }
  }
];

export const AssetExplorerView: React.FC = () => {
  const { setCurrentView, setIsCopilotDrawerOpen } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>('REIT');

  const selected = CATEGORIES.find((c) => c.id === activeCategory) || CATEGORIES[0];

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#0c101d] border border-white/[0.08] shadow-xl">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-cyan-400" />
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Asset Explorer & Awareness Center
          </h1>
        </div>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl">
          Learn how equities, bonds, REITs, and InvITs operate, generate income, and interact within a balanced portfolio. Clear explanations without jargon.
        </p>
      </div>

      {/* Category Selection Tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {CATEGORIES.map((cat) => {
          const isActive = cat.id === activeCategory;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                isActive
                  ? 'bg-cyan-500/10 border-cyan-400/50 shadow-[0_0_20px_rgba(0,242,254,0.15)]'
                  : 'bg-[#0c101d] border-white/[0.08] hover:border-white/20'
              }`}
            >
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase border ${cat.accentColor}`}>
                {cat.badge}
              </span>
              <h3 className="text-sm font-bold text-white mt-2">{cat.id}s</h3>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{cat.tagline}</p>
            </button>
          );
        })}
      </div>

      {/* Selected Category Deep Dive Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#0c101d] border border-white/[0.08] space-y-8 shadow-2xl">
        {/* Title and Tagline */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase border ${selected.accentColor}`}>
                {selected.badge}
              </span>
              <span className="text-xs font-mono text-cyan-400 font-bold">EDUCATIONAL MODULE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-2 tracking-tight">
              {selected.name}
            </h2>
            <p className="text-sm text-slate-300 mt-1 font-medium">{selected.tagline}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentView('portfolio')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 bg-white/[0.04] border border-white/10 hover:border-cyan-400 hover:text-white transition-all cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Inspect Holdings</span>
            </button>
            <button
              onClick={() => setIsCopilotDrawerOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-black bg-gradient-to-r from-cyan-400 to-sky-300 hover:from-cyan-300 shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 fill-black" />
              <span>Ask Copilot</span>
            </button>
          </div>
        </div>

        {/* Visual Capital Flow & Return Diagram */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold font-mono tracking-widest text-cyan-400 uppercase">
            VISUAL CAPITAL & RETURN MECHANISM
          </h3>
          <div className="p-6 rounded-xl bg-gradient-to-r from-[#090d16] via-[#121829] to-[#090d16] border border-cyan-500/20">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 text-center space-y-1">
                <span className="text-[10px] text-cyan-400 font-mono">STEP 1</span>
                <p className="text-xs font-bold text-white">{selected.diagram.step1}</p>
              </div>

              <div className="hidden sm:flex justify-center text-cyan-400">
                <ChevronRight className="w-5 h-5" />
              </div>

              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 text-center space-y-1">
                <span className="text-[10px] text-purple-400 font-mono">STEP 2</span>
                <p className="text-xs font-bold text-white">{selected.diagram.step2}</p>
              </div>

              <div className="hidden sm:flex justify-center text-cyan-400">
                <ChevronRight className="w-5 h-5" />
              </div>

              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 text-center space-y-1 sm:col-span-2 lg:col-span-1">
                <span className="text-[10px] text-amber-400 font-mono">STEP 3</span>
                <p className="text-xs font-bold text-white">{selected.diagram.step3}</p>
              </div>

              <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-center space-y-1 sm:col-span-2 lg:col-span-1">
                <span className="text-[10px] text-emerald-400 font-mono font-bold">CASH FLOW DISTRIBUTION</span>
                <p className="text-xs font-extrabold text-emerald-300">{selected.diagram.distribution}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column: What is it & How it works */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* What is it? */}
          <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-cyan-400" />
              What is it?
            </h4>
            <p className="text-sm text-slate-200 leading-relaxed">
              {selected.whatIsIt}
            </p>

            <div className="pt-2 grid grid-cols-2 gap-2 text-xs">
              {selected.characteristics.map((c, i) => (
                <div key={i} className="p-2 rounded-lg bg-white/[0.02] border border-white/5">
                  <span className="text-[10px] text-slate-500 block">{c.label}</span>
                  <span className="font-semibold text-white mt-0.5 block">{c.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* How does it work? */}
          <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Workflow className="w-4 h-4 text-purple-400" />
              How Does It Work?
            </h4>
            <div className="space-y-2.5">
              {selected.howItWorks.map((step, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                  <div className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-mono font-bold">
                    {i + 1}
                  </div>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Returns Engine Breakdown (Capital gains vs Regular income) */}
        <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Coins className="w-4 h-4 text-amber-400" />
            How Returns & Income Arise
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-1">
              <span className="text-[11px] text-slate-400">Capital Appreciation</span>
              <p className="text-xs font-semibold text-white mt-1">{selected.returnsEngine.capitalGains}</p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-1">
              <span className="text-[11px] text-slate-400">Regular Income Distribution</span>
              <p className="text-xs font-semibold text-white mt-1">{selected.returnsEngine.regularIncome}</p>
            </div>

            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-1">
              <span className="text-[11px] text-amber-300">Typical Indicative Yield</span>
              <p className="text-lg font-black text-amber-400 mt-1">{selected.returnsEngine.typicalYield}</p>
            </div>
          </div>
        </div>

        {/* Liquidity, Risks, and Typical Use Cases */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Liquidity */}
          <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-400" />
              Liquidity
            </h4>
            <div className="font-semibold text-xs text-white">{selected.liquidity.level}</div>
            <p className="text-xs text-slate-400 leading-relaxed">{selected.liquidity.description}</p>
          </div>

          {/* Risks */}
          <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              Risk Considerations
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              {selected.risks.map((r, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-rose-400">•</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Use Cases */}
          <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-emerald-400" />
              Typical Use Cases
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              {selected.useCases.map((u, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{u}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
