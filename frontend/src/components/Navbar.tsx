import React, { useState } from 'react';
import { useApp, ViewType } from '../context/AppContext';
import { Logo } from './Logo';
import {
  LayoutDashboard,
  Layers,
  Compass,
  Sparkles,
  LineChart,
  Target,
  GraduationCap,
  UploadCloud,
  ShieldCheck,
  Cpu,
  RotateCcw,
  UserCheck,
  ChevronDown,
  Menu,
  X,
  Settings
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    user,
    resetDemoData,
    loading,
    setIsCopilotDrawerOpen
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resetting, setResetting] = useState(false);

  const navLinks: { view: ViewType; label: string; icon: React.ReactNode }[] = [
    { view: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { view: 'portfolio', label: 'Holdings', icon: <Layers className="w-4 h-4" /> },
    { view: 'explorer', label: 'Asset Explorer', icon: <Compass className="w-4 h-4" /> },
    { view: 'insights', label: 'AI Insights', icon: <LineChart className="w-4 h-4" /> },
    { view: 'goals', label: 'Goals', icon: <Target className="w-4 h-4" /> },
    { view: 'learning', label: 'Academy', icon: <GraduationCap className="w-4 h-4" /> },
    { view: 'import', label: 'Import', icon: <UploadCloud className="w-4 h-4" /> },
    { view: 'architecture', label: 'Architecture', icon: <Cpu className="w-4 h-4" /> },
    { view: 'security', label: 'Security', icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  const handleReset = async () => {
    setResetting(true);
    await resetDemoData();
    setResetting(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#07090e]/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div onClick={() => setCurrentView('landing')} className="flex items-center gap-2">
            <Logo size="md" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((item) => {
              const isActive = currentView === item.view;
              return (
                <button
                  key={item.view}
                  onClick={() => setCurrentView(item.view)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(0,242,254,0.15)]'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            {/* DEMO MODE Persistent Badge */}
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-[11px] font-bold text-cyan-300 tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span>DEMO MODE</span>
            </div>

            {/* Reset Demo Data Button */}
            <button
              onClick={handleReset}
              disabled={resetting || loading}
              title="Reset holdings & transactions back to the canonical benchmark"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-300 bg-white/[0.04] border border-white/10 hover:border-cyan-500/40 hover:text-cyan-300 transition-all"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin text-cyan-400' : ''}`} />
              <span className="hidden md:inline">Reset Demo</span>
            </button>

            {/* AI Copilot Drawer Trigger */}
            <button
              onClick={() => setIsCopilotDrawerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-black bg-gradient-to-r from-cyan-400 to-sky-300 hover:from-cyan-300 hover:to-white shadow-[0_0_15px_rgba(0,242,254,0.4)] transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 fill-black" />
              <span>Copilot</span>
            </button>

            {/* User Profile / Settings */}
            <button
              onClick={() => setCurrentView('settings')}
              className={`p-1.5 rounded-lg border text-slate-400 hover:text-white transition-all ${
                currentView === 'settings' ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-300' : 'border-white/10 bg-white/[0.03]'
              }`}
              title="Settings & Profile"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-slate-400 hover:text-white border border-white/10 bg-white/[0.03]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-b border-white/10 bg-[#090d16]/95 backdrop-blur-2xl px-4 py-3 space-y-1">
          {navLinks.map((item) => (
            <button
              key={item.view}
              onClick={() => {
                setCurrentView(item.view);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentView === item.view
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-300 hover:bg-white/[0.05]'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 text-xs text-slate-300 py-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
              <span>Reset Demo Holdings</span>
            </button>
            <span className="text-[11px] text-cyan-400 font-mono">₹8,42,500 Canonical</span>
          </div>
        </div>
      )}
    </header>
  );
};
