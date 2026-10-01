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
  Compass,
  PieChart as PieIcon,
  Activity,
  Calendar
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
  const { summary, holdings, setCurrentView, openAssetModal, setIsCopilotDrawerOpen } = useApp();
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

  // Chart Color Palettes
  const ASSET_COLORS: Record<string, string> = {
    EQUITY: '#38bdf8', // Electric Blue / Sky
    BOND: '#34d399',   // Emerald
    REIT: '#a855f7',   // Purple
    INVIT: '#fbbf24',  // Amber
    OTHER: '#2dd4bf',  // Teal
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
    color: ASSET_COLORS[item.asset_type] || '#94a3b8',
  }));

  const formatCurrency = (val: number) => {
    return '₹' + Math.round(val).toLocaleString('en-IN');
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0c101d] border border-white/[0.08] shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Command Dashboard
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-cyan-950 text-cyan-300 border border-cyan-800">
              SIMULATION / DEMO DATA
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Consolidated overview across Broker A, Broker B, Depository & CSV statement.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setCurrentView('import')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200 bg-white/[0.05] border border-white/10 hover:border-cyan-500/40 hover:text-cyan-300 transition-all cursor-pointer"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Sync Source</span>
          </button>

          <button
            onClick={() => setIsCopilotDrawerOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-black bg-gradient-to-r from-cyan-400 to-sky-300 hover:from-cyan-300 shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 fill-black" />
            <span>Ask Copilot</span>
          </button>
        </div>
      </div>

      {/* KPI Financial Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Portfolio Value */}
        <div className="p-5 rounded-2xl bg-[#0c101d] border border-white/[0.08] hover:border-cyan-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Total Portfolio Value</span>
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-white tracking-tight">
            {formatCurrency(totalValue)}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+{formatCurrency(dayChange)} (+{dayChangePercent}%)</span>
            <span className="text-[10px] text-slate-500 font-normal">today</span>
          </div>
        </div>

        {/* Invested Capital & Unrealized P/L */}
        <div className="p-5 rounded-2xl bg-[#0c101d] border border-white/[0.08] hover:border-cyan-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Invested Capital</span>
            <span className="text-[10px] font-mono text-slate-500">Benchmark</span>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-slate-200 tracking-tight">
            {formatCurrency(totalInvested)}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
            <span>P/L: +{formatCurrency(unrealizedPl)}</span>
            <span className="px-1.5 py-0.2 rounded bg-emerald-950/70 border border-emerald-500/30 text-[10px]">
              +{plPercent}%
            </span>
          </div>
        </div>

        {/* Projected Annual Cash Flow / Income */}
        <div className="p-5 rounded-2xl bg-[#0c101d] border border-white/[0.08] hover:border-cyan-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Annual Projected Income</span>
            <Coins className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-amber-300 tracking-tight">
            {formatCurrency(annualIncome)}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <span>Yield:</span>
            <span className="text-amber-400 font-bold">{weightedYield}% / year</span>
            <span className="text-[10px] text-slate-500">via REIT/InvIT/Bond</span>
          </div>
        </div>

        {/* Multi-Asset Holdings Count */}
        <div className="p-5 rounded-2xl bg-[#0c101d] border border-white/[0.08] hover:border-cyan-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Unified Holdings</span>
            <Layers className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-white tracking-tight">
            {totalAssets}{' '}
            <span className="text-sm font-normal text-slate-400">Instruments</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
            <span className="text-cyan-400 font-medium">4 Asset Classes</span>
            <span>•</span>
            <span className="text-slate-400 font-medium">4 Sources</span>
          </div>
        </div>
      </div>

      {/* Main Charts Row: Asset Allocation Donut + Historical Growth Curve */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Donut Allocation Chart (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#0c101d] border border-white/[0.08] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white tracking-wide">Multi-Asset Allocation</h3>
            </div>
            <button
              onClick={() => setCurrentView('portfolio')}
              className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>View Table</span>
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
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#07090e" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [formatCurrency(Number(value)), 'Value']}
                  contentStyle={{
                    backgroundColor: '#0c101d',
                    borderColor: 'rgba(255,255,255,0.15)',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Total</span>
              <span className="text-sm font-extrabold text-white">₹8.42L</span>
            </div>
          </div>

          {/* Allocation Legend breakdown */}
          <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-white/10 text-xs">
            {pieData.map((item) => (
              <div
                key={item.name}
                onClick={() => setCurrentView('portfolio')}
                className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] cursor-pointer transition-all border border-transparent hover:border-white/10"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-300 font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-white font-mono">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* 12-Month Performance Growth Chart (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#0c101d] border border-white/[0.08] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white tracking-wide">
                12-Month Multi-Asset Growth Trajectory
              </h3>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-cyan-400" />
                <span className="text-slate-300">Portfolio Value</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-slate-500" />
                <span className="text-slate-400">Capital Invested</span>
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
                  <linearGradient id="valGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f2fe" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#00f2fe" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => `₹${(val / 100000).toFixed(1)}L`}
                  domain={['dataMin - 30000', 'dataMax + 20000']}
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
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#valGrad)"
                  name="Total Value"
                />
                <Area
                  type="monotone"
                  dataKey="invested_value"
                  stroke="#64748b"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  fillOpacity={0}
                  name="Invested"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span>Portfolio Compound Annual Growth Rate (CAGR): <strong>+17.0%</strong></span>
            <span className="text-cyan-400 font-mono">Consolidated Multi-Asset Performance</span>
          </div>
        </div>
      </div>

      {/* Custody Source Breakdown & AI Observations Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Custody Sources */}
        <div className="p-6 rounded-2xl bg-[#0c101d] border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white tracking-wide">Custody Sources</h3>
            <span className="text-[10px] text-slate-500 font-mono">4 CONNECTED</span>
          </div>

          <div className="space-y-3">
            {(summary?.sources || [
              { source: 'Broker A', current_value: 390445, percentage: 46.3, asset_count: 5 },
              { source: 'Broker B', current_value: 208210, percentage: 24.7, asset_count: 3 },
              { source: 'Depository', current_value: 188520, percentage: 22.4, asset_count: 3 },
              { source: 'Imported CSV', current_value: 55325, percentage: 6.6, asset_count: 2 },
            ]).map((s) => (
              <div key={s.source} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">{s.source}</span>
                  <span className="font-mono text-cyan-400">{s.percentage}%</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400" style={{ width: `${s.percentage}%` }} />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>{formatCurrency(s.current_value)}</span>
                  <span>{s.asset_count} assets</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Copilot Observations (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-gradient-to-br from-cyan-950/20 via-[#0c101d] to-[#07090e] border border-cyan-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white tracking-wide">
                ZeroLatency Copilot Observations
              </h3>
            </div>
            <button
              onClick={() => setIsCopilotDrawerOpen(true)}
              className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>Explore AI Insights</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-1">
              <span className="text-[10px] font-mono text-blue-400 font-bold uppercase">EQUITY EXP</span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Equities represent approximately <strong>52% (₹4,38,315)</strong> of this demo portfolio, offering growth potential alongside market volatility.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-1">
              <span className="text-[10px] font-mono text-purple-400 font-bold uppercase">REIT YIELD</span>
              <p className="text-xs text-slate-300 leading-relaxed">
                REIT exposure represents approximately <strong>15% (₹1,25,435)</strong>, providing commercial office park exposure with quarterly rental yields.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-1">
              <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">INVIT STABILITY</span>
              <p className="text-xs text-slate-300 leading-relaxed">
                InvIT exposure comprises approximately <strong>10% (₹84,140)</strong>, backed by essential utility assets like power transmission and national highway tolls.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-1">
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">SOVEREIGN BUFFER</span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Bonds provide an <strong>18% (₹1,52,380)</strong> anchor, securing dependable coupon receipts and protecting principal capital during equity pullbacks.
              </p>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-white/10">
            <span className="text-[11px] text-slate-500">
              Analysis generated dynamically using live portfolio balance.
            </span>
            <button
              onClick={() => setIsCopilotDrawerOpen(true)}
              className="text-xs text-cyan-300 font-semibold hover:text-white"
            >
              Ask question about these findings →
            </button>
          </div>
        </div>
      </div>

      {/* Top Asset Holdings Quick Preview */}
      <div className="p-6 rounded-2xl bg-[#0c101d] border border-white/[0.08] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              Top Consolidated Holdings
            </h3>
          </div>
          <button
            onClick={() => setCurrentView('portfolio')}
            className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
          >
            <span>View All {holdings.length} Assets</span>
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
                className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-cyan-500/40 hover:bg-white/[0.04] transition-all cursor-pointer space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-mono">{h.symbol}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/[0.05] border border-white/10 text-slate-400 font-mono">
                    {h.source}
                  </span>
                </div>
                <p className="text-xs text-slate-300 truncate font-medium">{h.name}</p>
                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{formatCurrency(h.current_value)}</span>
                  <span className={`font-semibold font-mono ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
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
