import type {
  PortfolioSummary,
  HoldingModel,
  AssetModel,
  GoalModel,
  PortfolioInsightsResponse,
  UserProfile,
  AuthResponse,
  MarketOverview,
  MarketQuote,
  WatchlistItem,
  PaperAccount,
  PaperOrder,
  PaperOrderResponse,
  AiHealthResponse,
  CandleData,
  MarketDepthData,
  CompanyFundamentals,
  MarketNews,
  EconomicEvent,
  OptionChainData,
  PriceAlert,
  MarketSessionStatus,
  MarketBreadthData
} from '../types';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('zl_auth_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('zl_auth_token', token);
    } else {
      localStorage.removeItem('zl_auth_token');
    }
  }

  getToken(): string | null {
    return this.token || localStorage.getItem('zl_auth_token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string> || {}),
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(url, { ...options, headers });

    if (!res.ok) {
      let errMsg = `Request failed (${res.status})`;
      try {
        const errJson = await res.json();
        if (errJson.error && errJson.error.message) {
          errMsg = errJson.error.message;
        } else if (errJson.detail) {
          errMsg = errJson.detail;
        } else if (errJson.message) {
          errMsg = errJson.message;
        }
      } catch (_) {
        // Fallback default
      }
      throw new Error(errMsg);
    }

    return res.json();
  }

  // ----------------- AUTHENTICATION -----------------

  async getDemoUser(): Promise<AuthResponse> {
    const res = await this.request<AuthResponse>('/auth/demo', { method: 'POST' });
    this.setToken(res.token);
    return res;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    this.setToken(res.token);
    return res;
  }

  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    const res = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    this.setToken(res.token);
    return res;
  }

  async getMe(): Promise<UserProfile> {
    return this.request<UserProfile>('/auth/me');
  }

  async logout(): Promise<void> {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } finally {
      this.setToken(null);
    }
  }

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    return this.request('/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, new_password: newPassword }),
    });
  }

  async verifyEmail(token: string): Promise<{ success: boolean; message: string }> {
    return this.request('/auth/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
  }

  // ----------------- HEALTH & OBSERVABILITY -----------------

  async getSystemHealth(): Promise<any> {
    return this.request('/health');
  }

  async getAiHealth(): Promise<AiHealthResponse> {
    return this.request<AiHealthResponse>('/ai/health');
  }

  // ----------------- PUBLIC MARKETS -----------------

  async getMarketOverview(): Promise<MarketOverview> {
    return this.request<MarketOverview>('/markets/overview');
  }

  async getMarketStatus(exchange: string = 'NSE'): Promise<MarketSessionStatus> {
    return this.request<MarketSessionStatus>(`/markets/status?exchange=${exchange}`);
  }

  async getMarketInstruments(assetType?: string): Promise<any[]> {
    const q = assetType ? `?asset_type=${assetType}` : '';
    return this.request<any[]>(`/markets/instruments${q}`);
  }

  async getMarketQuotes(params?: { asset_type?: string; search?: string }): Promise<MarketQuote[]> {
    const query = new URLSearchParams();
    if (params?.asset_type) query.append('asset_type', params.asset_type);
    if (params?.search) query.append('search', params.search);
    return this.request<MarketQuote[]>(`/markets/quotes?${query.toString()}`);
  }

  async getMarketQuoteDetail(symbolOrId: string): Promise<MarketQuote> {
    return this.request<MarketQuote>(`/markets/quote/${symbolOrId}`);
  }

  async getMarketCandles(symbol: string, interval: string = '1d', rangePeriod: string = '1mo'): Promise<{ symbol: string; interval: string; range_period: string; candles: CandleData[] }> {
    return this.request<{ symbol: string; interval: string; range_period: string; candles: CandleData[] }>(`/markets/history/${symbol}?interval=${interval}&range_period=${rangePeriod}`);
  }

  async getMarketDepth(symbol: string): Promise<MarketDepthData> {
    return this.request<MarketDepthData>(`/markets/depth/${symbol}`);
  }

  async getIndices(): Promise<MarketQuote[]> {
    return this.request<MarketQuote[]>('/markets/indices');
  }

  async getCommodities(): Promise<MarketQuote[]> {
    return this.request<MarketQuote[]>('/markets/commodities');
  }

  async getCurrencies(): Promise<MarketQuote[]> {
    return this.request<MarketQuote[]>('/markets/currencies');
  }

  async getMovers(): Promise<{ top_gainers: MarketQuote[]; top_losers: MarketQuote[] }> {
    return this.request<{ top_gainers: MarketQuote[]; top_losers: MarketQuote[] }>('/markets/movers');
  }

  async getBreadth(): Promise<MarketBreadthData> {
    return this.request<MarketBreadthData>('/markets/breadth');
  }

  async getMarketNews(category?: string): Promise<MarketNews[]> {
    const q = category ? `?category=${category}` : '';
    return this.request<MarketNews[]>(`/markets/news${q}`);
  }

  async getEconomicCalendar(): Promise<EconomicEvent[]> {
    return this.request<EconomicEvent[]>('/markets/calendar');
  }

  async getCompanyFundamentals(symbol: string): Promise<CompanyFundamentals> {
    return this.request<CompanyFundamentals>(`/fundamentals/${symbol}`);
  }

  async getOptionChain(symbol: string, expiry?: string): Promise<OptionChainData> {
    const q = expiry ? `?expiry=${expiry}` : '';
    return this.request<OptionChainData>(`/options/${symbol}/chain${q}`);
  }

  async getScreener(filters?: Record<string, any>): Promise<MarketQuote[]> {
    const query = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') {
          query.append(k, String(v));
        }
      });
    }
    return this.request<MarketQuote[]>(`/screener?${query.toString()}`);
  }

  async getIndicators(symbol: string, indicator: string, period: number = 14, interval: string = '1d', rangePeriod: string = '3mo'): Promise<any> {
    return this.request(`/indicators/${symbol}?indicator=${indicator}&period=${period}&interval=${interval}&range_period=${rangePeriod}`);
  }

  // ----------------- ALERTS -----------------

  async getAlerts(): Promise<PriceAlert[]> {
    return this.request<PriceAlert[]>('/alerts');
  }

  async createAlert(alert: { symbol: string; target_price: number; condition: string }): Promise<PriceAlert> {
    return this.request<PriceAlert>('/alerts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(alert)
    });
  }

  async deleteAlert(alertId: string): Promise<void> {
    await this.request(`/alerts/${alertId}`, { method: 'DELETE' });
  }

  // ----------------- PORTFOLIO & ASSETS -----------------

  async getPortfolioSummary(): Promise<PortfolioSummary> {
    return this.request<PortfolioSummary>('/portfolio/summary');
  }

  async getHoldings(params?: { asset_type?: string; source?: string; search?: string }): Promise<HoldingModel[]> {
    const query = new URLSearchParams();
    if (params?.asset_type) query.append('asset_type', params.asset_type);
    if (params?.source) query.append('source', params.source);
    if (params?.search) query.append('search', params.search);
    return this.request<HoldingModel[]>(`/portfolio?${query.toString()}`);
  }

  async getAssets(): Promise<AssetModel[]> {
    return this.request<AssetModel[]>('/assets');
  }

  async getAssetDetail(id: string): Promise<AssetModel> {
    return this.request<AssetModel>(`/assets/${id}`);
  }

  async getInsights(): Promise<PortfolioInsightsResponse> {
    return this.request<PortfolioInsightsResponse>('/insights');
  }

  async getGoals(): Promise<GoalModel[]> {
    return this.request<GoalModel[]>('/goals');
  }

  async createGoal(goal: { title: string; category: string; target_amount: number; current_amount: number; time_period: string; icon?: string }): Promise<GoalModel> {
    return this.request<GoalModel>('/goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(goal),
    });
  }

  async deleteGoal(id: string): Promise<void> {
    await this.request(`/goals/${id}`, { method: 'DELETE' });
  }

  async resetDemoData(): Promise<void> {
    await this.request('/portfolio/reset', { method: 'POST' });
  }

  async simulateImport(sourceName: string): Promise<any> {
    return this.request('/import/demo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source_name: sourceName }),
    });
  }

  async uploadCsv(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    const token = this.getToken();
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${BASE_URL}/import/csv`, {
      method: 'POST',
      headers,
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Upload failed' }));
      throw new Error(err.error?.message || err.detail || 'CSV upload failed');
    }
    return res.json();
  }

  // ----------------- WATCHLIST -----------------

  async getWatchlist(): Promise<WatchlistItem[]> {
    return this.request<WatchlistItem[]>('/watchlist');
  }

  async addToWatchlist(assetId: string): Promise<any> {
    return this.request(`/watchlist/${assetId}`, { method: 'POST' });
  }

  async removeFromWatchlist(assetId: string): Promise<any> {
    return this.request(`/watchlist/${assetId}`, { method: 'DELETE' });
  }

  // ----------------- PAPER TRADING -----------------

  async getPaperAccount(): Promise<PaperAccount> {
    return this.request<PaperAccount>('/paper-trading/account');
  }

  async placePaperOrder(order: { asset_id: string; order_type: 'BUY' | 'SELL'; units: number; limit_price?: number }): Promise<PaperOrderResponse> {
    return this.request<PaperOrderResponse>('/paper-trading/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
  }

  async getPaperOrders(): Promise<PaperOrder[]> {
    return this.request<PaperOrder[]>('/paper-trading/orders');
  }

  // ----------------- LOCAL AI COPILOT -----------------

  async askCopilot(
    message: string,
    contextAssetId?: string,
    conversationHistory?: Array<{ role: string; content: string }>
  ): Promise<{ reply: string; suggested_questions: string[]; source: string; disclaimer: string; ollama_status?: string }> {
    return this.request('/copilot/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        context_asset_id: contextAssetId,
        conversation_history: conversationHistory,
      }),
    });
  }
}

export const api = new ApiClient();
