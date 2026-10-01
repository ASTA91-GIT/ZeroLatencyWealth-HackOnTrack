import React, { createContext, useContext, useState, useEffect } from 'react';
import type { PortfolioSummary, HoldingModel, UserProfile } from '../types';
import { api } from '../services/api';

export type ViewType =
  | 'landing'
  | 'dashboard'
  | 'portfolio'
  | 'explorer'
  | 'copilot'
  | 'insights'
  | 'goals'
  | 'learning'
  | 'import'
  | 'security'
  | 'architecture'
  | 'settings'
  | 'login'
  | 'register';

interface ToastInfo {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface AppContextType {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  summary: PortfolioSummary | null;
  holdings: HoldingModel[];
  loading: boolean;
  toasts: ToastInfo[];
  showToast: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  refreshPortfolio: () => Promise<void>;
  resetDemoData: () => Promise<void>;
  selectedAsset: HoldingModel | null;
  setSelectedAsset: (asset: HoldingModel | null) => void;
  isCopilotDrawerOpen: boolean;
  setIsCopilotDrawerOpen: (open: boolean) => void;
  loginAsDemoUser: () => Promise<void>;
  logout: () => void;
  openAssetModal: (asset: HoldingModel) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<ViewType>('landing');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [summary, setSummary] = useState<PortfolioSummary | null>(null);
  const [holdings, setHoldings] = useState<HoldingModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastInfo[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<HoldingModel | null>(null);
  const [isCopilotDrawerOpen, setIsCopilotDrawerOpen] = useState<boolean>(false);

  const showToast = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const refreshPortfolio = async () => {
    try {
      const [sumData, hldData] = await Promise.all([
        api.getPortfolioSummary(),
        api.getHoldings()
      ]);
      setSummary(sumData);
      setHoldings(hldData);
    } catch (err) {
      console.error('Error refreshing portfolio:', err);
      showToast('Could not load portfolio data', 'error');
    }
  };

  const loginAsDemoUser = async () => {
    try {
      setLoading(true);
      const res = await api.getDemoUser();
      setUser(res.user);
      await refreshPortfolio();
      setCurrentView('dashboard');
      showToast('Demo Mode active. Welcome to ZeroLatency Wealth!', 'success');
    } catch (err) {
      showToast('Failed to enter Demo Mode', 'error');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setCurrentView('landing');
    showToast('Logged out successfully', 'info');
  };

  const resetDemoData = async () => {
    try {
      setLoading(true);
      await api.resetDemoData();
      await refreshPortfolio();
      showToast('Demo data reset to benchmark portfolio: ₹8,42,500', 'success');
    } catch (err) {
      showToast('Failed to reset demo data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openAssetModal = (asset: HoldingModel) => {
    setSelectedAsset(asset);
  };

  // Initial load
  useEffect(() => {
    const init = async () => {
      try {
        await refreshPortfolio();
      } catch (e) {
        console.error('Init error', e);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        user,
        setUser,
        summary,
        holdings,
        loading,
        toasts,
        showToast,
        refreshPortfolio,
        resetDemoData,
        selectedAsset,
        setSelectedAsset,
        isCopilotDrawerOpen,
        setIsCopilotDrawerOpen,
        loginAsDemoUser,
        logout,
        openAssetModal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
