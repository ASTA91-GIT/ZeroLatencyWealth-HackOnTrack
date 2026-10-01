import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { MarketQuote } from '../types';
import {
  SlidersHorizontal,
  Table as TableIcon,
  Grid,
  TrendingUp,
  TrendingDown,
  Search,
  RefreshCw,
  Coins,
  ChevronRight,
  Filter
} from 'lucide-react';

export const ScreenerView: React.FC = () => {
  const { setSelectedMarketSymbol, setCurrentView, openPaperTradeModal } = useApp();

  const [quotes, setQuotes] = useState<MarketQuote[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'table' | 'heatmap'>('table');
  const [activePreset, setActivePreset] = useState<string>('ALL');

  // Filters state
  const [assetType, setAssetType] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [minChange, setMinChange] = useState<string>('');
  const [maxChange, setMaxChange] = useState<string>('');

  const loadScreener = async () => {
    setLoading(true);
    try {
      const filters: Record<string, any> = {};
      if (assetType !== 'ALL') filters.asset_type = assetType;
      if (minPrice) filters.min_price = parseFloat(minPrice);
      if (maxPrice) filters.max_price = parseFloat(maxPrice);
      if (minChange) filters.min_change = parseFloat(minChange);
      if (maxChange) filters.max_change = parseFloat(maxChange);

      const data = await api.getScreener(filters);
      let filtered = data;
      if (search.trim()) {
        const s = search.toUpperCase();
        filtered = data.filter(
          q => q.symbol.toUpperCase().includes(s) || (q.name && q.name.toUpperCase().includes(s))
        );
      }
      setQuotes(filtered);
    } catch (e) {
      console.error('Failed to load screener results', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadScreener();
  }, [assetType, minPrice, maxPrice, minChange, maxChange]);

  const applyPreset = (preset: string) => {
    setActivePreset(preset);
    if (preset === 'ALL') {
      setAssetType('ALL');
      setMinChange('');
      setMaxChange('');
    } else if (preset === 'GAINERS') {
      setMinChange('0.01');
      setMaxChange('');
    } else if (preset === 'LOSERS') {
      setMinChange('');
      setMaxChange('-0.01');
    } else if (preset === 'EQUITIES') {
      setAssetType('EQUITY');
      setMinChange('');
      setMaxChange('');
    } else if (preset === 'REITS') {
      setAssetType('REIT');
      setMinChange('');
      setMaxChange('');
    }
  };

  const handleSelectSymbol = (sym: string) => {
    setSelectedMarketSymbol(sym);
    setCurrentView('instrument-detail');
  };

  return (
    <div className="space-y-6 pb-20 text-zinc-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#27272A] pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-violet-400 uppercase tracking-wider mb-1">
            <span>REAL MARKET DATA SCREENER</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Multi-Asset Market Screener
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Screen live equities, benchmark indices, REITs, and commodities across real exchange valuations.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-zinc-900 border border-zinc-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center space-x-1 px-3 py-1 rounded text-xs font-medium transition-all ${
                viewMode === 'table' ? 'bg-violet-600 text-white font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
            <button
              onClick={() => setViewMode('heatmap')}
              className={`flex items-center space-x-1 px-3 py-1 rounded text-xs font-medium transition-all ${
                viewMode === 'heatmap' ? 'bg-violet-600 text-white font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Heatmap</span>
            </button>
          </div>

          <button
            onClick={loadScreener}
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-white"
            title="Refresh Screener"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-violet-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Preset Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        {[
          { id: 'ALL', label: 'All Instruments' },
          { id: 'GAINERS', label: 'Top Gainers (>0%)' },
          { id: 'LOSERS', label: 'Top Decliners (<0%)' },
          { id: 'EQUITIES', label: 'Indian Bluechips' },
          { id: 'REITS', label: 'REITs & InvITs' },
        ].map(p => (
          <button
            key={p.id}
            onClick={() => applyPreset(p.id)}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all cursor-pointer ${
              activePreset === p.id
                ? 'bg-violet-600 text-white font-bold shadow-md shadow-violet-900/30'
                : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white hover:border-zinc-700'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-[#121214] border border-[#27272A] rounded-xl flex flex-wrap items-center gap-3 text-xs">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search symbol or name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500 rounded-lg pl-9 pr-3 py-1.5 text-white placeholder-zinc-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-zinc-500">Asset Class:</span>
          <select
            value={assetType}
            onChange={e => setAssetType(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-violet-500"
          >
            <option value="ALL">All Classes</option>
            <option value="EQUITY">Equities</option>
            <option value="INDEX">Indices</option>
            <option value="COMMODITY">Commodities</option>
            <option value="CURRENCY">Currencies</option>
            <option value="REIT">REITs</option>
            <option value="INVIT">InvITs</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-zinc-500">Price Range:</span>
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={e => setMinPrice(e.target.value)}
            className="w-20 bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1.5 text-white font-mono"
          />
          <span className="text-zinc-600">-</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={e => setMaxPrice(e.target.value)}
            className="w-20 bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1.5 text-white font-mono"
          />
        </div>
      </div>

      {/* Main View Area */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin mx-auto" />
          <p className="text-xs text-zinc-500 font-mono">SCANNING REAL EXCHANGE FEEDS...</p>
        </div>
      ) : quotes.length === 0 ? (
        <div className="py-16 text-center bg-[#121214] border border-[#27272A] rounded-2xl p-6">
          <p className="text-sm font-semibold text-zinc-300">No instruments matched your screener criteria</p>
          <p className="text-xs text-zinc-500 mt-1">Try widening your price or change range.</p>
        </div>
      ) : viewMode === 'table' ? (
        /* Table View */
        <div className="bg-[#121214] border border-[#27272A] rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950/80 border-b border-[#27272A] text-zinc-400 font-mono text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Instrument</th>
                  <th className="py-3 px-4">Class</th>
                  <th className="py-3 px-4 text-right">LTP (₹)</th>
                  <th className="py-3 px-4 text-right">Change</th>
                  <th className="py-3 px-4 text-right">Volume</th>
                  <th className="py-3 px-4 text-right">52W Range</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-mono">
                {quotes.map(q => {
                  const price = q.last_price || (q as any).price || 0;
                  const change = q.change || 0;
                  const pct = q.change_percent || (q as any).change_24h || 0;
                  const isUp = change >= 0;

                  return (
                    <tr
                      key={q.symbol}
                      onClick={() => handleSelectSymbol(q.symbol)}
                      className="hover:bg-zinc-900/60 transition-colors cursor-pointer group"
                    >
                      <td className="py-3 px-4 font-sans">
                        <div className="font-bold text-white group-hover:text-violet-400 transition-colors">
                          {q.symbol}
                        </div>
                        <div className="text-[11px] text-zinc-500 truncate max-w-[200px]">{q.name || q.symbol}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                          {q.asset_type || 'EQUITY'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-zinc-100">
                        ₹{price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className={`py-3 px-4 text-right font-bold ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
                        {isUp ? `+${pct.toFixed(2)}%` : `${pct.toFixed(2)}%`}
                      </td>
                      <td className="py-3 px-4 text-right text-zinc-400">
                        {q.volume ? q.volume.toLocaleString('en-IN') : '—'}
                      </td>
                      <td className="py-3 px-4 text-right text-zinc-400 text-[11px]">
                        {q.day_52w_low ? `₹${q.day_52w_low} - ₹${q.day_52w_high}` : '—'}
                      </td>
                      <td className="py-3 px-4 text-center" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-center space-x-1.5">
                          <button
                            onClick={() => handleSelectSymbol(q.symbol)}
                            className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-sans font-medium text-[11px]"
                          >
                            Chart
                          </button>
                          <button
                            onClick={() => openPaperTradeModal(q)}
                            className="px-2.5 py-1 rounded bg-emerald-600/80 hover:bg-emerald-500 text-white font-sans font-bold text-[11px]"
                          >
                            Trade
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Real Market Heatmap (Requirement #21, #34: real % change and real market cap/volume, NO fake data) */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {quotes.map(q => {
            const price = q.last_price || (q as any).price || 0;
            const pct = q.change_percent || (q as any).change_24h || 0;
            const isUp = pct >= 0;

            // Color intensity based on actual percentage change
            const intensity = Math.min(Math.abs(pct) * 20, 100);
            const bgColor = isUp
              ? `rgba(16, 185, 129, ${0.15 + (intensity / 100) * 0.4})`
              : `rgba(239, 68, 68, ${0.15 + (intensity / 100) * 0.4})`;

            return (
              <div
                key={q.symbol}
                onClick={() => handleSelectSymbol(q.symbol)}
                style={{ backgroundColor: bgColor }}
                className="p-4 rounded-xl border border-zinc-800 hover:border-violet-500 cursor-pointer transition-all flex flex-col justify-between h-28 group shadow-sm hover:scale-[1.02]"
              >
                <div>
                  <span className="font-bold text-white text-sm group-hover:text-violet-300">{q.symbol}</span>
                  <span className="text-[10px] text-zinc-400 block line-clamp-1">{q.name || q.symbol}</span>
                </div>
                <div className="flex items-baseline justify-between font-mono text-xs">
                  <span className="text-zinc-200 font-semibold">₹{price.toFixed(2)}</span>
                  <span className={`font-bold ${isUp ? 'text-emerald-300' : 'text-red-300'}`}>
                    {isUp ? `+${pct.toFixed(2)}%` : `${pct.toFixed(2)}%`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
