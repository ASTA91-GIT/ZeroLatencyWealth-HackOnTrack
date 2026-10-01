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
  Menu,
  X,
  Settings,
  Bookmark,
  LogIn,
  UserPlus,
  LogOut,
  User,
  Coins,
  SlidersHorizontal,
  Calendar
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    user,
    isAuthenticated,
    logout,
    setIsCopilotDrawerOpen,
    aiHealth,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Navigation Links
  const publicLinks: { view: ViewType; label: string; icon: React.ReactNode }[] = [
    { view: 'markets', label: 'Markets', icon: <Compass className="w-3.5 h-3.5" /> },
    { view: 'screener', label: 'Screener', icon: <SlidersHorizontal className="w-3.5 h-3.5" /> },
    { view: 'options', label: 'Options', icon: <Layers className="w-3.5 h-3.5" /> },
    { view: 'calendar', label: 'Calendar', icon: <Calendar className="w-3.5 h-3.5" /> },
    { view: 'learning', label: 'Academy', icon: <GraduationCap className="w-3.5 h-3.5" /> },
    { view: 'security', label: 'Security', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
  ];

  const authLinks: { view: ViewType; label: string; icon: React.ReactNode }[] = [
    { view: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
    { view: 'markets', label: 'Markets', icon: <Compass className="w-3.5 h-3.5" /> },
    { view: 'screener', label: 'Screener', icon: <SlidersHorizontal className="w-3.5 h-3.5" /> },
    { view: 'options', label: 'Options', icon: <Layers className="w-3.5 h-3.5" /> },
    { view: 'calendar', label: 'Calendar', icon: <Calendar className="w-3.5 h-3.5" /> },
    { view: 'watchlist', label: 'Watchlist', icon: <Bookmark className="w-3.5 h-3.5" /> },
    { view: 'papertrading', label: 'Paper Trading', icon: <Coins className="w-3.5 h-3.5" /> },
    { view: 'portfolio', label: 'Holdings', icon: <Layers className="w-3.5 h-3.5" /> },
    { view: 'insights', label: 'AI Insights', icon: <LineChart className="w-3.5 h-3.5" /> },
  ];

  const navLinks = isAuthenticated ? authLinks : publicLinks;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#27272A] bg-[#09090B]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div onClick={() => setCurrentView('landing')} className="flex items-center gap-2 cursor-pointer">
            <Logo size="md" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navLinks.map((item) => {
              const isActive = currentView === item.view;
              return (
                <button
                  key={item.view}
                  onClick={() => setCurrentView(item.view)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-tight transition-all cursor-pointer ${
                    isActive
                      ? 'bg-violet-600/15 text-violet-400 border border-violet-500/30 shadow-[0_0_12px_rgba(139,92,246,0.15)] font-bold'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-2.5">
            {/* ZeroLatency Copilot Trigger */}
            <button
              onClick={() => setIsCopilotDrawerOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-md shadow-violet-950/40 transition-all cursor-pointer"
              title={aiHealth?.status === 'ONLINE' ? 'Copilot: Online' : 'Copilot: Market Intelligence Engine'}
            >
              <Sparkles className="w-3.5 h-3.5 fill-white" />
              <span>Copilot</span>
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  aiHealth?.status === 'ONLINE' ? 'bg-emerald-400' : 'bg-violet-300'
                }`}
              />
            </button>

            {/* Authentication States */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentView('settings')}
                  className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border border-zinc-800 text-xs text-zinc-300 hover:text-white hover:border-zinc-700 transition-all cursor-pointer"
                  title="Profile & Settings"
                >
                  <User className="w-3.5 h-3.5 text-violet-400" />
                  <span className="font-semibold max-w-[100px] truncate">{user?.name}</span>
                </button>

                <button
                  onClick={logout}
                  className="p-1.5 rounded-lg border border-zinc-800 text-zinc-500 hover:text-red-400 hover:border-red-900/40 transition-all cursor-pointer"
                  title="Log Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentView('login')}
                  className="hidden sm:flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-300 hover:text-white transition-all cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Log In</span>
                </button>

                <button
                  onClick={() => setCurrentView('signup')}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-violet-600 hover:bg-violet-500 transition-all shadow-sm cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Sign Up</span>
                </button>
              </div>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-1.5 rounded-lg border border-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden py-3 border-t border-[#27272A] grid grid-cols-2 gap-1.5 text-xs animate-in fade-in duration-150">
            {navLinks.map((item) => (
              <button
                key={item.view}
                onClick={() => {
                  setCurrentView(item.view);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all text-left ${
                  currentView === item.view
                    ? 'bg-violet-600/20 text-violet-400 border border-violet-500/30 font-bold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/40'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};
