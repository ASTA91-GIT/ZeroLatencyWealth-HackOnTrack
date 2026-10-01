import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { marketWS } from '../services/marketWebSocket';
import { MarketQuote, CompanyFundamentals, MarketDepthData, MarketNews, OptionChainData } from '../types';
import { LightweightChart } from '../components/trading/LightweightChart';
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Bookmark,
  Bell,
  Coins,
  Sparkles,
  Layers,
  FileText,
  BarChart2,
  Building,
  ShieldAlert,
  Clock,
  ExternalLink,
  ChevronRight,
  Info,
  Activity
} from 'lucide-react';

export const InstrumentDetailView: React.FC = () => {
  const {
    selectedMarketSymbol,
    setCurrentView,
    openPaperTradeModal,
    toggleWatchlist,
    isWatchlisted,
    setIsCopilotDrawerOpen,
    setSelectedAsset,
    showToast,
    requireAuth,
  } = useApp();

  const symbol = (selectedMarketSymbol || 'RELIANCE').toUpperCase();

  const [quote, setQuote] = useState<MarketQuote | null>(null);
  const [fundamentals, setFundamentals] = useState<CompanyFundamentals | null>(null);
  const [depth, setDepth] = useState<MarketDepthData | null>(null);
  const [news, setNews] = useState<MarketNews[]>([]);
  const [optionChain, setOptionChain] = useState<OptionChainData | null>(null);
  const [indicators, setIndicators] = useState<{
    rsi?: number;
    macd?: { macd: number; signal: number; hist: number };
    bollinger?: { upper: number; middle: number; lower: number };
    atr?: number;
    vwap?: number;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<'chart' | 'technicals' | 'fundamentals' | 'options' | 'depth' | 'news'>('chart');
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [alertPrice, setAlertPrice] = useState<string>('');
  const [alertCondition, setAlertCondition] = useState<string>('ABOVE');
  const [loading, setLoading] = useState(true);

  // Fetch initial instrument data
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const loadData = async () => {
      try {
        const [qData, fData, dData, nData, optData, rsiData, macdData, bbData, atrData, vwapData] = await Promise.all([
          api.getMarketQuoteDetail(symbol).catch(() => null),
          api.getCompanyFundamentals(symbol).catch(() => null),
          api.getMarketDepth(symbol).catch(() => null),
          api.getMarketNews('Stocks').catch(() => []),
          api.getOptionChain(symbol).catch(() => null),
          api.getIndicators(symbol, 'RSI', 14).catch(() => null),
          api.getIndicators(symbol, 'MACD').catch(() => null),
          api.getIndicators(symbol, 'BOLLINGER', 20).catch(() => null),
          api.getIndicators(symbol, 'ATR', 14).catch(() => null),
          api.getIndicators(symbol, 'VWAP').catch(() => null),
        ]);

        if (isMounted) {
          if (qData) {
            setQuote(qData);
            setAlertPrice(String(qData.last_price || (qData as any).price || ''));
          }
          if (fData) setFundamentals(fData);
          if (dData) setDepth(dData);
          if (nData) setNews(nData);
          if (optData) setOptionChain(optData);

          const latestRsi = Array.isArray(rsiData) && rsiData.length > 0 ? rsiData[rsiData.length - 1].value : undefined;
          const latestMacd = Array.isArray(macdData) && macdData.length > 0 ? macdData[macdData.length - 1] : undefined;
          const latestBb = Array.isArray(bbData) && bbData.length > 0 ? bbData[bbData.length - 1] : undefined;
          const latestAtr = Array.isArray(atrData) && atrData.length > 0 ? atrData[atrData.length - 1].value : undefined;
          const latestVwap = Array.isArray(vwapData) && vwapData.length > 0 ? vwapData[vwapData.length - 1].value : undefined;

          setIndicators({
            rsi: latestRsi,
            macd: latestMacd,
            bollinger: latestBb,
            atr: latestAtr,
            vwap: latestVwap,
          });

          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to load instrument detail', err);
        if (isMounted) setLoading(false);
      }
    };

    loadData();

    // Subscribe to live price ticks
    marketWS.subscribe([symbol]);

    const unsubTick = marketWS.onTick((tick) => {
      if (tick.symbol.toUpperCase() === symbol) {
        setQuote((prev) => (prev ? { ...prev, ...tick } : tick));
      }
    });

    return () => {
      isMounted = false;
      unsubTick();
      marketWS.unsubscribe([symbol]);
    };
  }, [symbol]);

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requireAuth('set real-time price alerts')) return;

    const target = parseFloat(alertPrice);
    if (isNaN(target) || target <= 0) {
      showToast('Please enter a valid target price', 'warning');
      return;
    }

    try {
      await api.createAlert({
        symbol,
        target_price: target,
        condition: alertCondition,
      });
      showToast(`Alert set for ${symbol} when price moves ${alertCondition} ₹${target}`, 'success');
      setAlertModalOpen(false);
    } catch (err: any) {
      showToast(err.message || 'Failed to create alert', 'error');
    }
  };

  const handleCopilotQuery = () => {
    if (quote) {
      setSelectedAsset(quote as any);
    }
    setIsCopilotDrawerOpen(true);
  };

  const currentPrice = quote?.last_price || (quote as any)?.price || 0;
  const change = quote?.change || 0;
  const changePct = quote?.change_percent || (quote as any)?.change_24h || 0;
  const isUp = change >= 0;
  const watchlisted = isWatchlisted(symbol) || (quote?.id ? isWatchlisted(quote.id) : false);

  return (
    <div className="space-y-6 pb-20 text-zinc-100">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between border-b border-[#27272A] pb-4">
        <button
          onClick={() => setCurrentView('markets')}
          className="flex items-center space-x-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Markets</span>
        </button>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setAlertModalOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-xs font-medium text-zinc-300 hover:text-white transition-all"
          >
            <Bell className="w-3.5 h-3.5 text-amber-400" />
            <span>Set Alert</span>
          </button>

          <button
            onClick={() => toggleWatchlist(symbol)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
              watchlisted
                ? 'bg-violet-600 border-violet-600 text-white'
                : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 fill-current" />
            <span>{watchlisted ? 'Watchlisted' : 'Watchlist'}</span>
          </button>

          <button
            onClick={() => quote && openPaperTradeModal(quote)}
            className="flex items-center space-x-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-900/30 transition-all cursor-pointer"
          >
            <Coins className="w-3.5 h-3.5" />
            <span>Paper Trade</span>
          </button>

          <button
            onClick={handleCopilotQuery}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-violet-600/20 border border-violet-500/40 text-violet-300 hover:bg-violet-600/30 text-xs font-bold transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Copilot</span>
          </button>
        </div>
      </div>

      {/* Instrument Hero Header */}
      <div className="bg-[#121214] border border-[#27272A] rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{symbol}</h1>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                {quote?.exchange || 'NSE'}
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-violet-500/10 text-violet-400 border border-violet-500/30">
                {quote?.asset_type || 'EQUITY'}
              </span>
              <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1.5" />
                LIVE STREAM
              </span>
            </div>
            <p className="text-sm text-zinc-400 font-medium">{quote?.name || fundamentals?.company_name || symbol}</p>
          </div>

          {/* Current Live Price Block */}
          <div className="flex items-baseline space-x-4">
            <div>
              <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white">
                ₹{currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <span
                  className={`flex items-center text-sm font-mono font-bold ${
                    isUp ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {isUp ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                  {change >= 0 ? `+${change.toFixed(2)}` : change.toFixed(2)} ({changePct >= 0 ? `+${changePct.toFixed(2)}%` : `${changePct.toFixed(2)}%`})
                </span>
                <span className="text-xs text-zinc-400 font-mono">Today</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mt-6 pt-6 border-t border-[#27272A] text-xs font-mono">
          <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80">
            <span className="text-zinc-400 block text-[11px] font-sans">Open</span>
            <strong className="text-zinc-200 text-sm">₹{quote?.open || '—'}</strong>
          </div>
          <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80">
            <span className="text-zinc-400 block text-[11px] font-sans">Day High</span>
            <strong className="text-emerald-400 text-sm">₹{quote?.high || '—'}</strong>
          </div>
          <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80">
            <span className="text-zinc-400 block text-[11px] font-sans">Day Low</span>
            <strong className="text-red-400 text-sm">₹{quote?.low || '—'}</strong>
          </div>
          <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80">
            <span className="text-zinc-400 block text-[11px] font-sans">Prev Close</span>
            <strong className="text-zinc-200 text-sm">₹{quote?.previous_close || '—'}</strong>
          </div>
          <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80">
            <span className="text-zinc-400 block text-[11px] font-sans">Volume</span>
            <strong className="text-zinc-200 text-sm">{quote?.volume ? quote.volume.toLocaleString('en-IN') : '—'}</strong>
          </div>
          <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80">
            <span className="text-zinc-400 block text-[11px] font-sans">52W Range</span>
            <strong className="text-zinc-200 text-xs">
              {quote?.day_52w_low ? `₹${quote.day_52w_low} - ₹${quote.day_52w_high}` : '—'}
            </strong>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-[#27272A] space-x-6 text-sm font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab('chart')}
          className={`pb-3 flex items-center space-x-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'chart'
              ? 'border-b-2 border-violet-500 text-violet-400 font-bold'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <BarChart2 className="w-4 h-4" />
          <span>Interactive Chart</span>
        </button>

        <button
          onClick={() => setActiveTab('technicals')}
          className={`pb-3 flex items-center space-x-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'technicals'
              ? 'border-b-2 border-violet-500 text-violet-400 font-bold'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Technical Indicators</span>
        </button>

        <button
          onClick={() => setActiveTab('fundamentals')}
          className={`pb-3 flex items-center space-x-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'fundamentals'
              ? 'border-b-2 border-violet-500 text-violet-400 font-bold'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Fundamentals & Financials</span>
        </button>

        <button
          onClick={() => setActiveTab('options')}
          className={`pb-3 flex items-center space-x-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'options'
              ? 'border-b-2 border-violet-500 text-violet-400 font-bold'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Options Chain</span>
        </button>

        <button
          onClick={() => setActiveTab('depth')}
          className={`pb-3 flex items-center space-x-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'depth'
              ? 'border-b-2 border-violet-500 text-violet-400 font-bold'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Market Depth (L2)</span>
        </button>

        <button
          onClick={() => setActiveTab('news')}
          className={`pb-3 flex items-center space-x-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'news'
              ? 'border-b-2 border-violet-500 text-violet-400 font-bold'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Market News</span>
        </button>
      </div>

      {/* Tab Content 1: Interactive Lightweight Chart */}
      {activeTab === 'chart' && (
        <div className="space-y-4">
          <LightweightChart symbol={symbol} height={520} />
          <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-500 flex items-center space-x-2">
            <Info className="w-4 h-4 text-violet-400 shrink-0" />
            <span>
              Real-time exchange stream: Active candle updates incrementally tick-by-tick. SMA 20 (amber) and EMA 50 (blue) overlay calculated live from official exchange OHLCV data without interpolation.
            </span>
          </div>
        </div>
      )}

      {/* Tab Content 1.5: Technical Indicators */}
      {activeTab === 'technicals' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* RSI */}
            <div className="p-5 bg-[#121214] border border-[#27272A] rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>RSI (14-Period)</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                  {indicators?.rsi !== undefined
                    ? indicators.rsi < 30
                      ? 'Oversold'
                      : indicators.rsi > 70
                      ? 'Overbought'
                      : 'Neutral'
                    : 'N/A'}
                </span>
              </div>
              <div className="text-2xl font-mono font-bold text-white">
                {indicators?.rsi !== undefined ? indicators.rsi.toFixed(2) : 'Data unavailable'}
              </div>
              <p className="text-[11px] text-zinc-500">
                Momentum oscillator measuring the speed and change of price movements.
              </p>
            </div>

            {/* MACD */}
            <div className="p-5 bg-[#121214] border border-[#27272A] rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>MACD (12, 26, 9)</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                  {indicators?.macd ? (indicators.macd.macd >= indicators.macd.signal ? 'Bullish' : 'Bearish') : 'N/A'}
                </span>
              </div>
              <div className="text-sm font-mono text-zinc-300 space-y-1">
                <div className="flex justify-between">
                  <span className="text-zinc-500">MACD:</span>
                  <span className="text-white font-bold">{indicators?.macd ? indicators.macd.macd.toFixed(2) : '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Signal:</span>
                  <span className="text-zinc-300">{indicators?.macd ? indicators.macd.signal.toFixed(2) : '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Hist:</span>
                  <span className={indicators?.macd && indicators.macd.hist >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                    {indicators?.macd ? indicators.macd.hist.toFixed(2) : '—'}
                  </span>
                </div>
              </div>
            </div>

            {/* Bollinger Bands */}
            <div className="p-5 bg-[#121214] border border-[#27272A] rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Bollinger Bands (20, 2)</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">Volatility</span>
              </div>
              <div className="text-sm font-mono text-zinc-300 space-y-1">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Upper:</span>
                  <span className="text-white font-bold">{indicators?.bollinger ? `₹${indicators.bollinger.upper.toFixed(2)}` : '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Middle:</span>
                  <span className="text-zinc-300">{indicators?.bollinger ? `₹${indicators.bollinger.middle.toFixed(2)}` : '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Lower:</span>
                  <span className="text-white font-bold">{indicators?.bollinger ? `₹${indicators.bollinger.lower.toFixed(2)}` : '—'}</span>
                </div>
              </div>
            </div>

            {/* VWAP */}
            <div className="p-5 bg-[#121214] border border-[#27272A] rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>VWAP (Volume-Weighted)</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">Benchmark</span>
              </div>
              <div className="text-2xl font-mono font-bold text-white">
                {indicators?.vwap ? `₹${indicators.vwap.toFixed(2)}` : 'Data unavailable'}
              </div>
              <p className="text-[11px] text-zinc-500">
                Trading benchmark giving the average price a security has traded at throughout the day.
              </p>
            </div>

            {/* ATR */}
            <div className="p-5 bg-[#121214] border border-[#27272A] rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>ATR (14-Day Volatility)</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">True Range</span>
              </div>
              <div className="text-2xl font-mono font-bold text-white">
                {indicators?.atr ? `₹${indicators.atr.toFixed(2)}` : 'Data unavailable'}
              </div>
              <p className="text-[11px] text-zinc-500">
                Technical analysis volatility indicator showing average price range of asset over 14 periods.
              </p>
            </div>
          </div>

          <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-500 flex items-center space-x-2">
            <Info className="w-4 h-4 text-violet-400 shrink-0" />
            <span>
              All technical indicators are mathematically derived from verified exchange OHLCV data. No synthetic smoothing or simulated values.
            </span>
          </div>
        </div>
      )}

      {/* Tab Content: Options Desk */}
      {activeTab === 'options' && (
        <div className="space-y-6">
          <div className="p-8 text-center bg-[#121214] border border-[#27272A] rounded-2xl space-y-3">
            <ShieldAlert className="w-8 h-8 text-amber-400 mx-auto" />
            <h3 className="text-base font-bold text-zinc-200">
              {optionChain?.is_available ? `Options Chain for ${symbol}` : 'Options Chain Data Unavailable'}
            </h3>
            <p className="text-xs text-zinc-400 max-w-lg mx-auto">
              {optionChain?.message || 'Real-time option chain data and Greeks require dedicated exchange market-data licensing. ZeroLatency Wealth strictly presents verified feeds and never fabricates synthetic derivatives.'}
            </p>
            <div className="pt-2">
              <button
                onClick={() => setCurrentView('options')}
                className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs transition-all shadow-md shadow-violet-950/40"
              >
                Open Options Terminal Desk
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 2: Real Company Fundamentals */}
      {activeTab === 'fundamentals' && (
        <div className="space-y-6">
          {fundamentals?.is_available === false ? (
            <div className="p-8 text-center bg-[#121214] border border-[#27272A] rounded-2xl space-y-2">
              <ShieldAlert className="w-8 h-8 text-amber-400 mx-auto" />
              <h3 className="text-base font-bold text-zinc-200">Fundamental Data Unavailable</h3>
              <p className="text-xs text-zinc-500">{fundamentals.message || 'Fundamental data unavailable for this instrument.'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Key Ratios */}
              <div className="p-6 bg-[#121214] border border-[#27272A] rounded-2xl space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-violet-400 font-mono">Valuation & Profitability Metrics</h3>
                <div className="divide-y divide-zinc-800 text-xs">
                  <div className="py-2.5 flex justify-between">
                    <span className="text-zinc-400">P/E Ratio (Trailing)</span>
                    <span className="font-mono font-bold text-white">{fundamentals?.pe_ratio ? fundamentals.pe_ratio.toFixed(2) : 'Data unavailable'}</span>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <span className="text-zinc-400">P/B Ratio (Price / Book)</span>
                    <span className="font-mono font-bold text-white">{fundamentals?.pb_ratio ? fundamentals.pb_ratio.toFixed(2) : 'Data unavailable'}</span>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <span className="text-zinc-400">EPS (Earnings Per Share)</span>
                    <span className="font-mono font-bold text-white">{fundamentals?.eps ? `₹${fundamentals.eps.toFixed(2)}` : 'Data unavailable'}</span>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <span className="text-zinc-400">Dividend Yield</span>
                    <span className="font-mono font-bold text-white">{fundamentals?.dividend_yield ? `${(fundamentals.dividend_yield * 100).toFixed(2)}%` : 'Data unavailable'}</span>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <span className="text-zinc-400">Return on Equity (ROE)</span>
                    <span className="font-mono font-bold text-white">{fundamentals?.roe ? `${(fundamentals.roe * 100).toFixed(2)}%` : 'Data unavailable'}</span>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <span className="text-zinc-400">Debt-to-Equity Ratio</span>
                    <span className="font-mono font-bold text-white">{fundamentals?.debt_to_equity ? fundamentals.debt_to_equity.toFixed(2) : 'Data unavailable'}</span>
                  </div>
                </div>
              </div>

              {/* Profile & Description */}
              <div className="p-6 bg-[#121214] border border-[#27272A] rounded-2xl space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-violet-400 font-mono">Company Profile</h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-zinc-400 block mb-0.5">Sector & Industry</span>
                    <span className="font-medium text-white">{fundamentals?.sector || 'Diversified'} • {fundamentals?.industry || 'Commercial Enterprise'}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block mb-0.5">Market Capitalization</span>
                    <span className="font-mono font-bold text-white">
                      {fundamentals?.market_cap ? `₹${(fundamentals.market_cap / 1e7).toLocaleString('en-IN', { maximumFractionDigits: 2 })} Cr` : 'Data unavailable'}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block mb-0.5">Business Summary</span>
                    <p className="text-zinc-400 leading-relaxed max-h-48 overflow-y-auto pr-2">
                      {fundamentals?.description || 'Corporate profile data is queried from primary exchange regulatory filings.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab Content 3: Market Depth (Level 2) with Explicit Disclaimers (Requirement #25) */}
      {activeTab === 'depth' && (
        <div className="space-y-4">
          <div className="p-6 bg-[#121214] border border-[#27272A] rounded-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <h3 className="text-sm font-bold uppercase tracking-wider text-violet-400 font-mono">Level 2 Market Depth (5 Best Bids & Asks)</h3>
              <span className="text-[11px] font-mono text-zinc-400">Exchange: NSE Order Engine</span>
            </div>

            {depth?.is_available === false ? (
              <div className="py-12 text-center space-y-3">
                <ShieldAlert className="w-10 h-10 text-amber-500/80 mx-auto" />
                <h4 className="text-base font-bold text-zinc-200">Market depth unavailable for this instrument</h4>
                <p className="text-xs text-zinc-400 max-w-lg mx-auto">
                  {depth.message || 'Level 2 5-depth order book requires real exchange subscriber feed license. Data unavailable for public broadcast.'}
                </p>
                <div className="inline-flex items-center space-x-1.5 text-[11px] font-mono text-zinc-400 bg-zinc-950 px-3 py-1.5 rounded-lg border border-zinc-800 mt-2">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Regulatory notice: Simulated depth is strictly prohibited.</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 mt-4">
                {/* Bids */}
                <div>
                  <h4 className="text-xs font-bold text-emerald-400 uppercase font-mono mb-2">Buy Side (Bids)</h4>
                  {/* Bids list */}
                </div>
                {/* Asks */}
                <div>
                  <h4 className="text-xs font-bold text-red-400 uppercase font-mono mb-2">Sell Side (Asks)</h4>
                  {/* Asks list */}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab Content 4: Real News */}
      {activeTab === 'news' && (
        <div className="space-y-4">
          {news.length === 0 ? (
            <div className="p-8 text-center bg-[#121214] border border-[#27272A] rounded-2xl">
              <FileText className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-zinc-400">No recent market news available for this instrument category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {news.map((item) => (
                <div
                  key={item.id}
                  className="p-5 bg-[#121214] border border-[#27272A] hover:border-violet-500/40 rounded-xl space-y-2 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono mb-1.5">
                      <span className="font-semibold text-violet-400">{item.source}</span>
                      <span>{item.timestamp ? new Date(item.timestamp).toLocaleDateString() : 'Today'}</span>
                    </div>
                    <h4 className="text-sm font-bold text-zinc-100 leading-snug line-clamp-2">{item.headline}</h4>
                  </div>
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs text-violet-400 hover:text-violet-300 font-medium pt-2 mt-2 border-t border-zinc-800/80"
                    >
                      <span>Read full dispatch</span>
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Price Alert Creation Modal */}
      {alertModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#121214] border border-[#27272A] rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center space-x-2">
                <Bell className="w-4 h-4 text-violet-400" />
                <h3 className="text-sm font-bold text-white">Create Price Alert for {symbol}</h3>
              </div>
              <button
                onClick={() => setAlertModalOpen(false)}
                className="text-zinc-500 hover:text-zinc-300 text-lg leading-none"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateAlert} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1">Trigger Condition</label>
                <select
                  value={alertCondition}
                  onChange={(e) => setAlertCondition(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-violet-500"
                >
                  <option value="ABOVE">Price moves ABOVE target</option>
                  <option value="BELOW">Price moves BELOW target</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Target Price (₹)</label>
                <input
                  type="number"
                  step="0.05"
                  value={alertPrice}
                  onChange={(e) => setAlertPrice(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-violet-500"
                  required
                />
                <span className="text-[11px] text-zinc-400 mt-1 block">Current Price: ₹{currentPrice.toFixed(2)}</span>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAlertModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-bold"
                >
                  Create Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
