import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type {
  PortfolioSummary,
  HoldingModel,
  UserProfile,
  WatchlistItem,
  PaperAccount,
  AssetModel,
  MarketQuote,
  AiHealthResponse
} from '../types';
import { api } from '../services/api';

export type ViewType =
  | 'landing'
  | 'markets'
  | 'dashboard'
  | 'portfolio'
  | 'explorer'
  | 'copilot'
  | 'insights'
  | 'goals'
  | 'learning'
  | 'import'
  | 'watchlist'
  | 'papertrading'
  | 'security'
  | 'architecture'
  | 'settings'
  | 'login'
  | 'signup'
  | 'forgot-password'
  | 'reset-password'
  | 'verify-email';

export type ThemeType = 'dark' | 'light';

interface ToastInfo {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface AppContextType {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  user: UserProfile | null;
  isAuthenticated: boolean;
  isDemo: boolean;
  setUser: (user: UserProfile | null) => void;
  summary: PortfolioSummary | null;
  holdings: HoldingModel[];
  watchlist: WatchlistItem[];
  paperAccount: PaperAccount | null;
  aiHealth: AiHealthResponse | null;
  loading: boolean;
  toasts: ToastInfo[];
  showToast: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  refreshPortfolio: () => Promise<void>;
  refreshWatchlist: () => Promise<void>;
  refreshPaperAccount: () => Promise<void>;
  refreshAiHealth: () => Promise<void>;
  resetDemoData: () => Promise<void>;
  selectedAsset: HoldingModel | null;
  setSelectedAsset: (asset: HoldingModel | null) => void;
  isCopilotDrawerOpen: boolean;
  setIsCopilotDrawerOpen: (open: boolean) => void;
  loginAsDemoUser: () => Promise<void>;
  login: (email: string, pass: string) => Promise<boolean>;
  register: (name: string, email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  openAssetModal: (asset: HoldingModel) => void;
  requireAuth: (actionName?: string, intendedView?: ViewType) => boolean;
  authPromptOpen: boolean;
  authPromptAction: string;
  closeAuthPrompt: () => void;
  toggleWatchlist: (assetId: string) => Promise<void>;
  isWatchlisted: (assetId: string) => boolean;
  paperTradeModalAsset: AssetModel | HoldingModel | MarketQuote | null;
  openPaperTradeModal: (asset: AssetModel | HoldingModel | MarketQuote) => void;
  closePaperTradeModal: () => void;
  theme: ThemeType;
  toggleTheme: () => void;
  setTheme: (theme: ThemeType) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<ViewType>('landing');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [summary, setSummary] = useState<PortfolioSummary | null>(null);
  const [holdings, setHoldings] = useState<HoldingModel[]>([]);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [paperAccount, setPaperAccount] = useState<PaperAccount | null>(null);
  const [aiHealth, setAiHealth] = useState<AiHealthResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastInfo[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<HoldingModel | null>(null);
  const [isCopilotDrawerOpen, setIsCopilotDrawerOpen] = useState<boolean>(false);

  // Gatekeeping Auth Prompt Modal
  const [authPromptOpen, setAuthPromptOpen] = useState(false);
  const [authPromptAction, setAuthPromptAction] = useState('access this Wealth OS feature');

  // Paper Trade Modal State
  const [paperTradeModalAsset, setPaperTradeModalAsset] = useState<AssetModel | HoldingModel | MarketQuote | null>(null);

  // Theme Management
  const [theme, setThemeState] = useState<ThemeType>(() => {
    const saved = localStorage.getItem('zl_theme') as ThemeType;
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches
      ? 'light'
      : 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('zl_theme', theme);
  }, [theme]);

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const showToast = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const isAuthenticated = !!user;
  const isDemo = user?.is_demo === true;

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
    }
  };

  const refreshWatchlist = async () => {
    if (!user) return;
    try {
      const items = await api.getWatchlist();
      setWatchlist(items);
    } catch (err) {
      console.error('Error refreshing watchlist:', err);
    }
  };

  const refreshPaperAccount = async () => {
    if (!user) return;
    try {
      const acc = await api.getPaperAccount();
      setPaperAccount(acc);
    } catch (err) {
      console.error('Error refreshing paper account:', err);
    }
  };

  const refreshAiHealth = async () => {
    try {
      const status = await api.getAiHealth();
      setAiHealth(status);
    } catch (err) {
      setAiHealth({ available: false, provider: 'ollama', status: 'OFFLINE' });
    }
  };

