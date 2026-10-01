import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { marketWS } from '../services/marketWebSocket';
import { MarketOverview, MarketQuote, MarketBreadthData } from '../types';
import { MarketTickerTape } from '../components/trading/MarketTickerTape';
import {
  TrendingUp,
  TrendingDown,
  Search,
  Bookmark,
  Coins,
  Sparkles,
  BarChart2,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Building,
  Layers,
  Activity,
  Globe,
  DollarSign
} from 'lucide-react';

export const MarketsView: React.FC = () => {
  const {
    openPaperTradeModal,
    toggleWatchlist,
    isWatchlisted,
    setIsCopilotDrawerOpen,
    setSelectedAsset,
    setSelectedMarketSymbol,
    setCurrentView,
  } = useApp();

  const [quotes, setQuotes] = useState<MarketQuote[]>([]);
  const [breadth, setBreadth] = useState<MarketBreadthData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('EQUITY');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const categories = [
    { id: 'EQUITY', label: 'Indian Equities' },
    { id: 'INDEX', label: 'Benchmark Indices' },
    { id: 'COMMODITY', label: 'Commodities (Gold/Silver/Crude)' },
    { id: 'CURRENCY', label: 'Currencies (USD/EUR/INR)' },
    { id: 'REIT', label: 'Commercial REITs' },
    { id: 'INVIT', label: 'Infrastructure InvITs' },
  ];

  const fetchMarketData = async () => {
    try {
      setRefreshing(true);
      const [quotesData, breadthData] = await Promise.all([
        api.getMarketQuotes({
          asset_type: selectedCategory !== 'ALL' ? selectedCategory : undefined,
          search: searchQuery.trim() || undefined,
        }),
        api.getBreadth().catch(() => null),
      ]);

      setQuotes(quotesData);
      if (breadthData) setBreadth(breadthData);
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

  // Subscribe to live WebSocket quotes for currently displayed symbols
  useEffect(() => {
    if (quotes.length === 0) return;
    const symbols = quotes.map((q) => q.symbol);
    marketWS.subscribe(symbols);

    const unsubTick = marketWS.onTick((tickQuote) => {
      setQuotes((prev) =>
        prev.map((item) => (item.symbol.toUpperCase() === tickQuote.symbol.toUpperCase() ? { ...item, ...tickQuote } : item))
      );
    });

    return () => {
      unsubTick();
      marketWS.unsubscribe(symbols);
    };
  }, [quotes]);

  const handleOpenDetail = (sym: string) => {
    setSelectedMarketSymbol(sym);
    setCurrentView('instrument-detail');
  };

  const handleAiExplain = (quote: MarketQuote) => {
    setSelectedAsset(quote as any);
    setIsCopilotDrawerOpen(true);
  };

  return (
    <div className="space-y-6 pb-20 text-zinc-100">
      {/* 1. REAL-TIME TICKER TAPE BAR (Indian Indices, Global Indices, Commodities, Currencies) */}
      <MarketTickerTape />

      {/* 2. HEADER & MARKET BREADTH */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-[#27272A] pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-violet-400 uppercase tracking-wider mb-1">
            <span>UNIFIED FINANCIAL MARKET TERMINAL</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Real-Time Market Intelligence
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
            Stream live equity valuations, sovereign gold, currencies, and real estate investment trusts directly from verified exchange market feeds.
          </p>
        </div>

        {/* Market Breadth Card (Requirement #35) */}
        {breadth && (
          <div className="flex items-center space-x-4 p-3 bg-[#121214] border border-[#27272A] rounded-xl text-xs font-mono">
            <div className="text-center pr-3 border-r border-zinc-800">
              <span className="text-[10px] text-zinc-500 uppercase block">Advancers</span>
              <strong className="text-emerald-400 text-sm font-bold">{breadth.advances}</strong>
            </div>
            <div className="text-center pr-3 border-r border-zinc-800">
              <span className="text-[10px] text-zinc-500 uppercase block">Decliners</span>
              <strong className="text-red-400 text-sm font-bold">{breadth.declines}</strong>
            </div>
            <div className="text-center">
              <span className="text-[10px] text-zinc-500 uppercase block">Unchanged</span>
              <strong className="text-zinc-400 text-sm font-bold">{breadth.unchanged}</strong>
            </div>
          </div>
        )}
      </div>

      {/* 3. SEARCH & CATEGORIES */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-violet-600 text-white font-bold shadow-lg shadow-violet-900/40'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Real Symbol Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search RELIANCE, NIFTY, GOLD, USDINR..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#121214] border border-[#27272A] focus:border-violet-500 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* 4. REAL QUOTE CARDS GRID */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin mx-auto" />
          <p className="text-xs text-zinc-500 font-mono tracking-wide">STREAMING REAL EXCHANGE QUOTES...</p>
        </div>
      ) : quotes.length === 0 ? (
        <div className="py-16 text-center rounded-3xl border border-[#27272A] bg-[#121214] p-8 space-y-3">
          <Building className="w-10 h-10 text-zinc-600 mx-auto" />
          <h3 className="text-base font-bold text-zinc-300">No instruments found matching your search</h3>
          <p className="text-xs text-zinc-500">Please try another symbol or category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quotes.map((quote) => {
            const price = quote.last_price || (quote as any).price || 0;
            const change = quote.change || 0;
            const changePct = quote.change_percent || (quote as any).change_24h || 0;
            const isUp = change >= 0;
            const watchlisted = isWatchlisted(quote.symbol) || (quote.id ? isWatchlisted(quote.id) : false);

            return (
              <div
                key={quote.symbol}
                onClick={() => handleOpenDetail(quote.symbol)}
                className="group p-5 rounded-2xl bg-[#121214] border border-[#27272A] hover:border-violet-500/50 transition-all shadow-md hover:shadow-violet-950/20 flex flex-col justify-between cursor-pointer"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-base font-black text-white group-hover:text-violet-400 transition-colors">
                          {quote.symbol}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-zinc-800 text-zinc-300 border border-zinc-700">
                          {quote.asset_type}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-500">
                          {quote.exchange || 'NSE'}
                        </span>
                      </div>
                      <h4 className="text-xs font-medium text-zinc-400 mt-1 line-clamp-1">
                        {quote.name || quote.symbol}
                      </h4>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWatchlist(quote.symbol);
                      }}
                      className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                        watchlisted
                          ? 'bg-violet-600 text-white border-violet-600 shadow-sm'
                          : 'border-zinc-800 text-zinc-500 hover:text-white hover:bg-zinc-800'
                      }`}
                      title={watchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
                    >
                      <Bookmark className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>

                  {/* Price Row */}
                  <div className="mt-4 flex items-baseline justify-between font-mono">
                    <span className="text-2xl font-black text-white">
                      ₹{price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span
                      className={`flex items-center text-xs font-bold ${
                        isUp ? 'text-emerald-400' : 'text-red-400'
                      }`}
                    >
                      {isUp ? <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> : <TrendingDown className="w-3.5 h-3.5 mr-0.5" />}
                      {change >= 0 ? `+${change.toFixed(2)}` : change.toFixed(2)} ({changePct >= 0 ? `+${changePct.toFixed(2)}%` : `${changePct.toFixed(2)}%`})
                    </span>
                  </div>

                  {/* Volume & Range */}
                  <div className="mt-3 pt-3 border-t border-zinc-800/80 grid grid-cols-2 text-[11px] font-mono text-zinc-500">
                    <div>
                      <span>Vol: </span>
                      <strong className="text-zinc-300">{quote.volume ? quote.volume.toLocaleString('en-IN') : '—'}</strong>
                    </div>
                    <div className="text-right">
                      <span>52W: </span>
                      <strong className="text-zinc-300">{quote.day_52w_high ? `₹${quote.day_52w_high}` : '—'}</strong>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Strip */}
                <div
                  className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between text-xs"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => handleOpenDetail(quote.symbol)}
                    className="flex items-center space-x-1 text-zinc-400 hover:text-white transition-colors"
                  >
                    <BarChart2 className="w-3.5 h-3.5 text-violet-400" />
                    <span>Chart</span>
                  </button>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleAiExplain(quote)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-violet-400 hover:bg-zinc-800 transition-colors"
                      title="Ask ZeroLatency Copilot about this asset"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => openPaperTradeModal(quote)}
                      className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-950/40 transition-all cursor-pointer"
                    >
                      <Coins className="w-3.5 h-3.5" />
                      <span>Trade</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
