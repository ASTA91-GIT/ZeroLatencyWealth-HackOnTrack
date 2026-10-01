import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import type { MarketOverview, MarketQuote, AssetType } from '../types';
import {
  TrendingUp,
  TrendingDown,
  Search,
  SlidersHorizontal,
  Bookmark,
  Coins,
  Sparkles,
  Info,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Building2,
  RefreshCw,
  Layers,
  ChevronRight
} from 'lucide-react';

export const MarketsView: React.FC = () => {
  const {
    openAssetModal,
    openPaperTradeModal,
    toggleWatchlist,
    isWatchlisted,
    setIsCopilotDrawerOpen,
    setSelectedAsset,
    requireAuth,
    setCurrentView
  } = useApp();

  const [overview, setOverview] = useState<MarketOverview | null>(null);
  const [quotes, setQuotes] = useState<MarketQuote[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchMarketData = async () => {
    try {
      setRefreshing(true);
      const [ovData, qData] = await Promise.all([
        api.getMarketOverview(),
        api.getMarketQuotes({
          asset_type: selectedCategory !== 'ALL' ? selectedCategory : undefined,
          search: searchQuery.trim() || undefined
        })
      ]);
      setOverview(ovData);
      setQuotes(qData);
    } catch (err) {
      console.error('Failed to load market data', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
  }, [selectedCategory, searchQuery]);

  const categories = [
    { id: 'ALL', label: 'All Instruments' },
    { id: 'EQUITY', label: 'Equities & ETFs' },
    { id: 'BOND', label: 'Sovereign & Debt Bonds' },
    { id: 'REIT', label: 'Commercial REITs' },
    { id: 'INVIT', label: 'Infrastructure InvITs' },
  ];

  const handleAiExplain = (quote: MarketQuote) => {
    setSelectedAsset(quote as any);
    setIsCopilotDrawerOpen(true);
  };

  return (
    <div className="space-y-8 pb-20 text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
      {/* 1. TOP HEADER & MARKET STATUS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold tracking-widest text-purple-600 dark:text-purple-400 uppercase">
              PUBLIC MARKET EXPLORER
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
            Live Multi-Asset Quotes & Discovery
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1 max-w-2xl">
            Explore equities, sovereign debt, commercial REITs, and infrastructure InvITs normalized under one unified valuation engine.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/10 text-xs font-mono">
            <Clock className="w-3.5 h-3.5 text-purple-500" />
            <span className="text-zinc-500 dark:text-zinc-400">Market:</span>
            <span className="font-bold text-zinc-900 dark:text-white">
              {overview?.market_status || 'LIVE'}
            </span>
          </div>

          <button
            onClick={fetchMarketData}
            disabled={refreshing}
            className="p-2 rounded-xl border border-zinc-200 dark:border-white/10 hover:border-purple-400 text-zinc-600 dark:text-zinc-300 hover:text-purple-600 transition-all cursor-pointer"
            title="Refresh market data"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-purple-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2. MARKET BENCHMARK INDICES BAR */}
      {overview && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {overview.indices.map((idx) => {
            const isUp = idx.change >= 0;
            return (
              <div
                key={idx.symbol}
                className="p-4 rounded-2xl bg-zinc-50 dark:bg-[#121118] border border-zinc-200 dark:border-white/[0.08] hover:border-purple-500/40 transition-all shadow-sm"
              >
                <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                  <span className="font-bold tracking-tight text-zinc-900 dark:text-white truncate">
                    {idx.name}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-200/60 dark:bg-white/10">
                    {idx.symbol}
                  </span>
                </div>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-lg font-black font-mono text-zinc-900 dark:text-white">
                    {idx.symbol.includes('YIELD') || idx.symbol.includes('10Y')
                      ? `${idx.value.toFixed(2)}%`
                      : idx.value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                  <span
                    className={`flex items-center gap-0.5 text-xs font-mono font-bold ${
                      isUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {isUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                    <span>{idx.change_percent > 0 ? `+${idx.change_percent}%` : `${idx.change_percent}%`}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. SEARCH & CATEGORY SELECTOR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.35)]'
                  : 'bg-zinc-100 dark:bg-white/[0.04] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border border-zinc-200 dark:border-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by symbol, name, or sector..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 focus:border-purple-500 rounded-xl pl-9 pr-4 py-2 text-xs text-zinc-900 dark:text-white focus:outline-none transition-all placeholder:text-zinc-400"
          />
        </div>
      </div>

      {/* 4. NORMALIZED ASSET CARDS GRID */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin mx-auto" />
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">Syncing market quotes...</p>
        </div>
      ) : quotes.length === 0 ? (
        <div className="py-16 text-center rounded-3xl border border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-white/[0.01] p-8 space-y-3">
          <Building2 className="w-10 h-10 text-zinc-400 mx-auto" />
          <h3 className="text-base font-bold">No assets found matching your criteria</h3>
          <p className="text-xs text-zinc-500">Try modifying your search term or selecting another asset class.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quotes.map((quote) => {
            const isProfit = quote.change_24h >= 0;
            const watchlisted = isWatchlisted(quote.id) || isWatchlisted(quote.symbol);

            const badgeStyles = {
              EQUITY: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-500/30',
              BOND: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30',
              REIT: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300 border-purple-200 dark:border-purple-500/30',
              INVIT: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-300 border-amber-200 dark:border-amber-500/30',
              OTHER: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700'
            }[quote.asset_type] || 'bg-zinc-100 text-zinc-700';

            return (
              <div
                key={quote.id}
                className="group p-5 rounded-2xl bg-white dark:bg-[#121118] border border-zinc-200 dark:border-white/[0.08] hover:border-purple-500/50 transition-all shadow-sm hover:shadow-[0_0_25px_rgba(168,85,247,0.12)] flex flex-col justify-between"
              >
                <div>
                  {/* Top Card Bar */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-black text-zinc-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                          {quote.symbol}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border ${badgeStyles}`}>
                          {quote.asset_type}
                        </span>
                      </div>
                      <h4 className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mt-1 line-clamp-1">
                        {quote.name}
                      </h4>
                    </div>

                    <button
                      onClick={() => toggleWatchlist(quote.id)}
                      className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                        watchlisted
                          ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                          : 'border-zinc-200 dark:border-white/10 text-zinc-400 hover:text-purple-500 hover:bg-zinc-50 dark:hover:bg-white/[0.05]'
                      }`}
                      title={watchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
                    >
                      <Bookmark className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>

                  {/* Price & Change */}
                  <div className="mt-4 flex items-baseline justify-between border-y border-zinc-100 dark:border-white/[0.04] py-3">
                    <div>
                      <span className="text-xs text-zinc-400 block font-mono">Current Price</span>
                      <span className="text-xl font-bold font-mono text-zinc-900 dark:text-white">
                        ₹{quote.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-zinc-400 block font-mono">24h Change</span>
                      <span
                        className={`inline-flex items-center gap-0.5 text-xs font-mono font-bold ${
                          isProfit ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {isProfit ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                        <span>{quote.change_24h > 0 ? `+${quote.change_24h}%` : `${quote.change_24h}%`}</span>
                      </span>
                    </div>
                  </div>

                  {/* Metrics Row */}
                  <div className="grid grid-cols-2 gap-2 mt-3 text-[11px] font-mono">
                    <div className="p-2 rounded-lg bg-zinc-50 dark:bg-white/[0.02]">
                      <span className="text-zinc-500 dark:text-zinc-400 block text-[10px]">Indicative Yield</span>
                      <span className="font-bold text-purple-600 dark:text-purple-400">
                        {quote.annual_yield > 0 ? `${quote.annual_yield}%` : 'N/A'}
                      </span>
                    </div>
                    <div className="p-2 rounded-lg bg-zinc-50 dark:bg-white/[0.02]">
                      <span className="text-zinc-500 dark:text-zinc-400 block text-[10px]">Risk Profile</span>
                      <span className="font-bold text-zinc-700 dark:text-zinc-300">
                        {quote.risk_level || 'Moderate'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action Controls */}
                <div className="mt-5 pt-3 border-t border-zinc-100 dark:border-white/[0.06] flex items-center gap-2">
                  <button
                    onClick={() => openAssetModal(quote as any)}
                    className="flex-1 py-2 px-2.5 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/10 hover:border-purple-400 dark:hover:border-purple-500/40 hover:text-purple-600 dark:hover:text-white transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Info className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Details</span>
                  </button>

                  <button
                    onClick={() => openPaperTradeModal(quote)}
                    className="flex-1 py-2 px-2.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 shadow-sm transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Coins className="w-3.5 h-3.5" />
                    <span>Trade</span>
                  </button>

                  <button
                    onClick={() => handleAiExplain(quote)}
                    className="p-2 rounded-xl text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-600/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-all cursor-pointer"
                    title="Explain with Local AI"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. PUBLIC WEALTH OS CTA CALLOUT BANNER */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-purple-950/50 via-[#161224] to-indigo-950/50 border border-purple-500/30 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-purple-400 font-bold">
            UNIFIED MULTI-ASSET INTELLIGENCE
          </span>
          <h3 className="text-2xl font-black text-white tracking-tight">
            Ready to unify all your holdings under ZeroLatency Wealth OS?
          </h3>
          <p className="text-xs text-zinc-300 leading-relaxed">
            Create your account to simulate paper trading with ₹10,00,000 initial capital, track personalized goals, and interact with the local AI Copilot.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setCurrentView('signup')}
              className="px-6 py-3 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all cursor-pointer"
            >
              Create Free Account
            </button>
            <button
              onClick={() => setCurrentView('login')}
              className="px-5 py-3 rounded-xl text-xs font-semibold text-zinc-300 bg-white/10 hover:bg-white/15 border border-white/10 transition-all cursor-pointer"
            >
              Sign In to Terminal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
