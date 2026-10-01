import React, { useEffect, useState } from 'react';
import { MarketQuote } from '../../types';
import { api } from '../../services/api';
import { marketWS, ConnectionStatus } from '../../services/marketWebSocket';
import { TrendingUp, TrendingDown, Wifi, WifiOff } from 'lucide-react';

export const MarketTickerTape: React.FC = () => {
  const [quotes, setQuotes] = useState<Record<string, MarketQuote>>({});
  const [changedSymbols, setChangedSymbols] = useState<Record<string, 'up' | 'down'>>({});
  const [wsStatus, setWsStatus] = useState<ConnectionStatus>('CONNECTING');
  const [marketStatus, setMarketStatus] = useState<string>('OPEN');

  const trackedSymbols = [
    'NIFTY',
    'SENSEX',
    'BANKNIFTY',
    'NIFTYIT',
    'SPX',
    'NASDAQ',
    'GOLD',
    'SILVER',
    'CRUDEOIL',
    'USDINR',
  ];

  useEffect(() => {
    // Initial fetch of real quotes
    const fetchInitial = async () => {
      try {
        const [indices, commodities, currencies, status] = await Promise.all([
          api.getIndices(),
          api.getCommodities(),
          api.getCurrencies(),
          api.getMarketStatus(),
        ]);

        const map: Record<string, MarketQuote> = {};
        [...indices, ...commodities, ...currencies].forEach(q => {
          map[q.symbol.toUpperCase()] = q;
        });
        setQuotes(map);
        setMarketStatus(status.status);
      } catch (e) {
        console.error('Failed to load initial ticker quotes', e);
      }
    };

    fetchInitial();

    // Subscribe to WebSocket ticks
    marketWS.subscribe(trackedSymbols);

    const unsubStatus = marketWS.onStatusChange(status => {
      setWsStatus(status);
    });

    const unsubTick = marketWS.onTick(tickQuote => {
      const sym = tickQuote.symbol.toUpperCase();
      setQuotes(prev => {
        const oldPrice = prev[sym]?.last_price || (prev[sym] as any)?.price;
        const newPrice = tickQuote.last_price || (tickQuote as any)?.price;

        if (oldPrice && newPrice && oldPrice !== newPrice) {
          const dir = newPrice > oldPrice ? 'up' : 'down';
          setChangedSymbols(c => ({ ...c, [sym]: dir }));
          setTimeout(() => {
            setChangedSymbols(c => {
              const copy = { ...c };
              delete copy[sym];
              return copy;
            });
          }, 1500);
        }

        return { ...prev, [sym]: tickQuote };
      });
    });

    return () => {
      unsubStatus();
      unsubTick();
      marketWS.unsubscribe(trackedSymbols);
    };
  }, []);

  return (
    <div className="w-full bg-[#0D0D10] border-y border-[#27272A] py-2 px-4 flex items-center overflow-x-auto no-scrollbar shadow-inner">
      {/* Live Market Status Pill */}
      <div className="flex items-center space-x-2 mr-6 shrink-0 border-r border-[#27272A] pr-4">
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase ${
            marketStatus === 'OPEN'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
              marketStatus === 'OPEN' ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-500'
            }`}
          />
          {marketStatus}
        </span>

        {/* WebSocket Connection indicator */}
        <div className="flex items-center space-x-1 text-[11px] font-mono text-zinc-400" title={`Feed: ${wsStatus}`}>
          {wsStatus === 'CONNECTED' ? (
            <Wifi className="w-3 h-3 text-emerald-400" />
          ) : (
            <WifiOff className="w-3 h-3 text-amber-400" />
          )}
          <span className="text-[10px] text-zinc-400 font-semibold">{wsStatus === 'CONNECTED' ? 'LIVE' : wsStatus}</span>
        </div>
      </div>

      {/* Real-time Ticker Items */}
      <div className="flex items-center space-x-6 text-xs whitespace-nowrap">
        {trackedSymbols.map(sym => {
          const q = quotes[sym];
          if (!q) {
            return (
              <div key={sym} className="flex items-center space-x-2 text-zinc-600 font-mono text-xs">
                <span>{sym}</span>
                <span className="text-zinc-600 text-[10px]">SYNCING...</span>
              </div>
            );
          }

          const price = q.last_price || (q as any).price || 0;
          const change = q.change || 0;
          const pct = q.change_percent || (q as any).change_24h || 0;
          const isUp = change >= 0;
          const changeAnim = changedSymbols[sym];

          return (
            <div key={sym} className="flex items-center space-x-2 shrink-0 group cursor-pointer hover:bg-zinc-900/60 px-2 py-1 rounded transition-colors">
              <span className="font-bold text-zinc-300 text-xs tracking-tight">{q.name || sym}</span>

              {/* Price with subtle number animation (Requirement #7) */}
              <span
                className={`font-mono font-semibold transition-colors duration-300 ${
                  changeAnim === 'up'
                    ? 'text-emerald-300 bg-emerald-500/20 px-1 rounded'
                    : changeAnim === 'down'
                    ? 'text-red-300 bg-red-500/20 px-1 rounded'
                    : 'text-zinc-100'
                }`}
              >
                ₹{price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>

              {/* Change / Change % */}
              <span
                className={`flex items-center text-[11px] font-mono font-medium ${
                  isUp ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {isUp ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                {pct >= 0 ? `+${pct.toFixed(2)}%` : `${pct.toFixed(2)}%`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
