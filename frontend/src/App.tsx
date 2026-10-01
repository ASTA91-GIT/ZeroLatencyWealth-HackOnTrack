import React from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { ToastContainer } from './components/ToastContainer';
import { AssetDetailModal } from './components/AssetDetailModal';
import { CopilotDrawer } from './components/CopilotDrawer';

// Views
import { LandingPage } from './views/LandingPage';
import { DashboardView } from './views/DashboardView';
import { UnifiedPortfolioView } from './views/UnifiedPortfolioView';
import { AssetExplorerView } from './views/AssetExplorerView';
import { PortfolioInsightsView } from './views/PortfolioInsightsView';
import { GoalsView } from './views/GoalsView';
import { LearningCenterView } from './views/LearningCenterView';
import { PortfolioImportView } from './views/PortfolioImportView';
import { SecurityPrivacyView } from './views/SecurityPrivacyView';
import { ArchitectureView } from './views/ArchitectureView';
import { SettingsView } from './views/SettingsView';
import { AuthView } from './views/AuthView';

import { Sparkles } from 'lucide-react';

export const MainApp: React.FC = () => {
  const { currentView, selectedAsset, setSelectedAsset, setIsCopilotDrawerOpen } = useApp();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage />;
      case 'dashboard':
        return <DashboardView />;
      case 'portfolio':
        return <UnifiedPortfolioView />;
      case 'explorer':
        return <AssetExplorerView />;
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
      case 'register':
        return <AuthView mode="register" />;
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
            AI
          </span>
        </button>
      )}

      {/* Asset Inspection Modal */}
      <AssetDetailModal
        asset={selectedAsset}
        onClose={() => setSelectedAsset(null)}
      />

      {/* Persistent AI Copilot Drawer */}
      <CopilotDrawer />

      {/* Global Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return <MainApp />;
}