  const requireAuth = (actionName?: string, intendedView?: ViewType): boolean => {
    if (isAuthenticated) return true;
    setAuthPromptAction(actionName || 'access this Wealth OS feature');
    setAuthPromptOpen(true);
    return false;
  };

  const closeAuthPrompt = () => {
    setAuthPromptOpen(false);
  };

  const loginAsDemoUser = async () => {
    try {
      setLoading(true);
      const res = await api.getDemoUser();
      setUser(res.user);
      await Promise.all([refreshPortfolio(), refreshWatchlist(), refreshPaperAccount()]);
      setCurrentView('dashboard');
      showToast('Demo Mode active. Welcome to ZeroLatency Wealth!', 'success');
    } catch (err) {
      showToast('Failed to enter Demo Mode', 'error');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, pass: string): Promise<boolean> => {
    try {
      setLoading(true);
      const res = await api.login(email, pass);
      setUser(res.user);
      await Promise.all([refreshPortfolio(), refreshWatchlist(), refreshPaperAccount()]);
      setCurrentView('dashboard');
      showToast(res.message, 'success');
      return true;
    } catch (err: any) {
      showToast(err.message || 'Login failed', 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, pass: string): Promise<boolean> => {
    try {
      setLoading(true);
      const res = await api.register(name, email, pass);
      setUser(res.user);
      await Promise.all([refreshPortfolio(), refreshWatchlist(), refreshPaperAccount()]);
      setCurrentView('dashboard');
      showToast(res.message, 'success');
      return true;
    } catch (err: any) {
      showToast(err.message || 'Registration failed', 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
    setSummary(null);
    setHoldings([]);
    setWatchlist([]);
    setPaperAccount(null);
    setCurrentView('landing');
    showToast('Logged out successfully', 'info');
  };

  const resetDemoData = async () => {
    try {
      setLoading(true);
      await api.resetDemoData();
      await Promise.all([refreshPortfolio(), refreshPaperAccount()]);
      showToast('Demo data reset to benchmark portfolio: ₹8,42,500', 'success');
    } catch (err) {
      showToast('Failed to reset demo data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const toggleWatchlist = async (assetId: string) => {
    if (!requireAuth('save items to your personal watchlist')) return;

    const alreadyListed = isWatchlisted(assetId);
    try {
      if (alreadyListed) {
        await api.removeFromWatchlist(assetId);
        showToast('Removed from watchlist', 'info');
      } else {
        await api.addToWatchlist(assetId);
        showToast('Added to watchlist', 'success');
      }
      await refreshWatchlist();
    } catch (err: any) {
      showToast(err.message || 'Failed to update watchlist', 'error');
    }
  };

  const isWatchlisted = useCallback(
    (assetId: string): boolean => {
      return watchlist.some((w) => w.asset_id === assetId || w.symbol === assetId);
    },
    [watchlist]
  );

  const openAssetModal = (asset: HoldingModel) => {
    setSelectedAsset(asset);
  };

  const openPaperTradeModal = (asset: AssetModel | HoldingModel | MarketQuote) => {
    if (!requireAuth('execute paper trading simulations')) return;
    setPaperTradeModalAsset(asset);
  };

  const closePaperTradeModal = () => {
    setPaperTradeModalAsset(null);
  };

  // Initial authentication check & AI health check
  useEffect(() => {
    const init = async () => {
      try {
        refreshAiHealth();
        const token = api.getToken();
        if (token) {
          try {
            const me = await api.getMe();
            setUser(me);
            await Promise.all([refreshPortfolio(), refreshWatchlist(), refreshPaperAccount()]);
          } catch (e) {
            api.setToken(null);
          }
        }
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
        isAuthenticated,
        isDemo,
        setUser,
        summary,
        holdings,
        watchlist,
        paperAccount,
        aiHealth,
        loading,
        toasts,
        showToast,
        refreshPortfolio,
        refreshWatchlist,
        refreshPaperAccount,
        refreshAiHealth,
        resetDemoData,
        selectedAsset,
        setSelectedAsset,
        isCopilotDrawerOpen,
        setIsCopilotDrawerOpen,
        loginAsDemoUser,
        login,
        register,
        logout,
        openAssetModal,
        requireAuth,
        authPromptOpen,
        authPromptAction,
        closeAuthPrompt,
        toggleWatchlist,
        isWatchlisted,
        paperTradeModalAsset,
        openPaperTradeModal,
        closePaperTradeModal,
        theme,
        toggleTheme,
        setTheme,
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
