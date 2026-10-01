import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import type { PortfolioInsightsResponse } from '../types';
import {
  LineChart as LineChartIcon,
  Sparkles,
  ShieldCheck,
  Coins,
  TrendingUp
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export const PortfolioInsightsView: React.FC = () => {
  const { setIsCopilotDrawerOpen, theme } = useApp();
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

  const isDark = theme === 'dark';

  const formatCurrency = (val: number) => {
    return '₹' + Math.round(val).toLocaleString('en-IN');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="fintech-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <LineChartIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
              Portfolio Intelligence & Insights
            </h1>
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
            Algorithmic multi-asset portfolio diagnostics, risk concentration alerts, and quarterly cash flow forecasts.
          </p>
        </div>

        <button
          onClick={() => setIsCopilotDrawerOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-[0_0_15px_rgba(139,92,246,0.35)] transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 fill-white" />
          <span>Consult Copilot</span>
        </button>
      </div>

      {/* Primary Observations Cards */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold font-mono tracking-widest text-purple-600 dark:text-purple-400 uppercase">
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
              className="fintech-card p-5 space-y-3 flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 font-bold uppercase">
                  {obs.category}
                </span>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-white mt-2.5">{obs.title}</h4>
                <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed mt-1">{obs.text}</p>
              </div>

              <div className="pt-3 border-t border-zinc-200 dark:border-white/[0.06] flex items-center justify-between text-[11px] text-zinc-400">
                <span>Algorithmic Diagnostic</span>
                <span className="text-purple-600 dark:text-purple-400 font-mono font-medium">Zero Latency</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Income Stream Projections & Risk Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Income Distribution (7 cols) */}
        <div className="lg:col-span-7 fintech-card p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white tracking-tight">
                Projected Income & Distribution Breakdown
              </h3>
            </div>
            <span className="text-xs font-mono text-amber-600 dark:text-amber-400 font-bold">
              ~₹37,362 / Year (~4.43% Yield)
            </span>
          </div>

          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Multi-asset cash flows are generated across quarterly REIT distributions, InvIT cash payouts, sovereign bond coupons, and corporate dividends.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { source: 'REIT Rental Yields', amount: 8750, freq: 'Quarterly Payouts', color: 'border-purple-300 dark:border-purple-500/30 bg-purple-50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-300' },
              { source: 'InvIT Infrastructure Cash', amount: 8580, freq: 'Quarterly / Semi-Annual', color: 'border-amber-300 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300' },
              { source: 'Sovereign Bond Coupons', amount: 11520, freq: 'Semi-Annual Guaranteed', color: 'border-emerald-300 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300' },
              { source: 'Equity Dividends', amount: 5420, freq: 'Interim & Annual', color: 'border-blue-300 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300' },
            ].map((item, i) => (
              <div key={i} className={`p-4 rounded-xl border ${item.color} space-y-1`}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-900 dark:text-white">{item.source}</span>
                  <span className="text-[10px] text-zinc-500 font-mono">{item.freq}</span>
                </div>
                <div className="text-lg font-black text-zinc-900 dark:text-white font-mono mt-1">
                  {formatCurrency(item.amount)}
                  <span className="text-[10px] text-zinc-500 font-normal"> / year</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/10 flex items-center justify-between text-xs">
            <span className="text-zinc-600 dark:text-zinc-400">Average Estimated Monthly Payout:</span>
            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">~₹3,113 / month</span>
          </div>
        </div>

        {/* Risk & Concentration Profile (5 cols) */}
        <div className="lg:col-span-5 fintech-card p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white tracking-tight">
                Risk & Concentration Profile
              </h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 font-bold">
              BALANCED
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/10 space-y-1">
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-semibold">Concentration Alert</span>
              <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                Nippon India Nifty 50 ETF represents <strong>20.9%</strong> of total portfolio. Risk is broadly distributed across India's top 50 bluechip enterprises.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/10 space-y-2">
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-semibold">Liquidity Spectrum</span>
              <div className="space-y-1.5 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-zinc-700 dark:text-zinc-300">High Liquidity (Equities / LiquidBeES)</span>
                    <span className="font-mono text-purple-600 dark:text-purple-400 font-bold">57.0%</span>
                  </div>
                  <div className="w-full bg-zinc-200 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-purple-600 dark:bg-purple-500 h-full" style={{ width: '57%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-zinc-700 dark:text-zinc-300">Moderate (Sovereign Bonds & REITs)</span>
                    <span className="font-mono text-violet-600 dark:text-violet-400 font-bold">33.0%</span>
                  </div>
                  <div className="w-full bg-zinc-200 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-violet-600 dark:bg-violet-500 h-full" style={{ width: '33%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-zinc-700 dark:text-zinc-300">Low-to-Moderate (InvITs & Debentures)</span>
                    <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">10.0%</span>
                  </div>
                  <div className="w-full bg-zinc-200 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-600 dark:bg-amber-500 h-full" style={{ width: '10%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Historical Valuation Curve */}
      <div className="fintech-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white tracking-tight">
              Multi-Asset Valuation & Cost Basis History
            </h3>
          </div>
          <span className="text-xs font-mono text-zinc-400">12 MONTHS AUDITED SIMULATION</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={insights?.historical_trend || []}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(100,116,139,0.12)'} />
              <XAxis dataKey="date" stroke={isDark ? '#71717a' : '#94a3b8'} fontSize={11} tickLine={false} />
              <YAxis
                stroke={isDark ? '#71717a' : '#94a3b8'}
                fontSize={11}
                tickLine={false}
                tickFormatter={(val) => `₹${(val / 100000).toFixed(1)}L`}
                domain={['dataMin - 20000', 'dataMax + 20000']}
              />
              <Tooltip
                formatter={(value: any) => [formatCurrency(Number(value)), '']}
                contentStyle={{
                  backgroundColor: isDark ? '#18181f' : '#ffffff',
                  borderColor: isDark ? 'rgba(255,255,255,0.15)' : '#e4e1f0',
                  borderRadius: '10px',
                  fontSize: '12px',
                  color: isDark ? '#fff' : '#18181b',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                }}
              />
              <Area
                type="monotone"
                dataKey="total_value"
                stroke={isDark ? '#c084fc' : '#7c3aed'}
                strokeWidth={2}
                fill={isDark ? '#a855f7' : '#7c3aed'}
                fillOpacity={0.12}
                name="Total Value"
              />
              <Area
                type="monotone"
                dataKey="invested_value"
                stroke={isDark ? '#71717a' : '#94a3b8'}
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
