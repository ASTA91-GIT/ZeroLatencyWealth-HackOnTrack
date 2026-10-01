import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { EconomicEvent } from '../types';
import { Calendar, RefreshCw, Globe, AlertCircle, Info } from 'lucide-react';

export const EconomicCalendarView: React.FC = () => {
  const [events, setEvents] = useState<EconomicEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadCalendar = async () => {
    setLoading(true);
    try {
      const data = await api.getEconomicCalendar();
      setEvents(data);
    } catch (e) {
      console.error('Failed to load economic events', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCalendar();
  }, []);

  const getImportanceBadge = (importance: string) => {
    if (importance === 'HIGH') {
      return 'bg-red-500/10 text-red-400 border-red-500/30';
    }
    if (importance === 'MEDIUM') {
      return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    }
    return 'bg-zinc-800 text-zinc-400 border-zinc-700';
  };

  return (
    <div className="space-y-6 pb-20 text-zinc-100">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#27272A] pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-violet-400 uppercase tracking-wider mb-1">
            <span>MACROECONOMIC INTELLIGENCE</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Economic Calendar
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Global central bank announcements, interest rate decisions, inflation indices, and fiscal prints.
          </p>
        </div>

        <button
          onClick={loadCalendar}
          className="p-2 rounded-lg bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-white"
          title="Refresh Calendar"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-violet-400' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin mx-auto" />
          <p className="text-xs text-zinc-500 font-mono">LOADING ECONOMIC EVENTS...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="p-12 text-center bg-[#121214] border border-[#27272A] rounded-2xl">
          <Calendar className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
          <p className="text-sm font-semibold text-zinc-300">No scheduled economic events for this window</p>
        </div>
      ) : (
        <div className="bg-[#121214] border border-[#27272A] rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950 border-b border-[#27272A] text-zinc-400 font-mono text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Event</th>
                  <th className="py-3 px-4">Country</th>
                  <th className="py-3 px-4">Time</th>
                  <th className="py-3 px-4">Impact</th>
                  <th className="py-3 px-4 text-right">Previous</th>
                  <th className="py-3 px-4 text-right">Forecast</th>
                  <th className="py-3 px-4 text-right">Actual</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-mono">
                {events.map((ev, idx) => (
                  <tr key={idx} className="hover:bg-zinc-900/60 transition-colors">
                    <td className="py-3.5 px-4 font-sans font-bold text-white">{ev.event}</td>
                    <td className="py-3.5 px-4 text-zinc-300">{ev.country}</td>
                    <td className="py-3.5 px-4 text-zinc-400">{ev.time}</td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getImportanceBadge(ev.importance)}`}>
                        {ev.importance}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right text-zinc-400">{ev.previous || '—'}</td>
                    <td className="py-3.5 px-4 text-right text-zinc-300">{ev.forecast || '—'}</td>
                    <td className="py-3.5 px-4 text-right font-bold text-emerald-400">{ev.actual || '—'}</td>
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
