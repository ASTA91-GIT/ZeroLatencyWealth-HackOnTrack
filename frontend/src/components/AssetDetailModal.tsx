import React from 'react';
import type { HoldingModel } from '../types';
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
  Database
} from 'lucide-react';

interface AssetDetailModalProps {
  asset: HoldingModel | null;
  onClose: () => void;
}

export const AssetDetailModal: React.FC<AssetDetailModalProps> = ({ asset, onClose }) => {
  const { setCurrentView, setIsCopilotDrawerOpen } = useApp();

  if (!asset) return null;

  const isProfit = asset.unrealized_pl >= 0;

  const handleAskCopilot = () => {
    onClose();
    setIsCopilotDrawerOpen(true);
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

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/[0.05] transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Key Value Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.08]">
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400">Market Price</span>
              <p className="text-lg font-bold text-zinc-900 dark:text-white mt-1">₹{asset.current_price.toLocaleString('en-IN')}</p>
              <span className="text-[10px] text-zinc-400">Mark to Market</span>
            </div>

            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.08]">
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400">Units Held</span>
              <p className="text-lg font-bold text-purple-600 dark:text-purple-400 mt-1">{asset.units.toLocaleString('en-IN')}</p>
              <span className="text-[10px] text-zinc-400">Avg: ₹{asset.avg_buy_price.toLocaleString('en-IN')}</span>
            </div>

            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.08]">
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400">Current Value</span>
              <p className="text-lg font-bold text-zinc-900 dark:text-white mt-1">₹{asset.current_value.toLocaleString('en-IN')}</p>
              <span className="text-[10px] text-zinc-400">{asset.allocation_percent}% of portfolio</span>
            </div>

            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.08]">
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400">Unrealized P/L</span>
              <p className={`text-lg font-bold mt-1 flex items-center gap-1 ${isProfit ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {isProfit ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {isProfit ? '+' : ''}₹{asset.unrealized_pl.toLocaleString('en-IN')}
              </p>
              <span className={`text-[10px] font-semibold ${isProfit ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {asset.unrealized_pl_percent > 0 ? '+' : ''}{asset.unrealized_pl_percent}%
              </span>
            </div>
          </div>

          {/* Custodial Source & Asset Fundamentals */}
          <div className="p-4 rounded-xl bg-purple-500/[0.05] border border-purple-500/20 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <div>
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400">Custody Source</span>
                <p className="text-sm font-semibold text-zinc-900 dark:text-white">{asset.source}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Coins className="w-5 h-5 text-amber-500" />
              <div>
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400">Indicative Yield</span>
                <p className="text-sm font-semibold text-amber-600 dark:text-amber-300">{asset.annual_yield}% / year</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-violet-500" />
              <div>
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400">Risk Profile</span>
                <p className="text-sm font-semibold text-violet-600 dark:text-violet-300">{asset.risk_level || 'Moderate'}</p>
              </div>
            </div>
          </div>

          {/* Educational Multi-Asset Awareness Breakdown */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Multi-Asset Awareness Guide
            </h4>
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/[0.08] text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
              {asset.asset_type === 'REIT' && (
                <p>
                  <strong className="text-purple-600 dark:text-purple-300">Why REITs in your portfolio?</strong> REITs own institutional Grade-A tech parks and office properties. Under SEBI regulations, 90% of distributable rental cash flows must be paid out to unitholders, providing predictable quarterly income alongside real estate asset appreciation.
                </p>
              )}
              {asset.asset_type === 'INVIT' && (
                <p>
                  <strong className="text-amber-600 dark:text-amber-300">Why InvITs in your portfolio?</strong> InvITs operate critical national infrastructure like power transmission grids and highway toll stretches. Long-term regulated concession agreements yield steady distributions (~9–10%), amortizing capital while offering regular payouts.
                </p>
              )}
              {asset.asset_type === 'BOND' && (
                <p>
                  <strong className="text-emerald-600 dark:text-emerald-300">Why Bonds in your portfolio?</strong> Bonds act as the capital preservation backbone of your holdings. Regular semi-annual coupons provide dependable cash flow while sovereign or AAA status safeguards principal during equity market drawdowns.
                </p>
              )}
              {asset.asset_type === 'EQUITY' && (
                <p>
                  <strong className="text-blue-600 dark:text-blue-300">Why Equities in your portfolio?</strong> Equities represent corporate ownership that drives long-term capital compounding and beats inflation over multi-year horizons, complemented by corporate dividends.
                </p>
              )}
              {asset.asset_type === 'OTHER' && (
                <p>
                  <strong className="text-indigo-600 dark:text-indigo-300">Why Liquid / Cash Equivalents?</strong> Provides immediate liquidity for sudden cash requirements and market opportunities while yielding overnight interest.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-zinc-200 dark:border-white/10 flex items-center justify-between gap-3 bg-zinc-50/50 dark:bg-[#0c0b11]">
          <button
            onClick={() => {
              onClose();
              setCurrentView('explorer');
            }}
            className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-purple-300 transition-all cursor-pointer font-medium"
          >
            <span>Learn in Asset Explorer</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200/60 dark:hover:bg-white/[0.05] border border-zinc-200 dark:border-white/10 cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handleAskCopilot}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-[0_0_15px_rgba(139,92,246,0.35)] transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 fill-white" />
              <span>Ask Copilot</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
