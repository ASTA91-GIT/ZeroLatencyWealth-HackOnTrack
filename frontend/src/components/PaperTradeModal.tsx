import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import type { AssetModel, HoldingModel, MarketQuote } from '../types';
import {
  X,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Wallet,
  ArrowRight,
  ShieldAlert,
  Coins
} from 'lucide-react';

interface PaperTradeModalProps {
  asset: AssetModel | HoldingModel | MarketQuote | null;
  onClose: () => void;
}

export const PaperTradeModal: React.FC<PaperTradeModalProps> = ({ asset, onClose }) => {
  const { paperAccount, refreshPaperAccount, refreshPortfolio, showToast, holdings } = useApp();

  const [orderType, setOrderType] = useState<'BUY' | 'SELL'>('BUY');
  const [units, setUnits] = useState<number>(10);
  const [submitting, setSubmitting] = useState(false);

  if (!asset) return null;

  const currentPrice = ('price' in asset && typeof asset.price === 'number')
    ? asset.price
    : ('current_price' in asset && typeof (asset as any).current_price === 'number')
    ? (asset as any).current_price
    : 100.0;
  const totalAmount = units * currentPrice;
  const cashBalance = paperAccount ? paperAccount.cash_balance : 1000000.0;

  // Find if user already holds this asset
  const existingHolding = holdings.find(
    (h) => h.asset_id === asset.id || h.symbol === asset.symbol
  );
  const ownedUnits = existingHolding ? existingHolding.units : 0;

  const canAfford = orderType === 'BUY' ? cashBalance >= totalAmount : ownedUnits >= units;

  const handleExecute = async () => {
    if (units <= 0 || !canAfford || submitting) return;

    setSubmitting(true);
    try {
      const res = await api.placePaperOrder({
        asset_id: asset.id || asset.symbol || '',
        order_type: orderType,
        units: units,
        limit_price: currentPrice
      });

      if (res.success) {
        showToast(res.message, 'success');
        await Promise.all([refreshPaperAccount(), refreshPortfolio()]);
        onClose();
      } else {
        showToast(res.message, 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Paper order execution failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md rounded-3xl bg-white dark:bg-[#121118] border border-zinc-200 dark:border-purple-500/30 p-7 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600" />

        {/* Modal Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/[0.05] transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Prominent Simulation Banner */}
        <div className="mb-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>SIMULATED PAPER TRADING — NO REAL MONEY</span>
        </div>

        {/* Asset Header */}
        <div className="flex items-start justify-between border-b border-zinc-200 dark:border-white/10 pb-4">
          <div>
            <h3 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">
              {asset.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400">
                {asset.symbol}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300 border border-purple-300 dark:border-purple-600/30">
                {asset.asset_type}
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-lg font-bold text-zinc-900 dark:text-white font-mono">
              ₹{currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
            <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
              Live Reference Price
            </div>
          </div>
        </div>

        {/* Buy / Sell Tabs */}
        <div className="grid grid-cols-2 gap-2 mt-4 p-1 rounded-xl bg-zinc-100 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/10">
          <button
            onClick={() => setOrderType('BUY')}
            className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              orderType === 'BUY'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            Buy {asset.symbol}
          </button>
          <button
            onClick={() => setOrderType('SELL')}
            className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              orderType === 'SELL'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            Sell {asset.symbol}
          </button>
        </div>

        {/* Units Input & Quick Steppers */}
        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-600 dark:text-zinc-400 font-medium">Order Quantity (Units)</span>
            {orderType === 'SELL' && (
              <span className="text-zinc-500 font-mono text-[11px]">
                Owned: <strong className="text-purple-500">{ownedUnits}</strong> units
              </span>
            )}
          </div>

          <div className="relative">
            <input
              type="number"
              min="1"
              step="1"
              value={units}
              onChange={(e) => setUnits(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 focus:border-purple-500 rounded-xl px-4 py-3 text-lg font-mono font-bold text-zinc-900 dark:text-white focus:outline-none"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-400">
              UNITS
            </span>
          </div>

          {/* Quick Increment Buttons */}
          <div className="flex items-center gap-2">
            {[5, 10, 25, 50, 100].map((step) => (
              <button
                key={step}
                type="button"
                onClick={() => setUnits(step)}
                className="flex-1 py-1 rounded-lg text-[11px] font-mono font-semibold bg-zinc-100 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/10 hover:border-purple-400 text-zinc-600 dark:text-zinc-300 transition-all cursor-pointer"
              >
                +{step}
              </button>
            ))}
            {orderType === 'SELL' && ownedUnits > 0 && (
              <button
                type="button"
                onClick={() => setUnits(Math.floor(ownedUnits))}
                className="px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold bg-rose-500/10 border border-rose-500/30 text-rose-500 hover:bg-rose-500/20 transition-all cursor-pointer"
              >
                Max
              </button>
            )}
          </div>
        </div>

        {/* Order Cost Summary */}
        <div className="mt-5 p-4 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span>Estimated Total:</span>
            <span className="text-zinc-900 dark:text-white font-bold text-sm">
              ₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 pt-2 border-t border-zinc-200/60 dark:border-white/10">
            <span className="flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5 text-purple-500" />
              <span>Simulated Buying Power:</span>
            </span>
            <span className="text-purple-600 dark:text-purple-400 font-bold">
              ₹{cashBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Affordability Guard Warning */}
        {!canAfford && (
          <div className="mt-3 flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>
              {orderType === 'BUY'
                ? 'Insufficient simulated cash balance for this order.'
                : `You only own ${ownedUnits} units of this asset.`}
            </span>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleExecute}
          disabled={!canAfford || submitting || units <= 0}
          className={`w-full mt-5 py-3.5 px-4 rounded-xl text-xs font-bold text-white transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
            canAfford && !submitting
              ? orderType === 'BUY'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-[0_0_20px_rgba(168,85,247,0.35)]'
                : 'bg-rose-600 hover:bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.35)]'
              : 'bg-zinc-400 dark:bg-zinc-800 text-zinc-300 dark:text-zinc-600 cursor-not-allowed'
          }`}
        >
          {submitting ? (
            <span>Simulating Execution...</span>
          ) : (
            <>
              <Coins className="w-4 h-4" />
              <span>
                Execute Paper {orderType} ({units} units)
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
