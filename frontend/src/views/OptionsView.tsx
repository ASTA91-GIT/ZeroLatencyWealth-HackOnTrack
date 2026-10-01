import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { OptionChainData, MarketQuote } from '../types';
import {
  Layers,
  ShieldAlert,
  Clock,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Info,
  ChevronDown
} from 'lucide-react';

export const OptionsView: React.FC = () => {
  const { setSelectedMarketSymbol, setCurrentView } = useApp();
  const [symbol, setSymbol] = useState<string>('NIFTY');
  const [chain, setChain] = useState<OptionChainData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedExpiry, setSelectedExpiry] = useState<string>('');

  const symbols = ['NIFTY', 'BANKNIFTY', 'RELIANCE', 'TCS', 'HDFCBANK', 'INFY'];

  const loadChain = async (sym: string, exp?: string) => {
    setLoading(true);
    try {
      const data = await api.getOptionChain(sym, exp);
      setChain(data);
      if (data.expiry_dates && data.expiry_dates.length > 0 && !selectedExpiry) {
        setSelectedExpiry(data.expiry_dates[0]);
      }
    } catch (e) {
      console.error('Failed to load option chain', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChain(symbol, selectedExpiry);
  }, [symbol, selectedExpiry]);

  return (
    <div className="space-y-6 pb-20 text-zinc-100">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#27272A] pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-violet-400 uppercase tracking-wider mb-1">
            <span>DERIVATIVES & OPTION DESK</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Option Chain & Greeks Intelligence
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Real derivatives contract analysis with open interest, implied volatility, and strike distribution.
          </p>
        </div>

        {/* Symbol Selector */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs">
            <span className="text-zinc-500 mr-2 font-mono">Underlying:</span>
            <select
              value={symbol}
              onChange={(e) => {
                setSymbol(e.target.value);
                setSelectedExpiry('');
              }}
              className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
            >
              {symbols.map((s) => (
                <option key={s} value={s} className="bg-zinc-900 text-white">
                  {s}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => loadChain(symbol, selectedExpiry)}
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-white"
            title="Refresh Option Chain"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-violet-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Chain Container */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin mx-auto" />
          <p className="text-xs text-zinc-500 font-mono">FETCHING EXCHANGE DERIVATIVES CONTRACTS...</p>
        </div>
      ) : chain?.is_available === false ? (
        /* Regulatory explicit disclaimer when derivatives feed is unconfigured / unauthorized (Requirement #27, #28) */
        <div className="p-12 text-center bg-[#121214] border border-[#27272A] rounded-2xl space-y-4 max-w-2xl mx-auto shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-zinc-200">Derivatives Data Feed Unavailable</h3>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              {chain.message || 'Derivatives option chain not listed or unavailable for this instrument.'}
            </p>
            <p className="text-xs text-zinc-500 mt-2">
              In strict adherence to exchange regulatory policies and ZeroLatency's <strong>No Fake Data Policy</strong>, simulated strikes or randomized Option Greeks are never generated.
            </p>
          </div>
          <div className="pt-2">
            <span className="inline-flex items-center text-[11px] font-mono text-zinc-400 bg-zinc-950 px-3.5 py-1.5 rounded-lg border border-zinc-800">
              <Clock className="w-3.5 h-3.5 mr-1.5 text-zinc-500" />
              NSE / BSE Authorized Broker Subscriber Credentials Required for L2 Options
            </span>
          </div>
        </div>
      ) : (
        /* Render Option Chain Table */
        <div className="bg-[#121214] border border-[#27272A] rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-center text-xs">
              <thead className="bg-zinc-950 border-b border-[#27272A] text-zinc-400 font-mono text-[11px] uppercase tracking-wider">
                <tr>
                  <th colSpan={4} className="py-2.5 bg-emerald-950/20 text-emerald-400 border-r border-zinc-800">
                    CALLS
                  </th>
                  <th className="py-2.5 px-6 bg-zinc-900 text-white font-bold">STRIKE</th>
                  <th colSpan={4} className="py-2.5 bg-red-950/20 text-red-400 border-l border-zinc-800">
                    PUTS
                  </th>
                </tr>
                <tr className="border-t border-zinc-800 text-[10px]">
                  <th className="py-2 px-3">OI</th>
                  <th className="py-2 px-3">Volume</th>
                  <th className="py-2 px-3">IV</th>
                  <th className="py-2 px-3 border-r border-zinc-800">LTP (₹)</th>
                  <th className="py-2 px-6 bg-zinc-900 text-zinc-300">PRICE</th>
                  <th className="py-2 px-3 border-l border-zinc-800">LTP (₹)</th>
                  <th className="py-2 px-3">IV</th>
                  <th className="py-2 px-3">Volume</th>
                  <th className="py-2 px-3">OI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-mono">
                {chain?.strikes?.map((row) => (
                  <tr key={row.strike} className="hover:bg-zinc-900/60 transition-colors">
                    <td className="py-2 px-3 text-zinc-400">{row.call?.oi || '—'}</td>
                    <td className="py-2 px-3 text-zinc-400">{row.call?.volume || '—'}</td>
                    <td className="py-2 px-3 text-zinc-500">{row.call?.iv ? `${row.call.iv}%` : '—'}</td>
                    <td className="py-2 px-3 font-bold text-emerald-400 border-r border-zinc-800">
                      {row.call?.ltp ? `₹${row.call.ltp.toFixed(2)}` : '—'}
                    </td>
                    <td className="py-2 px-6 font-black bg-zinc-900/80 text-white text-xs">
                      {row.strike}
                    </td>
                    <td className="py-2 px-3 font-bold text-red-400 border-l border-zinc-800">
                      {row.put?.ltp ? `₹${row.put.ltp.toFixed(2)}` : '—'}
                    </td>
                    <td className="py-2 px-3 text-zinc-500">{row.put?.iv ? `${row.put.iv}%` : '—'}</td>
                    <td className="py-2 px-3 text-zinc-400">{row.put?.volume || '—'}</td>
                    <td className="py-2 px-3 text-zinc-400">{row.put?.oi || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
