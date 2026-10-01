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
  Sun,
  Moon
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { summary, holdings, resetDemoData, showToast, user, theme, toggleTheme } = useApp();
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
      <div className="fintech-card p-6 rounded-2xl">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
            <Settings className="w-4 h-4 text-purple-400" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-theme tracking-tight">
            Settings & Account Profile
          </h1>
        </div>
        <p className="text-xs text-muted-theme mt-1.5">
          Manage simulation preferences, theme controls, export consolidated portfolios, and reset test data state.
        </p>
      </div>

      {/* User Profile Card */}
      <div className="fintech-card p-6 rounded-2xl space-y-4">
        <h3 className="text-sm font-bold text-theme tracking-wide flex items-center gap-2">
          <User className="w-4 h-4 text-purple-400" />
          Investor Profile
        </h3>

        <div className="flex items-center gap-4 pt-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-xl shadow-[0_0_20px_rgba(168,85,247,0.35)]">
            AM
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-bold text-theme">{user?.name || 'Alex Mercer'}</h4>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20 font-mono">
                DEMO PROFILE
              </span>
            </div>
            <p className="text-xs text-muted-theme font-mono mt-0.5">{user?.email || 'demo@zerolatency.invest'}</p>
            <p className="text-[11px] text-muted-theme mt-1">Status: Preloaded Multi-Asset Holdings Active (₹8,42,500)</p>
          </div>
        </div>
      </div>

      {/* Display & Theme Preferences */}
      <div className="fintech-card p-6 rounded-2xl space-y-4">
        <h3 className="text-sm font-bold text-theme tracking-wide flex items-center gap-2">
          <Palette className="w-4 h-4 text-purple-400" />
          Display & Theme Preferences
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Currency */}
          <div className="p-4 rounded-xl bg-surface-2 border border-theme space-y-2.5">
            <span className="text-xs font-semibold text-theme block">Currency Denomination</span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrency('INR')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currency === 'INR'
                    ? 'bg-purple-500/15 text-purple-400 border border-purple-500/40 shadow-sm'
                    : 'bg-surface border border-theme text-muted-theme hover:text-theme'
                }`}
              >
                ₹ INR (Indian Rupee)
              </button>
              <button
                onClick={() => setCurrency('USD')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currency === 'USD'
                    ? 'bg-purple-500/15 text-purple-400 border border-purple-500/40 shadow-sm'
                    : 'bg-surface border border-theme text-muted-theme hover:text-theme'
                }`}
              >
                $ USD (Simulated)
              </button>
            </div>
          </div>

          {/* Theme Indicator (Permanently Dark Mode - Requirement #60) */}
          <div className="p-4 rounded-xl bg-surface-2 border border-theme space-y-2.5">
            <span className="text-xs font-semibold text-theme block">Theme Architecture</span>
            <div className="p-2.5 rounded-xl bg-[#09090b] border border-violet-500/30 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 text-violet-400 font-bold">
                <Moon className="w-4 h-4" />
                <span>ZeroLatency Dark Terminal</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-500">PERMANENT</span>
            </div>
          </div>
        </div>
      </div>

      {/* Data Management & Benchmark Reset */}
      <div className="fintech-card p-6 rounded-2xl space-y-4">
        <h3 className="text-sm font-bold text-theme tracking-wide flex items-center gap-2">
          <Shield className="w-4 h-4 text-purple-400" />
          Data Sovereignty & Reset Controls
        </h3>

        <div className="space-y-3 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-surface-2 border border-theme">
            <div>
              <h4 className="text-xs font-bold text-theme">Export Complete Portfolio JSON</h4>
              <p className="text-[11px] text-muted-theme mt-0.5">
                Download all raw holdings, asset allocations, and transactions in a standardized JSON file.
              </p>
            </div>
            <button
              onClick={handleExportJson}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-theme bg-surface border border-theme hover:border-purple-400 hover:text-purple-400 transition-all cursor-pointer whitespace-nowrap shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
            <div>
              <h4 className="text-xs font-bold text-rose-400">Reset Demo Portfolio to Benchmark</h4>
              <p className="text-[11px] text-muted-theme mt-0.5">
                Revert any newly imported holdings back to the official ₹8,42,500 canonical evaluation portfolio.
              </p>
            </div>
            <button
              onClick={handleReset}
              disabled={isResetting}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-300 bg-rose-950/60 border border-rose-500/40 hover:bg-rose-900/60 transition-all cursor-pointer whitespace-nowrap"
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
