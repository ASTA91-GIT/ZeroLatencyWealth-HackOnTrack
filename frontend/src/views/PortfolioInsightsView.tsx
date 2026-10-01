import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import type { PortfolioInsightsResponse } from '../types';
import {
  LineChart as LineChartIcon,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Coins,
  TrendingUp,
  Layers,
  ArrowRight,
  PieChart as PieIcon,
  CheckCircle2,
  Calendar,
  Building
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

export const PortfolioInsightsView: React.FC = () => {
  const { summary, setIsCopilotDrawerOpen } = useApp();
  const [insights, setInsights] = useState<PortfolioInsightsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true);
        const data = await api.getInsights();
        setInsights(data);
      } catch (err) {
        console.error('Error fetching insights:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, []);

  const formatCurrency = (val: number) => {
    return '₹' + Math.round(val).toLocaleString('en-IN');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0c101d] border border-white/[0.08] shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <LineChartIcon className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Portfolio Intelligence & Insights
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Algorithmic multi-asset portfolio diagnostics, risk concentration flags, and cash flow forecasts.
          </p>
        </div>

        <button
          onClick={() => setIsCopilotDrawerOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-black bg-gradient-to-r from-cyan-400 to-sky-300 hover:from-cyan-300 shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 fill-black" />
          <span>Consult Copilot</span>
        </button>
      </div>

      {/* Primary Observations Cards (As requested in prompt) */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold font-mono tracking-widest text-cyan-400 uppercase">
          AUTOMATED PORTFOLIO OBSERVATIONS
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(insights?.observations || [
            {
              title: 'Equities Allocation',
              text: 'Equities represent approximately 52% (₹4,38,315) of this demo portfolio, offering growth potential alongside market volatility.',
              category: 'allocation',
              type: 'info'
            },
            {
              title: 'Real Estate Trust Exposure',
              text: 'REIT exposure represents approximately 15% (₹1,25,435), providing commercial real estate exposure with contractual rental yields.',
              category: 'allocation',
              type: 'highlight'
            },
            {
              title: 'Infrastructure Cash Flows',
              text: 'InvIT exposure accounts for approximately 10% (₹84,140), backed by essential utility assets like power transmission and national toll highways.',
              category: 'income',
              type: 'highlight'
            },
            {
              title: 'Fixed Income Anchor',
              text: 'Bonds comprise approximately 18% (₹1,52,380), providing capital preservation and predictable coupon receipts.',
              category: 'risk',
              type: 'safe'
            },
            {
              title: 'Multi-Asset Category Breadth',
              text: 'The demo portfolio contains 4 major asset categories spanning 13 instruments across 4 independent custody sources.',
              category: 'diversification',
              type: 'neutral'
            }
          ]).map((obs, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#0c101d] border border-white/[0.08] hover:border-cyan-500/30 transition-all space-y-2 flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800 font-bold uppercase">
                  {obs.category}
                </span>
                <h4 className="text-sm font-bold text-white mt-2">{obs.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed mt-1">{obs.text}</p>
              </div>

              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-500">
                <span>Neutral Factual Finding</span>
                <span className="text-cyan-400 font-mono">Zero Latency Engine</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Income Stream Projections & Quarterly Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Income Distribution (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#0c101d] border border-white/[0.08] space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white tracking-wide">
                Projected Income & Distribution Breakdown
              </h3>
            </div>
            <span className="text-xs font-mono text-amber-400 font-bold">
              ~₹37,362 / Year (~4.43% Yield)
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Multi-asset cash flows are generated across quarterly REIT distributions, InvIT cash payouts, sovereign bond coupons, and corporate dividends.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { source: 'REIT Rental Yields', amount: 8750, freq: 'Quarterly Payouts', color: 'border-purple-500/30 bg-purple-950/20 text-purple-300' },
              { source: 'InvIT Infrastructure Cash', amount: 8580, freq: 'Quarterly / Semi-Annual', color: 'border-amber-500/30 bg-amber-950/20 text-amber-300' },
              { source: 'Sovereign Bond Coupons', amount: 11520, freq: 'Semi-Annual Guaranteed', color: 'border-emerald-500/30 bg-emerald-950/20 text-emerald-300' },
              { source: 'Equity Dividends', amount: 5420, freq: 'Interim & Annual', color: 'border-blue-500/30 bg-blue-950/20 text-blue-300' },
            ].map((item, i) => (
              <div key={i} className={`p-4 rounded-xl border ${item.color} space-y-1`}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">{item.source}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{item.freq}</span>
                </div>
                <div className="text-lg font-black text-white font-mono mt-1">
                  {formatCurrency(item.amount)}
                  <span className="text-[10px] text-slate-400 font-normal"> / year</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-between text-xs">
            <span className="text-slate-400">Average Estimated Monthly Payout:</span>
            <span className="font-mono font-bold text-emerald-400">~₹3,113 / month</span>
          </div>
        </div>

        {/* Risk & Concentration Profile (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#0c101d] border border-white/[0.08] space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white tracking-wide">
                Risk & Concentration Profile
              </h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
              BALANCED
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-1">
              <span className="text-[11px] text-slate-400">Concentration Alert</span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Nippon India Nifty 50 ETF represents <strong>20.9%</strong> of the total portfolio. Single-asset concentration is diversified across India's top 50 bluechips.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
              <span className="text-[11px] text-slate-400">Liquidity Spectrum</span>
              <div className="space-y-1.5 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-300">High Liquidity (Equities / LiquidBeES)</span>
                    <span className="font-mono text-cyan-400">57.0%</span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-cyan-400 h-full" style={{ width: '57%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-300">Moderate Liquidity (Sovereign Bonds & REITs)</span>
                    <span className="font-mono text-purple-400">33.0%</span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-purple-400 h-full" style={{ width: '33%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-300">Low-to-Moderate (InvITs & Debentures)</span>
                    <span className="font-mono text-amber-400">10.0%</span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full" style={{ width: '10%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Asset Historical Performance Curve */}
      <div className="p-6 rounded-2xl bg-[#0c101d] border border-white/[0.08] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              Multi-Asset Valuation & Cost Basis History
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">12 MONTHS AUDITED SIMULATION</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={insights?.historical_trend || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                tickFormatter={(val) => `₹${(val / 100000).toFixed(1)}L`}
                domain={['dataMin - 20000', 'dataMax + 20000']}
              />
              <Tooltip
                formatter={(value: any) => [formatCurrency(Number(value)), '']}
                contentStyle={{
                  backgroundColor: '#0c101d',
                  borderColor: 'rgba(255,255,255,0.15)',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#fff',
                }}
              />
              <Area
                type="monotone"
                dataKey="total_value"
                stroke="#00f2fe"
                strokeWidth={2}
                fill="#00f2fe"
                fillOpacity={0.1}
                name="Total Value"
              />
              <Area
                type="monotone"
                dataKey="invested_value"
                stroke="#94a3b8"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                fill="none"
                name="Invested Basis"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
