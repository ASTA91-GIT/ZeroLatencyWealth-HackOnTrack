import React from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { ToastContainer } from './components/ToastContainer';
import { AssetDetailModal } from './components/AssetDetailModal';
import { PaperTradeModal } from './components/PaperTradeModal';
import { AuthPromptModal } from './components/AuthPromptModal';
import { CopilotDrawer } from './components/CopilotDrawer';

// Views
import { LandingPage } from './views/LandingPage';
import { MarketsView } from './views/MarketsView';
import { DashboardView } from './views/DashboardView';
import { UnifiedPortfolioView } from './views/UnifiedPortfolioView';
import { AssetExplorerView } from './views/AssetExplorerView';
import { WatchlistView } from './views/WatchlistView';
import { PortfolioInsightsView } from './views/PortfolioInsightsView';
import { GoalsView } from './views/GoalsView';
import { LearningCenterView } from './views/LearningCenterView';
import { PortfolioImportView } from './views/PortfolioImportView';
import { SecurityPrivacyView } from './views/SecurityPrivacyView';
import { ArchitectureView } from './views/ArchitectureView';
import { SettingsView } from './views/SettingsView';
import { AuthView } from './views/AuthView';
import { ScreenerView } from './views/ScreenerView';
import { OptionsView } from './views/OptionsView';
import { EconomicCalendarView } from './views/EconomicCalendarView';
import { InstrumentDetailView } from './views/InstrumentDetailView';

import { Sparkles } from 'lucide-react';

export const MainApp: React.FC = () => {
  const {
    currentView,
    selectedAsset,
    setSelectedAsset,
    paperTradeModalAsset,
    closePaperTradeModal,
    authPromptOpen,
    authPromptAction,
    closeAuthPrompt,
    setIsCopilotDrawerOpen
  } = useApp();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage />;
      case 'markets':
        return <MarketsView />;
      case 'screener':
        return <ScreenerView />;
      case 'options':
        return <OptionsView />;
      case 'calendar':
        return <EconomicCalendarView />;
      case 'instrument-detail':
        return <InstrumentDetailView />;
      case 'dashboard':
        return <DashboardView />;
      case 'portfolio':
        return <UnifiedPortfolioView />;
      case 'explorer':
        return <AssetExplorerView />;
      case 'watchlist':
      case 'papertrading':
        return <WatchlistView />;
      case 'insights':
        return <PortfolioInsightsView />;
      case 'goals':
        return <GoalsView />;
      case 'learning':
        return <LearningCenterView />;
      case 'import':
        return <PortfolioImportView />;
      case 'security':
        return <SecurityPrivacyView />;
      case 'architecture':
        return <ArchitectureView />;
      case 'settings':
        return <SettingsView />;
      case 'login':
        return <AuthView mode="login" />;
      case 'signup':
        return <AuthView mode="signup" />;
      case 'forgot-password':
        return <AuthView mode="forgot-password" />;
      case 'reset-password':
        return <AuthView mode="reset-password" />;
      case 'verify-email':
        return <AuthView mode="verify-email" />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-theme flex flex-col font-sans selection:bg-purple-500 selection:text-white transition-colors duration-200">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Viewport Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {renderCurrentView()}
      </main>

      {/* Floating Copilot Shortcut Trigger */}
      {currentView !== 'landing' && (
        <button
          onClick={() => setIsCopilotDrawerOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-500 text-white font-extrabold text-xs shadow-[0_0_25px_rgba(168,85,247,0.4)] hover:shadow-[0_0_35px_rgba(168,85,247,0.6)] transform hover:-translate-y-1 transition-all cursor-pointer"
          title="Open ZeroLatency Copilot"
        >
          <Sparkles className="w-4 h-4 fill-white" />
          <span className="hidden sm:inline">ZeroLatency Copilot</span>
          <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[10px] uppercase font-mono">
            LOCAL AI
          </span>
        </button>
      )}

      {/* Asset Inspection Modal */}
      <AssetDetailModal
        asset={selectedAsset}
        onClose={() => setSelectedAsset(null)}
      />

      {/* Simulated Paper Trade Order Ticket Modal */}
      <PaperTradeModal
        asset={paperTradeModalAsset}
        onClose={closePaperTradeModal}
      />

      {/* Unauthenticated Visitor Gatekeeper Modal */}
      <AuthPromptModal
        isOpen={authPromptOpen}
        onClose={closeAuthPrompt}
        actionTitle={authPromptAction}
      />

      {/* Persistent Local AI Copilot Drawer */}
      <CopilotDrawer />

      {/* Global Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return <MainApp />;
}
