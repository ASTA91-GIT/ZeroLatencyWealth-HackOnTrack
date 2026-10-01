import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { OptionChainData } from '../types';
import {
  Layers,
  ShieldAlert,
  Clock,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Info,
  ChevronDown,
  BookOpen,
  Calculator,
  Compass,
  ArrowRight,
  Shield
} from 'lucide-react';

export const OptionsView: React.FC = () => {
  const { setSelectedMarketSymbol, setCurrentView } = useApp();
  const [symbol, setSymbol] = useState<string>('NIFTY');
  const [chain, setChain] = useState<OptionChainData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedExpiry, setSelectedExpiry] = useState<string>('');
  const [activeConceptTab, setActiveConceptTab] = useState<'basics' | 'greeks' | 'moneyness'>('basics');

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
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-white cursor-pointer"
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
        /* Requirement #20: Professional OPTIONS DESK educational fallback when real broker feed is unauthorized */
        <div className="space-y-6">
          {/* Status Box */}
          <div className="p-6 bg-[#121214] border border-zinc-800 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0 mt-0.5">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">OPTIONS DESK</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-950/80 text-amber-300 border border-amber-800">
                    Data status: Unavailable from configured provider
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  Reason: <strong>Authorized broker/vendor derivatives data required.</strong>
                </p>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  In strict adherence to ZeroLatency's <strong>No Fake Data Policy</strong>, simulated strikes or randomized Option Greeks are never generated. When an authorized live derivatives provider is connected, real exchange feeds will display automatically.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setCurrentView('markets')}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 transition-all cursor-pointer"
              >
                Browse Spot Markets
              </button>
            </div>
          </div>

          {/* Educational Option Desk Intelligence (Requirement #20) */}
          <div className="fintech-card p-6 bg-[#121214] border border-zinc-800 space-y-5 rounded-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Derivatives & Options Intelligence Reference
                </h3>
              </div>

              {/* Sub-tab pills */}
              <div className="flex items-center bg-zinc-900 rounded-lg p-0.5 border border-zinc-800 text-xs font-mono">
                {[
                  { id: 'basics', label: 'Option Chain Concepts' },
                  { id: 'greeks', label: 'The Greeks (Δ, Γ, Θ, ν)' },
                  { id: 'moneyness', label: 'Moneyness (ATM/ITM/OTM)' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveConceptTab(tab.id as any)}
                    className={`px-3 py-1 rounded-md font-bold transition-all ${
                      activeConceptTab === tab.id
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sub-tab 1: Option Chain Concepts */}
            {activeConceptTab === 'basics' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold uppercase">
                    CALL VS PUT
                  </span>
                  <h4 className="text-xs font-bold text-white">Call (CE) vs Put (PE) Contracts</h4>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    A <strong>Call option</strong> gives the buyer the right (but not obligation) to purchase the underlying at the strike price before expiry. A <strong>Put option</strong> gives the right to sell the underlying at the strike price.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-bold uppercase">
                    STRIKE & EXPIRY
                  </span>
                  <h4 className="text-xs font-bold text-white">Strike Price & Expiry Horizon</h4>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    The <strong>Strike price</strong> is the predetermined transaction level of the contract. The <strong>Expiry date</strong> is the final trading day on which the contract settles (NSE weekly on Thursdays, monthly on the last Thursday).
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-bold uppercase">
                    PREMIUM
                  </span>
                  <h4 className="text-xs font-bold text-white">Option Premium Structure</h4>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    The <strong>Premium</strong> is the market price paid by the buyer to the seller (writer). It equals <strong>Intrinsic Value + Extrinsic (Time) Value</strong>, determined by supply, demand, and market expectations.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-bold uppercase">
                    OPEN INTEREST (OI)
                  </span>
                  <h4 className="text-xs font-bold text-white">Open Interest & Support / Resistance</h4>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    <strong>Open Interest (OI)</strong> represents the total number of outstanding contracts active in the exchange. High Put OI strikes indicate significant support levels, while high Call OI strikes indicate resistance.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-bold uppercase">
                    IMPLIED VOLATILITY (IV)
                  </span>
                  <h4 className="text-xs font-bold text-white">Implied Volatility (IV) & Expectation</h4>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    <strong>IV</strong> reflects the market's forecast of underlying price swings over the contract tenure. High IV inflates option premiums before major events (RBI policy, union budgets), followed by IV crush after the announcement.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 font-bold uppercase">
                    RISK WARNING
                  </span>
                  <h4 className="text-xs font-bold text-white">Derivatives Capital Risk</h4>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    SEBI data reveals that 9 out of 10 individual traders incur net losses in equity derivatives. Use options strictly for strategic portfolio hedging and cash-flow covered calls rather than naked speculative leverage.
                  </p>
                </div>
              </div>
            )}

            {/* Sub-tab 2: The Greeks */}
            {activeConceptTab === 'greeks' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-black text-purple-400 font-mono">Delta (Δ)</span>
                    <span className="text-[10px] font-mono text-zinc-500">Price Sensitivity</span>
                  </div>
                  <p className="text-[11px] text-zinc-300 leading-relaxed">
                    Measures the expected change in option premium for every ₹1 change in the underlying. Calls range from 0 to +1.0; Puts range from -1.0 to 0. ATM options have a Delta of ~0.50.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-black text-sky-400 font-mono">Gamma (Γ)</span>
                    <span className="text-[10px] font-mono text-zinc-500">Acceleration</span>
                  </div>
                  <p className="text-[11px] text-zinc-300 leading-relaxed">
                    Measures the rate of change of Delta for every ₹1 move in the underlying asset. Highest for at-the-money options approaching expiry.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-black text-rose-400 font-mono">Theta (Θ)</span>
                    <span className="text-[10px] font-mono text-zinc-500">Time Decay</span>
                  </div>
                  <p className="text-[11px] text-zinc-300 leading-relaxed">
                    Measures the daily loss of premium due to the passage of time. Always negative for option buyers and positive for option sellers (writers). Accelerates in final 10 days before expiry.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-black text-amber-400 font-mono">Vega (ν)</span>
                    <span className="text-[10px] font-mono text-zinc-500">Volatility Impact</span>
                  </div>
                  <p className="text-[11px] text-zinc-300 leading-relaxed">
                    Measures the sensitivity of the contract premium to a 1% change in implied volatility. Long options benefit from expanding Vega; short options profit when Vega contracts.
                  </p>
                </div>
              </div>
            )}

            {/* Sub-tab 3: Moneyness */}
            {activeConceptTab === 'moneyness' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold uppercase">
                    IN-THE-MONEY (ITM)
                  </span>
                  <h4 className="text-xs font-bold text-white">Intrinsic + Time Value</h4>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    <strong>Calls:</strong> Strike price &lt; Current spot price.<br />
                    <strong>Puts:</strong> Strike price &gt; Current spot price.<br />
                    Possesses genuine intrinsic value and behaves closest to holding the underlying cash asset.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-bold uppercase">
                    AT-THE-MONEY (ATM)
                  </span>
                  <h4 className="text-xs font-bold text-white">Maximum Extrinsic Time Value</h4>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Strike price equals (or is closest to) current spot price. Possesses no intrinsic value, maximum liquidity, maximum Gamma sensitivity, and greatest open interest activity.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-bold uppercase">
                    OUT-OF-THE-MONEY (OTM)
                  </span>
                  <h4 className="text-xs font-bold text-white">Pure Extrinsic Speculation</h4>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    <strong>Calls:</strong> Strike price &gt; Current spot price.<br />
                    <strong>Puts:</strong> Strike price &lt; Current spot price.<br />
                    Zero intrinsic value. Expires entirely worthless at 3:30 PM on expiry day if spot does not cross the strike threshold.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Render Live Option Chain Table when authorized provider feed is connected */
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
