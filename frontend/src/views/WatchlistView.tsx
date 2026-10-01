import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import type { WatchlistItem, PaperAccount, PaperOrder } from '../types';
import {
  Bookmark,
  Coins,
  TrendingUp,
  TrendingDown,
  Trash2,
  Wallet,
  ArrowRight,
  ShieldAlert,
  Compass,
  Building2,
  History,
  Info
} from 'lucide-react';

export const WatchlistView: React.FC = () => {
  const {
    watchlist,
    refreshWatchlist,
    toggleWatchlist,
    paperAccount,
    refreshPaperAccount,
    openPaperTradeModal,
    openAssetModal,
    setCurrentView
  } = useApp();

  const [activeTab, setActiveTab] = useState<'watchlist' | 'paper_portfolio' | 'order_history'>('watchlist');
  const [orders, setOrders] = useState<PaperOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    refreshWatchlist();
    refreshPaperAccount();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const res = await api.getPaperOrders();
      setOrders(res);
    } catch (err) {
      console.error('Failed to load paper orders', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'order_history') {
      fetchOrders();
    }
  }, [activeTab]);

  return (
    <div className="space-y-8 pb-20 text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
      {/* 1. HEADER & SIMULATED WALLET SUMMARY */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 dark:border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold tracking-widest text-purple-600 dark:text-purple-400 uppercase">
              AUTHENTICATED WEALTH OS
            </span>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[10px] font-mono font-bold">
              PAPER TRADING ACTIVE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
            Watchlist & Simulated Paper Desk
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1 max-w-xl">
            Track potential multi-asset investments, test portfolio allocations with simulated ₹10,00,000 cash, and monitor paper performance.
          </p>
        </div>

        {/* Paper Buying Power Widget */}
        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-[#121118] border border-zinc-200 dark:border-white/10 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30 flex items-center justify-center">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block font-mono">
              Simulated Buying Power
            </span>
            <span className="text-lg font-black font-mono text-zinc-900 dark:text-white">
              ₹{(paperAccount?.cash_balance ?? 1000000).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* 2. TAB CONTROLS */}
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-white/10 pb-2">
        <button
          onClick={() => setActiveTab('watchlist')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'watchlist'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/[0.04]'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>My Watchlist ({watchlist.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('order_history')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'order_history'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/[0.04]'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Order History</span>
        </button>
      </div>

      {/* 3. TAB CONTENT */}
      {activeTab === 'watchlist' && (
        <div>
          {watchlist.length === 0 ? (
            <div className="text-center py-16 p-8 rounded-3xl border border-dashed border-zinc-300 dark:border-white/15 bg-zinc-50/50 dark:bg-white/[0.01] space-y-4">
              <Bookmark className="w-10 h-10 text-purple-400 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-base font-bold text-zinc-900 dark:text-white">Your Watchlist is Empty</h3>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  Explore master market assets across Equities, Sovereign Bonds, REITs, and InvITs to bookmark them here.
                </p>
              </div>
              <button
                onClick={() => setCurrentView('markets')}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 shadow-sm transition-all inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Explore Markets</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {watchlist.map((item) => {
                const isUp = item.change_24h >= 0;
                return (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl bg-white dark:bg-[#121118] border border-zinc-200 dark:border-white/[0.08] hover:border-purple-500/40 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-base font-black text-zinc-900 dark:text-white">
                              {item.symbol}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30">
                              {item.asset_type}
                            </span>
                          </div>
                          <h4 className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mt-1 line-clamp-1">
                            {item.name}
                          </h4>
                        </div>

                        <button
                          onClick={() => toggleWatchlist(item.asset_id)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all cursor-pointer"
                          title="Remove from Watchlist"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="mt-4 flex items-baseline justify-between border-y border-zinc-100 dark:border-white/[0.04] py-3">
                        <div>
                          <span className="text-[10px] text-zinc-400 block font-mono">Market Price</span>
                          <span className="text-lg font-bold font-mono text-zinc-900 dark:text-white">
                            ₹{item.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-zinc-400 block font-mono">24h Change</span>
                          <span
                            className={`inline-flex items-center gap-0.5 text-xs font-mono font-bold ${
                              isUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                            }`}
                          >
                            {isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                            <span>{item.change_24h > 0 ? `+${item.change_24h}%` : `${item.change_24h}%`}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                      <button
                        onClick={() => openAssetModal(item as any)}
                        className="flex-1 py-2 rounded-xl text-xs font-semibold bg-zinc-100 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/10 hover:border-purple-400 text-zinc-700 dark:text-zinc-300 transition-all cursor-pointer"
                      >
                        Inspect
                      </button>
                      <button
                        onClick={() => openPaperTradeModal(item as any)}
                        className="flex-1 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 transition-all shadow-sm flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Coins className="w-3.5 h-3.5" />
                        <span>Paper Trade</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'order_history' && (
        <div className="rounded-2xl border border-zinc-200 dark:border-white/10 overflow-hidden bg-white dark:bg-[#121118]">
          {loadingOrders ? (
            <div className="py-16 text-center text-xs text-zinc-500 font-mono">
              Loading simulated orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="py-16 text-center text-zinc-500 text-xs">
              No simulated paper trading orders placed yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-zinc-50 dark:bg-white/[0.02] border-b border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400 font-mono">
                  <tr>
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Instrument</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Units</th>
                    <th className="py-3 px-4">Execution Price</th>
                    <th className="py-3 px-4">Total Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-white/[0.04]">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-zinc-50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-4 font-mono text-zinc-400">{ord.id}</td>
                      <td className="py-3 px-4 font-bold text-zinc-900 dark:text-white">
                        {ord.symbol} ({ord.asset_type})
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                            ord.order_type === 'BUY'
                              ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30'
                              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {ord.order_type}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono">{ord.units}</td>
                      <td className="py-3 px-4 font-mono">₹{ord.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td className="py-3 px-4 font-mono font-bold text-zinc-900 dark:text-white">
                        ₹{ord.total_amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          {ord.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-zinc-400">{ord.created_at.slice(0, 19).replace('T', ' ')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
