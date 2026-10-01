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
  Sun,
  Moon,
  Menu,
  X,
  Settings,
  Bookmark,
  LogIn,
  UserPlus,
  LogOut,
  User,
  Coins
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    user,
    isAuthenticated,
    isDemo,
    logout,
    loginAsDemoUser,
    resetDemoData,
    loading,
    setIsCopilotDrawerOpen,
    aiHealth,
    theme,
    toggleTheme
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resetting, setResetting] = useState(false);

  // Dynamic Navigation Links: Public vs Authenticated
  const publicLinks: { view: ViewType; label: string; icon: React.ReactNode }[] = [
    { view: 'markets', label: 'Markets', icon: <Compass className="w-3.5 h-3.5" /> },
    { view: 'explorer', label: 'Assets', icon: <Layers className="w-3.5 h-3.5" /> },
    { view: 'learning', label: 'Academy', icon: <GraduationCap className="w-3.5 h-3.5" /> },
    { view: 'architecture', label: 'Architecture', icon: <Cpu className="w-3.5 h-3.5" /> },
    { view: 'security', label: 'Security', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
  ];

  const authLinks: { view: ViewType; label: string; icon: React.ReactNode }[] = [
    { view: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
    { view: 'portfolio', label: 'Holdings', icon: <Layers className="w-3.5 h-3.5" /> },
    { view: 'markets', label: 'Markets', icon: <Compass className="w-3.5 h-3.5" /> },
    { view: 'watchlist', label: 'Watchlist', icon: <Bookmark className="w-3.5 h-3.5" /> },
    { view: 'insights', label: 'AI Insights', icon: <LineChart className="w-3.5 h-3.5" /> },
    { view: 'goals', label: 'Goals', icon: <Target className="w-3.5 h-3.5" /> },
    { view: 'import', label: 'Import', icon: <UploadCloud className="w-3.5 h-3.5" /> },
  ];

  const navLinks = isAuthenticated ? authLinks : publicLinks;

  const handleReset = async () => {
    setResetting(true);
    await resetDemoData();
    setResetting(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 dark:border-white/[0.08] bg-white/80 dark:bg-[#09090d]/80 backdrop-blur-xl transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-15">
          {/* Logo */}
          <div onClick={() => setCurrentView('landing')} className="flex items-center gap-2 cursor-pointer">
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
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-tight transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-purple-600/10 dark:bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30 shadow-[0_0_12px_rgba(168,85,247,0.15)]'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/[0.04]'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Theme Toggle (Light / Dark) */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-zinc-100 dark:hover:bg-white/[0.05] transition-all cursor-pointer"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-purple-600" />
              )}
            </button>

            {/* DEMO MODE Badge (Shown only when in demo mode) */}
            {isDemo && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-600/40 text-[10px] font-bold text-purple-700 dark:text-purple-300 tracking-wider">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500" />
                </span>
                <span>DEMO MODE</span>
              </div>
            )}

            {/* Reset Demo Data Button (Only when demo mode is active) */}
            {isDemo && (
              <button
                onClick={handleReset}
                disabled={resetting || loading}
                title="Reset portfolio data back to canonical benchmark"
                className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-100/80 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/10 hover:border-purple-400 dark:hover:border-purple-500/40 hover:text-purple-600 dark:hover:text-purple-300 transition-all cursor-pointer"
              >
                <RotateCcw className={`w-3 h-3 ${resetting ? 'animate-spin text-purple-500' : ''}`} />
                <span>Reset</span>
              </button>
            )}

            {/* Local AI Copilot Drawer Trigger */}
            <button
              onClick={() => setIsCopilotDrawerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-[0_0_15px_rgba(139,92,246,0.35)] transition-all cursor-pointer relative"
              title={aiHealth?.status === 'ONLINE' ? 'Local Ollama AI: Online' : 'Local AI: Knowledge Engine Fallback'}
            >
              <Sparkles className="w-3.5 h-3.5 fill-white" />
              <span>Copilot</span>
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  aiHealth?.status === 'ONLINE' ? 'bg-emerald-400' : 'bg-purple-300'
                }`}
              />
            </button>

            {/* Authentication States */}
            {isAuthenticated ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentView('settings')}
                  className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-white/10 text-xs text-zinc-700 dark:text-zinc-300 hover:border-purple-400 transition-all cursor-pointer"
                  title="Profile & Settings"
                >
                  <User className="w-3.5 h-3.5 text-purple-500" />
                  <span className="font-semibold max-w-[100px] truncate">{user?.name}</span>
                </button>

                <button
                  onClick={logout}
                  className="p-1.5 rounded-lg border border-zinc-200 dark:border-white/10 text-zinc-500 hover:text-rose-500 hover:border-rose-400 transition-all cursor-pointer"
                  title="Log Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentView('login')}
                  className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-purple-600 dark:hover:text-white transition-all cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Log In</span>
                </button>

                <button
                  onClick={() => setCurrentView('signup')}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 transition-all shadow-sm cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Sign Up</span>
                </button>
              </div>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-1.5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border border-zinc-200 dark:border-white/10"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-b border-zinc-200 dark:border-white/10 bg-white/95 dark:bg-[#0d0d12]/95 backdrop-blur-2xl px-4 py-3 space-y-1">
          {navLinks.map((item) => (
            <button
              key={item.view}
              onClick={() => {
                setCurrentView(item.view);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                currentView === item.view
                  ? 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30'
                  : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/[0.05]'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}

          {!isAuthenticated && (
            <div className="pt-2 border-t border-zinc-200 dark:border-white/10 grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => {
                  setCurrentView('login');
                  setMobileMenuOpen(false);
                }}
                className="py-2 text-center rounded-lg border border-zinc-200 dark:border-white/10 font-bold"
              >
                Log In
              </button>
              <button
                onClick={() => {
                  setCurrentView('signup');
                  setMobileMenuOpen(false);
                }}
                className="py-2 text-center rounded-lg bg-purple-600 text-white font-bold"
              >
                Sign Up
              </button>
            </div>
          )}

          {isDemo && (
            <div className="pt-2 border-t border-zinc-200 dark:border-white/10 flex items-center justify-between text-xs">
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-300 py-1"
              >
                <RotateCcw className="w-3.5 h-3.5 text-purple-500" />
                <span>Reset Benchmark Data</span>
              </button>
              <span className="text-[11px] text-purple-600 dark:text-purple-400 font-mono font-bold">
                ₹8,42,500
              </span>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
