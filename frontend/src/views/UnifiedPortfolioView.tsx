import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import type { HoldingModel, AssetType } from '../types';
import {
  Layers,
  Search,
  Filter,
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
  Building2,
  ExternalLink,
  Sparkles,
  Download,
  Info
} from 'lucide-react';

export const UnifiedPortfolioView: React.FC = () => {
  const { holdings, openAssetModal, setIsCopilotDrawerOpen } = useApp();

  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedSource, setSelectedSource] = useState<string>('ALL');
  const [performanceFilter, setPerformanceFilter] = useState<'ALL' | 'GAINERS' | 'LOSERS'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortField, setSortField] = useState<keyof HoldingModel>('current_value');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  const assetTypes: { label: string; value: string; count: number }[] = useMemo(() => {
    return [
      { label: 'All Assets', value: 'ALL', count: holdings.length },
      { label: 'Equities', value: 'EQUITY', count: holdings.filter((h) => h.asset_type === 'EQUITY').length },
      { label: 'Bonds', value: 'BOND', count: holdings.filter((h) => h.asset_type === 'BOND').length },
      { label: 'REITs', value: 'REIT', count: holdings.filter((h) => h.asset_type === 'REIT').length },
      { label: 'InvITs', value: 'INVIT', count: holdings.filter((h) => h.asset_type === 'INVIT').length },
    ];
  }, [holdings]);

  const sourcesList = useMemo(() => {
    const set = new Set(holdings.map((h) => h.source));
    return ['ALL', ...Array.from(set)];
  }, [holdings]);

  const filteredHoldings = useMemo(() => {
    return holdings
      .filter((h) => {
        if (selectedType !== 'ALL' && h.asset_type !== selectedType) return false;
        if (selectedSource !== 'ALL' && h.source !== selectedSource) return false;
        if (performanceFilter === 'GAINERS' && h.unrealized_pl < 0) return false;
        if (performanceFilter === 'LOSERS' && h.unrealized_pl >= 0) return false;

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = h.name.toLowerCase().includes(q);
          const matchSymbol = h.symbol.toLowerCase().includes(q);
          const matchSector = (h.sector || '').toLowerCase().includes(q);
          return matchName || matchSymbol || matchSector;
        }
        return true;
      })
      .sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];
        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortAsc ? valA - valB : valB - valA;
        }
        return sortAsc
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA));
      });
  }, [holdings, selectedType, selectedSource, performanceFilter, searchQuery, sortField, sortAsc]);

  const handleSort = (field: keyof HoldingModel) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const formatCurrency = (val: number) => {
    return '₹' + Math.round(val).toLocaleString('en-IN');
  };

  const getBadgeStyle = (type: AssetType) => {
    switch (type) {
      case 'EQUITY':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'BOND':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'REIT':
        return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
      case 'INVIT':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      default:
        return 'bg-slate-500/15 text-slate-400 border-slate-500/30';
    }
  };

  const getSourceBadge = (source: string) => {
    switch (source) {
      case 'Broker A':
        return 'bg-cyan-950/70 text-cyan-300 border-cyan-800';
      case 'Broker B':
        return 'bg-sky-950/70 text-sky-300 border-sky-800';
      case 'Depository':
        return 'bg-indigo-950/70 text-indigo-300 border-indigo-800';
      case 'Imported CSV':
        return 'bg-violet-950/70 text-violet-300 border-violet-800';
      default:
        return 'bg-slate-900 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0c101d] border border-white/[0.08] shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Unified Portfolio Holdings
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Consolidated multi-broker multi-asset view with live return and yield analysis. Click any asset for deep analysis.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-xs font-mono text-slate-300">
            Showing <span className="text-cyan-400 font-bold">{filteredHoldings.length}</span> of {holdings.length} Assets
          </div>
          <button
            onClick={() => setIsCopilotDrawerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-black bg-gradient-to-r from-cyan-400 to-sky-300 hover:from-cyan-300 shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 fill-black" />
            <span>Copilot Analysis</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#0c101d] border border-white/[0.08] space-y-4">
        {/* Asset Type Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {assetTypes.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setSelectedType(tab.value)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedType === tab.value
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,242,254,0.2)]'
                  : 'text-slate-400 hover:text-white bg-white/[0.02] border border-white/[0.06]'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                selectedType === tab.value ? 'bg-cyan-400 text-black font-bold' : 'bg-white/10 text-slate-400'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Secondary Filters: Source, Performance, Search */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-white/[0.06]">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ticker, name, or sector..."
              className="w-full bg-white/[0.03] border border-white/10 focus:border-cyan-400 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          {/* Source Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 shrink-0 font-medium">Source:</span>
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="w-full bg-[#0c101d] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="ALL">All Custody Sources</option>
              {sourcesList.filter((s) => s !== 'ALL').map((src) => (
                <option key={src} value={src}>{src}</option>
              ))}
            </select>
          </div>

          {/* Performance Filter Buttons */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-400 shrink-0 font-medium">P/L:</span>
            <button
              onClick={() => setPerformanceFilter('ALL')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                performanceFilter === 'ALL'
                  ? 'bg-white/10 text-white border border-white/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setPerformanceFilter('GAINERS')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                performanceFilter === 'GAINERS'
                  ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-emerald-400'
              }`}
            >
              Gainers
            </button>
            <button
              onClick={() => setPerformanceFilter('LOSERS')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                performanceFilter === 'LOSERS'
                  ? 'bg-rose-950/70 text-rose-400 border border-rose-500/40'
                  : 'text-slate-400 hover:text-rose-400'
              }`}
            >
              Losers
            </button>
          </div>
        </div>
      </div>

      {/* Main Unified Holdings Table */}
      <div className="rounded-2xl bg-[#0c101d] border border-white/[0.08] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-[11px] uppercase tracking-wider text-slate-400 font-mono">
                <th
                  onClick={() => handleSort('name')}
                  className="py-3.5 px-4 cursor-pointer hover:text-cyan-400"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Asset & Symbol</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-3">Asset Type</th>
                <th className="py-3.5 px-3">Custody Source</th>
                <th
                  onClick={() => handleSort('units')}
                  className="py-3.5 px-3 text-right cursor-pointer hover:text-cyan-400"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Units</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('invested_value')}
                  className="py-3.5 px-3 text-right cursor-pointer hover:text-cyan-400"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Invested</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('current_value')}
                  className="py-3.5 px-3 text-right cursor-pointer hover:text-cyan-400"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Current Value</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('unrealized_pl')}
                  className="py-3.5 px-3 text-right cursor-pointer hover:text-cyan-400"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Unrealized P/L</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('allocation_percent')}
                  className="py-3.5 px-4 text-right cursor-pointer hover:text-cyan-400"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Alloc</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05] text-xs">
              {filteredHoldings.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <p className="text-sm font-medium">No holdings match the current filter criteria.</p>
                    <button
                      onClick={() => {
                        setSelectedType('ALL');
                        setSelectedSource('ALL');
                        setPerformanceFilter('ALL');
                        setSearchQuery('');
                      }}
                      className="mt-3 text-xs text-cyan-400 hover:underline"
                    >
                      Clear all filters
                    </button>
                  </td>
                </tr>
              ) : (
                filteredHoldings.map((h) => {
                  const isProfit = h.unrealized_pl >= 0;
                  return (
                    <tr
                      key={h.id}
                      onClick={() => openAssetModal(h)}
                      className="hover:bg-cyan-500/[0.04] transition-colors cursor-pointer group"
                    >
                      {/* Asset & Symbol */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center text-slate-300 group-hover:border-cyan-400/50 group-hover:text-cyan-400 transition-all">
                            <Building2 className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-bold text-white group-hover:text-cyan-300 transition-colors">
                              {h.name}
                            </div>
                            <div className="text-[11px] font-mono text-slate-400">
                              {h.symbol} • <span className="text-slate-500">{h.sector || 'General'}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Asset Type */}
                      <td className="py-3.5 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border ${getBadgeStyle(h.asset_type)}`}>
                          {h.asset_type}
                        </span>
                      </td>

                      {/* Custody Source */}
                      <td className="py-3.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${getSourceBadge(h.source)}`}>
                          {h.source}
                        </span>
                      </td>

                      {/* Units */}
                      <td className="py-3.5 px-3 text-right font-mono font-medium text-slate-200">
                        {h.units.toLocaleString('en-IN')}
                        <div className="text-[10px] text-slate-500">@ ₹{h.avg_buy_price.toLocaleString('en-IN')}</div>
                      </td>

                      {/* Invested Value */}
                      <td className="py-3.5 px-3 text-right font-mono text-slate-300">
                        {formatCurrency(h.invested_value)}
                      </td>

                      {/* Current Value */}
                      <td className="py-3.5 px-3 text-right font-mono font-bold text-white">
                        {formatCurrency(h.current_value)}
                        <div className="text-[10px] text-slate-400">@ ₹{h.current_price.toLocaleString('en-IN')}</div>
                      </td>

                      {/* Unrealized P/L */}
                      <td className="py-3.5 px-3 text-right font-mono">
                        <div className={`font-bold flex items-center justify-end gap-1 ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {isProfit ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          <span>{isProfit ? '+' : ''}{formatCurrency(h.unrealized_pl)}</span>
                        </div>
                        <div className={`text-[10px] font-semibold ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {h.unrealized_pl_percent > 0 ? '+' : ''}{h.unrealized_pl_percent}%
                        </div>
                      </td>

                      {/* Allocation % */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="font-mono font-bold text-cyan-300">{h.allocation_percent}%</div>
                        <div className="w-16 bg-white/10 h-1.5 rounded-full ml-auto mt-1 overflow-hidden">
                          <div
                            className="bg-cyan-400 h-full rounded-full"
                            style={{ width: `${Math.min(h.allocation_percent * 2, 100)}%` }}
                          />
                        </div>
                      </td>

                      {/* Details Click */}
                      <td className="py-3.5 px-3 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openAssetModal(h);
                          }}
                          className="p-1 rounded-md text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition-all"
                          title="Open detailed view"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Summary Bar */}
        <div className="p-4 bg-white/[0.02] border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-4">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Click any holding row to inspect cash flows, yield history, and trigger AI educational explanations.</span>
          </div>

          <div className="flex items-center gap-4 font-mono">
            <span>Filtered Value: <strong>{formatCurrency(filteredHoldings.reduce((sum, h) => sum + h.current_value, 0))}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
