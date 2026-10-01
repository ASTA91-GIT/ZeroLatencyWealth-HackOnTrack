import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { marketWS } from '../services/marketWebSocket';
import type { WatchlistItem, PaperAccount, PaperOrder, PriceAlert } from '../types';
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
  Info,
  Bell,
  BarChart2,
  Clock
} from 'lucide-react';

export const WatchlistView: React.FC = () => {
  const {
    watchlist,
    refreshWatchlist,
    toggleWatchlist,
    paperAccount,
    refreshPaperAccount,
    openPaperTradeModal,
    setSelectedMarketSymbol,
    setCurrentView,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'watchlist' | 'alerts' | 'order_history'>('watchlist');
  const [livePrices, setLivePrices] = useState<Record<string, { price: number; change: number }>>({});
  const [orders, setOrders] = useState<PaperOrder[]>([]);
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingAlerts, setLoadingAlerts] = useState(false);

  useEffect(() => {
    refreshWatchlist();
    refreshPaperAccount();
  }, []);

  // Subscribe to live WebSocket quotes for watchlist symbols
  useEffect(() => {
    if (watchlist.length === 0) return;
    const symbols = watchlist.map(w => w.symbol);
    marketWS.subscribe(symbols);

    const unsubTick = marketWS.onTick((quote) => {
      const sym = quote.symbol.toUpperCase();
      const p = quote.last_price || (quote as any).price;
      const c = quote.change_percent || (quote as any).change_24h || 0;
      if (p !== undefined) {
        setLivePrices(prev => ({
          ...prev,
          [sym]: { price: p, change: c }
        }));
      }
    });

    return () => {
      unsubTick();
      marketWS.unsubscribe(symbols);
    };
  }, [watchlist]);

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

  const fetchAlerts = async () => {
    try {
      setLoadingAlerts(true);
      const res = await api.getAlerts();
      setAlerts(res);
    } catch (err) {
      console.error('Failed to load alerts', err);
    } finally {
      setLoadingAlerts(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'order_history') {
      fetchOrders();
    } else if (activeTab === 'alerts') {
      fetchAlerts();
    }
  }, [activeTab]);

  const handleDeleteAlert = async (alertId: string) => {
    try {
      await api.deleteAlert(alertId);
      setAlerts(prev => prev.filter(a => a.id !== alertId));
      showToast('Alert removed', 'info');
    } catch (e: any) {
      showToast(e.message || 'Failed to delete alert', 'error');
    }
  };

  const handleOpenDetail = (sym: string) => {
    setSelectedMarketSymbol(sym);
    setCurrentView('instrument-detail');
  };

  return (
    <div className="space-y-6 pb-20 text-zinc-100">
      {/* 1. HEADER & SIMULATED WALLET SUMMARY */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#27272A] pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-violet-400 uppercase tracking-wider mb-1">
            <span>TERMINAL WORKSPACE</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Watchlist & Trading Desk
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-xl">
            Live real-time watchlist with WebSocket streaming, threshold price alerts, and operable paper trading simulator.
          </p>
        </div>

        {/* Paper Buying Power Widget */}
        <div className="p-4 rounded-2xl bg-[#121214] border border-[#27272A] shadow-sm flex items-center space-x-4">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/30 flex items-center justify-center">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-zinc-500 block font-mono">
              Simulated Buying Power
            </span>
            <span className="text-lg font-black font-mono text-white">
              ₹{(paperAccount?.cash_balance ?? 1000000).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* 2. TAB CONTROLS */}
      <div className="flex items-center space-x-2 border-b border-[#27272A] pb-2 text-xs">
        <button
          onClick={() => setActiveTab('watchlist')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
            activeTab === 'watchlist'
              ? 'bg-violet-600 text-white shadow-md shadow-violet-900/40'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>My Watchlist ({watchlist.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('alerts')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
            activeTab === 'alerts'
              ? 'bg-violet-600 text-white shadow-md shadow-violet-900/40'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Price Alerts</span>
        </button>

        <button
          onClick={() => setActiveTab('order_history')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
            activeTab === 'order_history'
              ? 'bg-violet-600 text-white shadow-md shadow-violet-900/40'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Paper Order History</span>
        </button>
      </div>

      {/* 3. TAB CONTENT */}
      {activeTab === 'watchlist' && (
        <div>
          {watchlist.length === 0 ? (
            <div className="text-center py-16 p-8 rounded-3xl border border-dashed border-zinc-800 bg-[#121214] space-y-4">
              <Bookmark className="w-10 h-10 text-violet-400 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">Your Watchlist is Empty</h3>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  Explore master market assets across Equities, Sovereign Bonds, REITs, and InvITs to bookmark them here.
                </p>
              </div>
              <button
                onClick={() => setCurrentView('markets')}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-500 shadow-sm transition-all inline-flex items-center space-x-1.5 cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Explore Markets</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {watchlist.map((item) => {
                const live = livePrices[item.symbol.toUpperCase()];
                const price = live ? live.price : item.price;
                const changePct = live ? live.change : item.change_24h;
                const isUp = changePct >= 0;

                return (
                  <div
                    key={item.id}
                    onClick={() => handleOpenDetail(item.symbol)}
                    className="p-5 rounded-2xl bg-[#121214] border border-[#27272A] hover:border-violet-500/50 shadow-sm flex flex-col justify-between cursor-pointer group transition-all"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-base font-black text-white group-hover:text-violet-400 transition-colors">
                              {item.symbol}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-violet-950/40 text-violet-300 border border-violet-500/30">
                              {item.asset_type}
                            </span>
                          </div>
                          <h4 className="text-xs font-medium text-zinc-400 mt-1 line-clamp-1">
                            {item.name}
                          </h4>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWatchlist(item.asset_id || item.symbol);
                          }}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-950/30 transition-all cursor-pointer"
                          title="Remove from Watchlist"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="mt-4 flex items-baseline justify-between border-y border-zinc-800/80 py-3 font-mono">
                        <div>
                          <span className="text-[10px] text-zinc-500 block">Live Price</span>
                          <span className="text-lg font-bold text-white">
                            ₹{price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-zinc-500 block">Change</span>
                          <span
                            className={`inline-flex items-center text-xs font-bold ${
                              isUp ? 'text-emerald-400' : 'text-red-400'
                            }`}
                          >
                            {isUp ? <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> : <TrendingDown className="w-3.5 h-3.5 mr-0.5" />}
                            <span>{changePct > 0 ? `+${changePct.toFixed(2)}%` : `${changePct.toFixed(2)}%`}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center space-x-2" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => handleOpenDetail(item.symbol)}
                        className="flex-1 py-1.5 rounded-xl border border-zinc-800 hover:border-zinc-700 text-xs font-semibold text-zinc-300 hover:text-white transition-all flex items-center justify-center space-x-1"
                      >
                        <BarChart2 className="w-3.5 h-3.5 text-violet-400" />
                        <span>Chart</span>
                      </button>

                      <button
                        onClick={() => openPaperTradeModal(item as any)}
                        className="flex-1 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-950/30 transition-all flex items-center justify-center space-x-1"
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

      {/* Alerts Tab (Requirement #23, #24) */}
      {activeTab === 'alerts' && (
        <div className="space-y-4">
          {loadingAlerts ? (
            <div className="py-12 text-center text-zinc-500 font-mono text-xs">LOADING ALERTS...</div>
          ) : alerts.length === 0 ? (
            <div className="text-center py-16 p-8 rounded-3xl border border-dashed border-zinc-800 bg-[#121214] space-y-3">
              <Bell className="w-10 h-10 text-zinc-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No Active Price Alerts</h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Open any instrument from Markets or Screener and click "Set Alert" to trigger real-time notifications when prices cross your targets.
              </p>
            </div>
          ) : (
            <div className="bg-[#121214] border border-[#27272A] rounded-2xl overflow-hidden shadow-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-950 border-b border-[#27272A] text-zinc-400 font-mono text-[11px] uppercase">
                  <tr>
                    <th className="py-3 px-4">Symbol</th>
                    <th className="py-3 px-4">Condition</th>
                    <th className="py-3 px-4 text-right">Target Price</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 font-mono">
                  {alerts.map(a => (
                    <tr key={a.id} className="hover:bg-zinc-900/50">
                      <td className="py-3 px-4 font-bold text-white">{a.symbol}</td>
                      <td className="py-3 px-4 text-zinc-300">Price moves {a.condition}</td>
                      <td className="py-3 px-4 text-right font-bold text-emerald-400">₹{a.target_price.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          a.triggered ? 'bg-zinc-800 text-zinc-400 border-zinc-700' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        }`}>
                          {a.triggered ? 'TRIGGERED' : 'MONITORING'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteAlert(a.id)}
                          className="text-zinc-500 hover:text-red-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Order History Tab */}
      {activeTab === 'order_history' && (
        <div className="space-y-4">
          {loadingOrders ? (
            <div className="py-12 text-center text-zinc-500 font-mono text-xs">LOADING ORDER HISTORY...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 p-8 rounded-3xl border border-dashed border-zinc-800 bg-[#121214] space-y-3">
              <History className="w-10 h-10 text-zinc-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No Simulated Orders Yet</h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Execute paper trading orders on real instruments to review simulated fill logs and transaction records here.
              </p>
            </div>
          ) : (
            <div className="bg-[#121214] border border-[#27272A] rounded-2xl overflow-hidden shadow-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-950 border-b border-[#27272A] text-zinc-400 font-mono text-[11px] uppercase">
                  <tr>
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Instrument</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4 text-right">Units</th>
                    <th className="py-3 px-4 text-right">Execution Price</th>
                    <th className="py-3 px-4 text-right">Total Amount</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 font-mono">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-zinc-900/50">
                      <td className="py-3 px-4 text-zinc-500 text-[11px]">{o.id}</td>
                      <td className="py-3 px-4 font-bold text-white">{o.symbol}</td>
                      <td className="py-3 px-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          o.order_type === 'BUY'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-red-500/10 text-red-400 border-red-500/30'
                        }`}>
                          {o.order_type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-zinc-200">{o.units}</td>
                      <td className="py-3 px-4 text-right font-bold text-white">₹{o.price.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right font-bold text-zinc-100">₹{o.total_amount.toFixed(2)}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                          {o.status}
                        </span>
                      </td>
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
