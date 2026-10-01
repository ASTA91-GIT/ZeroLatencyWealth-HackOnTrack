import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import {
  TrendingUp,
  TrendingDown,
  Layers,
  Coins,
  Shield,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Building,
  UploadCloud,
  ChevronRight,
  PieChart as PieIcon,
  Activity,
  CheckCircle2,
  Database
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';

export const DashboardView: React.FC = () => {
  const { summary, holdings, setCurrentView, openAssetModal, setIsCopilotDrawerOpen, theme } = useApp();
  const [historicalData, setHistoricalData] = useState<any[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const insights = await api.getInsights();
        setHistoricalData(insights.historical_trend);
      } catch (err) {
        console.error('Error fetching historical trend', err);
      }
    };
    fetchHistory();
  }, []);

  const totalValue = summary?.total_value ?? 842500;
  const totalInvested = summary?.total_invested ?? 795000;
  const unrealizedPl = summary?.unrealized_pl ?? 47500;
  const plPercent = summary?.unrealized_pl_percent ?? 5.97;
  const dayChange = summary?.day_change_amount ?? 2963;
  const dayChangePercent = summary?.day_change_percent ?? 0.35;
  const annualIncome = summary?.projected_annual_income ?? 37362;
  const weightedYield = summary?.weighted_yield ?? 4.43;
  const totalAssets = summary?.total_assets ?? 13;

  const isDark = theme === 'dark';

  // Distinctive Purple + Neon Fintech Asset Slice Colors
  const ASSET_COLORS: Record<string, string> = {
    EQUITY: isDark ? '#38bdf8' : '#0284c7', // Sky Blue
    BOND: isDark ? '#34d399' : '#059669',   // Emerald
    REIT: isDark ? '#a855f7' : '#7c3aed',   // Electric Purple
    INVIT: isDark ? '#fbbf24' : '#d97706',  // Amber
    OTHER: isDark ? '#818cf8' : '#4f46e5',  // Indigo
  };

  const pieData = (summary?.allocations || [
    { asset_type: 'EQUITY', current_value: 438315, percentage: 52.0 },
    { asset_type: 'BOND', current_value: 152380, percentage: 18.1 },
    { asset_type: 'REIT', current_value: 125435, percentage: 14.9 },
    { asset_type: 'INVIT', current_value: 84140, percentage: 10.0 },
    { asset_type: 'OTHER', current_value: 42230, percentage: 5.0 },
  ]).map((item) => ({
    name: item.asset_type,
    value: item.current_value,
    percentage: item.percentage,
    color: ASSET_COLORS[item.asset_type] || '#a855f7',
  }));

  const formatCurrency = (val: number) => {
    return '₹' + Math.round(val).toLocaleString('en-IN');
  };

  return (
    <div className="space-y-8 pb-16">
      {/* 1. TOP: Page Title + Actions */}
      <div className="fintech-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
              Command Dashboard
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-50 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800">
              SIMULATION / DEMO DATA
            </span>
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
            Consolidated overview across Broker A, Broker B, Depository & CSV statements.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setCurrentView('import')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-200 bg-zinc-100 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/10 hover:border-purple-400 dark:hover:border-purple-500/40 hover:text-purple-600 dark:hover:text-purple-300 transition-all cursor-pointer"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Sync Source</span>
          </button>

          <button
            onClick={() => setIsCopilotDrawerOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-[0_0_15px_rgba(139,92,246,0.35)] transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 fill-white" />
            <span>Ask Copilot</span>
          </button>
        </div>
      </div>

      {/* 2. SECOND: Important KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Portfolio Value */}
        <div className="fintech-card p-5 space-y-2 border-t-2 border-t-purple-500">
          <div className="flex items-center justify-between text-xs font-medium text-zinc-500 dark:text-zinc-400">
            <span>Total Portfolio Value</span>
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
            {formatCurrency(totalValue)}
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+{formatCurrency(dayChange)} (+{dayChangePercent}%)</span>
            <span className="text-[10px] text-zinc-500 font-normal">today</span>
          </div>
        </div>

        {/* Invested Capital & Unrealized P/L */}
        <div className="fintech-card p-5 space-y-2 border-t-2 border-t-indigo-500">
          <div className="flex items-center justify-between text-xs font-medium text-zinc-500 dark:text-zinc-400">
            <span>Invested Capital</span>
            <span className="text-[10px] font-mono text-zinc-400">Cost Basis</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-zinc-800 dark:text-zinc-200 tracking-tight">
            {formatCurrency(totalInvested)}
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <span>P/L: +{formatCurrency(unrealizedPl)}</span>
            <span className="px-1.5 py-0.2 rounded bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-600/40 text-[10px]">
              +{plPercent}%
            </span>
          </div>
        </div>

        {/* Projected Annual Income / Yield */}
        <div className="fintech-card p-5 space-y-2 border-t-2 border-t-amber-500">
          <div className="flex items-center justify-between text-xs font-medium text-zinc-500 dark:text-zinc-400">
            <span>Projected Annual Income</span>
            <Coins className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-300 tracking-tight">
            {formatCurrency(annualIncome)}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400 font-medium">
            <span>Yield:</span>
            <span className="text-amber-600 dark:text-amber-400 font-bold">{weightedYield}% / year</span>
            <span className="text-[10px] text-zinc-500">REITs/InvITs/Bonds</span>
          </div>
        </div>

        {/* Multi-Asset Holdings Count */}
        <div className="fintech-card p-5 space-y-2 border-t-2 border-t-violet-500">
          <div className="flex items-center justify-between text-xs font-medium text-zinc-500 dark:text-zinc-400">
            <span>Unified Holdings</span>
            <Layers className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
            {totalAssets}{' '}
            <span className="text-sm font-normal text-zinc-500 dark:text-zinc-400">Securities</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
            <span className="text-purple-600 dark:text-purple-400 font-semibold">4 Asset Classes</span>
            <span>•</span>
            <span className="text-zinc-500">4 Custody Sources</span>
          </div>
        </div>
      </div>

      {/* 3. THIRD: Main Financial Visualizations (Donut + 12-Month Performance Curve) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Donut Allocation Chart (5 cols) */}
        <div className="lg:col-span-5 fintech-card p-6 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white tracking-tight">
                Multi-Asset Allocation
              </h3>
            </div>
            <button
              onClick={() => setCurrentView('portfolio')}
              className="text-xs text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
            >
              <span>Holdings</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Interactive Donut */}
          <div className="h-56 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={62}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke={isDark ? '#121118' : '#ffffff'}
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [formatCurrency(Number(value)), 'Allocation Value']}
                  contentStyle={{
                    backgroundColor: isDark ? '#18181f' : '#ffffff',
                    borderColor: isDark ? 'rgba(255,255,255,0.15)' : '#e4e1f0',
                    borderRadius: '10px',
                    fontSize: '12px',
                    color: isDark ? '#fff' : '#18181b',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium uppercase tracking-wider">
                Total
              </span>
              <span className="text-base font-extrabold text-zinc-900 dark:text-white">
                ₹8.42L
              </span>
            </div>
          </div>

          {/* Allocation Legend */}
          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-zinc-200 dark:border-white/10 text-xs">
            {pieData.map((item) => (
              <div
                key={item.name}
                onClick={() => setCurrentView('portfolio')}
                className="flex items-center justify-between p-2 rounded-lg bg-zinc-50 dark:bg-white/[0.02] hover:bg-zinc-100 dark:hover:bg-white/[0.05] cursor-pointer transition-all border border-transparent hover:border-purple-300 dark:hover:border-purple-500/30"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-zinc-700 dark:text-zinc-300 font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-zinc-900 dark:text-white font-mono">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* 12-Month Performance Growth Curve (7 cols) */}
        <div className="lg:col-span-7 fintech-card p-6 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-500" />
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white tracking-tight">
                12-Month Multi-Asset Growth Trajectory
              </h3>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-purple-500" />
                <span className="text-zinc-700 dark:text-zinc-300">Portfolio Value</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-zinc-400" />
                <span className="text-zinc-500">Invested Basis</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historicalData.length > 0 ? historicalData : [
                { date: 'Oct', total_value: 720000, invested_value: 710000 },
                { date: 'Dec', total_value: 748000, invested_value: 730000 },
                { date: 'Feb', total_value: 745000, invested_value: 750000 },
                { date: 'Apr', total_value: 782000, invested_value: 768000 },
                { date: 'Jun', total_value: 808000, invested_value: 780000 },
                { date: 'Sep', total_value: 842500, invested_value: 795000 },
              ]}>
                <defs>
                  <linearGradient id="valGradPurple" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isDark ? '#a855f7' : '#7c3aed'} stopOpacity={0.35} />
                    <stop offset="95%" stopColor={isDark ? '#a855f7' : '#7c3aed'} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(100,116,139,0.12)'} />
                <XAxis dataKey="date" stroke={isDark ? '#71717a' : '#94a3b8'} fontSize={11} tickLine={false} />
                <YAxis
                  stroke={isDark ? '#71717a' : '#94a3b8'}
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => `₹${(val / 100000).toFixed(1)}L`}
                  domain={['dataMin - 30000', 'dataMax + 20000']}
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
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#valGradPurple)"
                  name="Total Value"
                />
                <Area
                  type="monotone"
                  dataKey="invested_value"
                  stroke={isDark ? '#71717a' : '#94a3b8'}
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  fillOpacity={0}
                  name="Cost Basis"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-3 border-t border-zinc-200 dark:border-white/10 flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400">
            <span>Consolidated Compound Annual Growth Rate (CAGR): <strong>+17.0%</strong></span>
            <span className="text-purple-600 dark:text-purple-400 font-mono font-semibold">Multi-Asset Yield Active</span>
          </div>
        </div>
      </div>

      {/* 4. FOURTH: Supporting Analytics & Custody Source Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Custody Source Ingestion */}
        <div className="fintech-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white tracking-tight">
              Custody Sources
            </h3>
            <span className="text-[10px] text-zinc-500 font-mono">4 CONNECTED</span>
          </div>

          <div className="space-y-3">
            {(summary?.sources || [
              { source: 'Broker A', current_value: 390445, percentage: 46.3, asset_count: 5 },
              { source: 'Broker B', current_value: 208210, percentage: 24.7, asset_count: 3 },
              { source: 'Depository', current_value: 188520, percentage: 22.4, asset_count: 3 },
              { source: 'Imported CSV', current_value: 55325, percentage: 6.6, asset_count: 2 },
            ]).map((s) => (
              <div key={s.source} className="p-3 rounded-xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-900 dark:text-white">{s.source}</span>
                  <span className="font-mono text-purple-600 dark:text-purple-400 font-bold">{s.percentage}%</span>
                </div>
                <div className="w-full bg-zinc-200 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-600 dark:bg-purple-500" style={{ width: `${s.percentage}%` }} />
                </div>
                <div className="flex items-center justify-between text-[10px] text-zinc-500">
                  <span>{formatCurrency(s.current_value)}</span>
                  <span>{s.asset_count} instruments</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Copilot Automated Observations (2 cols) */}
        <div className="lg:col-span-2 fintech-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white tracking-tight">
                ZeroLatency Copilot Observations
              </h3>
            </div>
            <button
              onClick={() => setIsCopilotDrawerOpen(true)}
              className="text-xs text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
            >
              <span>Explore AI Insights</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 space-y-1">
              <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 font-bold uppercase">EQUITY EXP</span>
              <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                Equities represent approximately <strong>52% (₹4,38,315)</strong> of this demo portfolio, offering growth potential alongside market volatility.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 space-y-1">
              <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400 font-bold uppercase">REIT YIELD</span>
              <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                REIT exposure represents approximately <strong>15% (₹1,25,435)</strong>, providing commercial office park exposure with quarterly rental yields.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 space-y-1">
              <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-bold uppercase">INVIT CASH FLOWS</span>
              <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                InvIT exposure comprises approximately <strong>10% (₹84,140)</strong>, backed by essential utility assets like power transmission and highway tolls.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 space-y-1">
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase">SOVEREIGN BUFFER</span>
              <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                Bonds provide an <strong>18% (₹1,52,380)</strong> anchor, securing dependable coupon receipts and protecting capital during pullbacks.
              </p>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-zinc-500 border-t border-zinc-200 dark:border-white/10">
            <span className="text-[11px]">
              Analysis synthesized from live mark-to-market balances.
            </span>
            <button
              onClick={() => setIsCopilotDrawerOpen(true)}
              className="text-xs text-purple-600 dark:text-purple-400 font-bold hover:underline cursor-pointer"
            >
              Ask Copilot about findings →
            </button>
          </div>
        </div>
      </div>

      {/* 5. FIFTH: Top Holdings Quick Table */}
      <div className="fintech-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white tracking-tight">
              Top Consolidated Holdings
            </h3>
          </div>
          <button
            onClick={() => setCurrentView('portfolio')}
            className="text-xs text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
          >
            <span>View All {holdings.length} Holdings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {holdings.slice(0, 4).map((h) => {
            const isProfit = h.unrealized_pl >= 0;
            return (
              <div
                key={h.id}
                onClick={() => openAssetModal(h)}
                className="p-4 rounded-xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 hover:border-purple-400 dark:hover:border-purple-500/40 hover:bg-purple-50/40 dark:hover:bg-white/[0.04] transition-all cursor-pointer space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-900 dark:text-white font-mono">{h.symbol}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-200/60 dark:bg-white/[0.05] border border-zinc-300 dark:border-white/10 text-zinc-600 dark:text-zinc-400 font-mono">
                    {h.source}
                  </span>
                </div>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 truncate font-medium">{h.name}</p>
                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="font-bold text-zinc-900 dark:text-white">{formatCurrency(h.current_value)}</span>
                  <span className={`font-semibold font-mono ${isProfit ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {isProfit ? '+' : ''}{h.unrealized_pl_percent}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
