import React from 'react';
import type { HoldingModel } from '../types';
import { useApp } from '../context/AppContext';
import {
  X,
  TrendingUp,
  TrendingDown,
  Layers,
  Shield,
  Coins,
  ArrowRight,
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl rounded-2xl bg-[#0c101d] border border-cyan-500/30 shadow-[0_0_50px_rgba(0,242,254,0.15)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Glow Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500" />

        {/* Modal Header */}
        <div className="p-6 border-b border-white/10 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-cyan-400">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white tracking-tight">{asset.name}</h3>
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold uppercase border ${getBadgeColor(asset.asset_type)}`}>
                  {asset.asset_type}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Ticker: <span className="text-cyan-400 font-semibold">{asset.symbol}</span> | Sector: {asset.sector || 'General Market'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Key Value Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08]">
              <span className="text-[11px] text-slate-400">Current Market Price</span>
              <p className="text-lg font-bold text-white mt-1">₹{asset.current_price.toLocaleString('en-IN')}</p>
              <span className="text-[10px] text-slate-500">Live Simulation</span>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08]">
              <span className="text-[11px] text-slate-400">Units Held</span>
              <p className="text-lg font-bold text-cyan-400 mt-1">{asset.units.toLocaleString('en-IN')}</p>
              <span className="text-[10px] text-slate-500">Avg: ₹{asset.avg_buy_price.toLocaleString('en-IN')}</span>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08]">
              <span className="text-[11px] text-slate-400">Current Holding Value</span>
              <p className="text-lg font-bold text-white mt-1">₹{asset.current_value.toLocaleString('en-IN')}</p>
              <span className="text-[10px] text-slate-500">{asset.allocation_percent}% of portfolio</span>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08]">
              <span className="text-[11px] text-slate-400">Unrealized Gain / Loss</span>
              <p className={`text-lg font-bold mt-1 flex items-center gap-1 ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isProfit ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {isProfit ? '+' : ''}₹{asset.unrealized_pl.toLocaleString('en-IN')}
              </p>
              <span className={`text-[10px] font-semibold ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                {asset.unrealized_pl_percent > 0 ? '+' : ''}{asset.unrealized_pl_percent}%
              </span>
            </div>
          </div>

          {/* Custodial Source & Asset Fundamentals */}
          <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/20 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-cyan-400" />
              <div>
                <span className="text-[11px] text-slate-400">Aggregated Custody Source</span>
                <p className="text-sm font-semibold text-white">{asset.source}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Coins className="w-5 h-5 text-amber-400" />
              <div>
                <span className="text-[11px] text-slate-400">Indicated Annual Yield</span>
                <p className="text-sm font-semibold text-amber-300">{asset.annual_yield}% / year</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-purple-400" />
              <div>
                <span className="text-[11px] text-slate-400">Risk Profile</span>
                <p className="text-sm font-semibold text-purple-300">{asset.risk_level || 'Moderate'}</p>
              </div>
            </div>
          </div>

          {/* Educational Multi-Asset Awareness Breakdown */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Multi-Asset Awareness Guide
            </h4>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] text-sm text-slate-300 leading-relaxed space-y-2">
              <p>
                {asset.asset_type === 'REIT' && (
                  <>
                    <strong className="text-purple-300">Why REITs in your portfolio?</strong> REITs own institutional Grade-A tech parks and office properties. Under SEBI regulations, 90% of distributable rental cash flows must be paid out to unitholders, providing predictable quarterly income alongside real estate asset appreciation.
                  </>
                )}
                {asset.asset_type === 'INVIT' && (
                  <>
                    <strong className="text-amber-300">Why InvITs in your portfolio?</strong> InvITs operate critical national infrastructure like power transmission grids and highway toll stretches. Long-term regulated concession agreements yield steady distributions (~9–10%), amortizing capital while offering regular payouts.
                  </>
                )}
                {asset.asset_type === 'BOND' && (
                  <>
                    <strong className="text-emerald-300">Why Bonds in your portfolio?</strong> Bonds act as the capital preservation backbone of your holdings. Regular semi-annual coupons provide dependable cash flow while sovereign or AAA status safeguards principal during equity market drawdowns.
                  </>
                )}
                {asset.asset_type === 'EQUITY' && (
                  <>
                    <strong className="text-blue-300">Why Equities in your portfolio?</strong> Equities represent corporate ownership that drives long-term capital compounding and beats inflation over multi-year horizons, complemented by corporate dividends.
                  </>
                )}
                {asset.asset_type === 'OTHER' && (
                  <>
                    <strong className="text-cyan-300">Why Liquid / Cash Equivalents?</strong> Provides immediate liquidity for sudden cash requirements and market opportunities while yielding overnight interest.
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Simulation Disclaimer Badge */}
          <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-500/30 text-[11px] text-amber-300/90 leading-tight">
            <strong>SIMULATION / DEMO DATA:</strong> Figures are simulated for Hack on Track demonstration purposes. Does not constitute personal financial advice or solicitations.
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-white/10 flex items-center justify-between gap-3 bg-[#090d16]">
          <button
            onClick={() => {
              onClose();
              setCurrentView('explorer');
            }}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-all"
          >
            <span>Learn more in Asset Explorer</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-white/[0.05] border border-white/10"
            >
              Close
            </button>
            <button
              onClick={handleAskCopilot}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-black bg-gradient-to-r from-cyan-400 to-sky-300 hover:from-cyan-300 hover:to-white shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 fill-black" />
              <span>Ask Copilot About This Asset</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
