import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings,
  User,
  RotateCcw,
  Download,
  Shield,
  Palette,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { summary, holdings, resetDemoData, showToast, user } = useApp();
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [isResetting, setIsResetting] = useState(false);

  const handleExportJson = () => {
    const data = {
      user: user?.name || 'Alex Mercer',
      export_date: new Date().toISOString(),
      summary,
      holdings
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', 'zerolatency_portfolio_export.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Exported complete portfolio snapshot as JSON', 'info');
  };

  const handleReset = async () => {
    setIsResetting(true);
    await resetDemoData();
    setIsResetting(false);
  };

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#0c101d] border border-white/[0.08] shadow-xl">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-cyan-400" />
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Settings & Account Profile
          </h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Manage simulation preferences, export consolidated portfolios, and reset test data state.
        </p>
      </div>

      {/* User Profile Card */}
      <div className="p-6 rounded-2xl bg-[#0c101d] border border-white/[0.08] space-y-4">
        <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
          <User className="w-4 h-4 text-cyan-400" />
          Investor Profile
        </h3>

        <div className="flex items-center gap-4 pt-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-black font-extrabold text-xl shadow-[0_0_20px_rgba(0,242,254,0.3)]">
            AM
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-bold text-white">{user?.name || 'Alex Mercer'}</h4>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-cyan-950 text-cyan-300 border border-cyan-800">
                DEMO PROFILE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{user?.email || 'demo@zerolatency.invest'}</p>
            <p className="text-[11px] text-slate-500 mt-1">Status: Preloaded Multi-Asset Holdings Active</p>
          </div>
        </div>
      </div>

      {/* Display & Currency Preferences */}
      <div className="p-6 rounded-2xl bg-[#0c101d] border border-white/[0.08] space-y-4">
        <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
          <Palette className="w-4 h-4 text-purple-400" />
          Display Preferences
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
            <span className="text-xs font-semibold text-white block">Currency Denomination</span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrency('INR')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                  currency === 'INR'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-white/[0.03] text-slate-400'
                }`}
              >
                ₹ INR (Indian Rupee)
              </button>
              <button
                onClick={() => setCurrency('USD')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                  currency === 'USD'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-white/[0.03] text-slate-400'
                }`}
              >
                $ USD (Simulated)
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
            <span className="text-xs font-semibold text-white block">Terminal Theme</span>
            <div className="py-2 px-3 rounded-lg bg-black/40 border border-white/10 text-xs text-cyan-300 flex items-center justify-between">
              <span>Dark Terminal (Futuristic Electric Cyan)</span>
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Data Management & Benchmark Reset */}
      <div className="p-6 rounded-2xl bg-[#0c101d] border border-white/[0.08] space-y-4">
        <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
          <Shield className="w-4 h-4 text-amber-400" />
          Data Sovereignty & Reset Controls
        </h3>

        <div className="space-y-3 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <div>
              <h4 className="text-xs font-bold text-white">Export Complete Portfolio JSON</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Download all raw holdings, asset allocations, and transactions in a standardized JSON file.
              </p>
            </div>
            <button
              onClick={handleExportJson}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-white/[0.05] border border-white/10 hover:border-cyan-400 hover:text-cyan-300 transition-all cursor-pointer whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-rose-950/20 border border-rose-500/20">
            <div>
              <h4 className="text-xs font-bold text-rose-300">Reset Demo Portfolio to Benchmark</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Revert any newly imported holdings back to the official ₹8,42,500 canonical evaluation portfolio.
              </p>
            </div>
            <button
              onClick={handleReset}
              disabled={isResetting}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-rose-200 bg-rose-900/40 border border-rose-500/40 hover:bg-rose-900/60 transition-all cursor-pointer whitespace-nowrap"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
              <span>{isResetting ? 'Resetting...' : 'Reset Demo Data'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
