import React from 'react';
import type { HoldingModel, AssetModel, MarketQuote } from '../types';
import { useApp } from '../context/AppContext';
import {
  X,
  TrendingUp,
  TrendingDown,
  Shield,
  Coins,
  ExternalLink,
  Sparkles,
  Building2,
  Database,
  Bookmark,
  Check
} from 'lucide-react';

interface AssetDetailModalProps {
  asset: HoldingModel | AssetModel | MarketQuote | null;
  onClose: () => void;
}

export const AssetDetailModal: React.FC<AssetDetailModalProps> = ({ asset, onClose }) => {
  const {
    setCurrentView,
    setIsCopilotDrawerOpen,
    setSelectedAsset,
    toggleWatchlist,
    isWatchlisted,
    openPaperTradeModal
  } = useApp();

  if (!asset) return null;

  const isHolding = 'units' in asset && 'invested_value' in asset;
  const holding = isHolding ? (asset as HoldingModel) : null;

  const currentPrice = ('price' in asset && typeof asset.price === 'number')
    ? asset.price
    : (holding ? holding.current_price : 0.0);
  const change24h = ('change_24h' in asset && typeof asset.change_24h === 'number')
    ? asset.change_24h
    : 0.0;
  const isProfit = holding ? holding.unrealized_pl >= 0 : change24h >= 0;

  const watchlisted = isWatchlisted(asset.id) || isWatchlisted(asset.symbol);

  const handleAskCopilot = () => {
    setSelectedAsset(asset as any);
    setIsCopilotDrawerOpen(true);
    onClose();
  };

  const handlePaperTrade = () => {
    openPaperTradeModal(asset);
    onClose();
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'EQUITY':
        return 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 border-blue-300 dark:border-blue-500/30';
      case 'BOND':
        return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/30';
      case 'REIT':
        return 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300 border-purple-300 dark:border-purple-500/30';
      case 'INVIT':
        return 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-300 border-amber-300 dark:border-amber-500/30';
      default:
        return 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-[#121118] border border-zinc-200 dark:border-purple-500/30 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Glow Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600" />

        {/* Modal Header */}
        <div className="p-6 border-b border-zinc-200 dark:border-white/10 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-white/[0.04] border border-purple-200 dark:border-white/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">{asset.name}</h3>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border ${getBadgeColor(asset.asset_type)}`}>
                  {asset.asset_type}
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono mt-0.5">
                Ticker: <span className="text-purple-600 dark:text-purple-400 font-semibold">{asset.symbol}</span> | Sector: {asset.sector || 'General Market'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleWatchlist(asset.id)}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                watchlisted
                  ? 'bg-purple-600 text-white border-purple-600'
                  : 'border-zinc-200 dark:border-white/10 text-zinc-500 hover:text-purple-600'
              }`}
              title={watchlisted ? 'In Watchlist' : 'Add to Watchlist'}
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/[0.05] transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Key Value Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.08]">
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400">Market Price</span>
              <p className="text-lg font-bold text-zinc-900 dark:text-white mt-1">₹{currentPrice.toLocaleString('en-IN')}</p>
              <span className="text-[10px] text-zinc-400">Mark to Market</span>
            </div>

            {holding ? (
              <>
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.08]">
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400">Units Held</span>
                  <p className="text-lg font-bold text-purple-600 dark:text-purple-400 mt-1">{holding.units.toLocaleString('en-IN')}</p>
                  <span className="text-[10px] text-zinc-400">Avg: ₹{holding.avg_buy_price.toLocaleString('en-IN')}</span>
                </div>

                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.08]">
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400">Current Value</span>
                  <p className="text-lg font-bold text-zinc-900 dark:text-white mt-1">₹{holding.current_value.toLocaleString('en-IN')}</p>
                  <span className="text-[10px] text-zinc-400">{holding.allocation_percent}% of portfolio</span>
                </div>

                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.08]">
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400">Unrealized P/L</span>
                  <p className={`text-lg font-bold mt-1 flex items-center gap-1 ${isProfit ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {isProfit ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {isProfit ? '+' : ''}₹{holding.unrealized_pl.toLocaleString('en-IN')}
                  </p>
                  <span className={`text-[10px] font-semibold ${isProfit ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {holding.unrealized_pl_percent > 0 ? '+' : ''}{holding.unrealized_pl_percent}%
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.08]">
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400">24h Movement</span>
                  <p className={`text-lg font-bold mt-1 flex items-center gap-1 ${isProfit ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {isProfit ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {change24h > 0 ? `+${change24h}%` : `${change24h}%`}
                  </p>
                  <span className="text-[10px] text-zinc-400">Daily Momentum</span>
                </div>

                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.08]">
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400">Yield</span>
                  <p className="text-lg font-bold text-purple-600 dark:text-purple-400 mt-1">{asset.annual_yield}%</p>
                  <span className="text-[10px] text-zinc-400">Annualized</span>
                </div>

                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.08]">
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400">Risk Profile</span>
                  <p className="text-lg font-bold text-zinc-900 dark:text-white mt-1">{asset.risk_level || 'Moderate'}</p>
                  <span className="text-[10px] text-zinc-400">SEBI Rating</span>
                </div>
              </>
            )}
          </div>

          {/* Fundamentals & Description */}
          <div className="p-4 rounded-xl bg-purple-500/[0.05] border border-purple-500/20 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <div>
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400">Category & Sector</span>
                <p className="text-sm font-semibold text-zinc-900 dark:text-white">{asset.sector || asset.asset_type}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Coins className="w-5 h-5 text-amber-500" />
              <div>
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400">Distribution Frequency</span>
                <p className="text-sm font-semibold text-amber-600 dark:text-amber-300">
                  {asset.asset_type === 'REIT' || asset.asset_type === 'INVIT' ? 'Quarterly Payouts' : 'Semi-Annual'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-violet-500" />
              <div>
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400">Liquidity Score</span>
                <p className="text-sm font-semibold text-violet-600 dark:text-violet-300">
                  {('liquidity_score' in asset ? asset.liquidity_score : null) || 'High'}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          {('description' in asset && asset.description) && (
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Instrument Profile
              </h4>
              <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed p-3.5 rounded-xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/[0.06]">
                {asset.description}
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-6 border-t border-zinc-200 dark:border-white/10 flex items-center justify-between gap-3 bg-zinc-50/50 dark:bg-[#0c0b11]">
          <button
            onClick={() => {
              onClose();
              setCurrentView('explorer');
            }}
            className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-purple-300 transition-all cursor-pointer font-medium"
          >
            <span>Learn in Academy</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePaperTrade}
              className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-900 dark:text-white bg-zinc-100 dark:bg-white/[0.08] hover:bg-zinc-200 dark:hover:bg-white/15 border border-zinc-200 dark:border-white/10 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Coins className="w-3.5 h-3.5 text-amber-500" />
              <span>Paper Trade</span>
            </button>

            <button
              onClick={handleAskCopilot}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-[0_0_15px_rgba(139,92,246,0.35)] transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 fill-white" />
              <span>AI Explain</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
