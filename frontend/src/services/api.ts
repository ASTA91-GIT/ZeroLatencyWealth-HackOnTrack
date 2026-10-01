import type {
  PortfolioSummary,
  HoldingModel,
  AssetModel,
  GoalModel,
  PortfolioInsightsResponse,
  UserProfile
} from '../types';

const BASE_URL = '/api';

export const api = {
  async getDemoUser(): Promise<{ token: string; user: UserProfile }> {
    const res = await fetch(`${BASE_URL}/auth/demo`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to login as demo user');
    return res.json();
  },

  async getPortfolioSummary(): Promise<PortfolioSummary> {
    const res = await fetch(`${BASE_URL}/portfolio/summary`);
    if (!res.ok) throw new Error('Failed to fetch portfolio summary');
    return res.json();
  },

  async getHoldings(params?: { asset_type?: string; source?: string; search?: string }): Promise<HoldingModel[]> {
    const query = new URLSearchParams();
    if (params?.asset_type) query.append('asset_type', params.asset_type);
    if (params?.source) query.append('source', params.source);
    if (params?.search) query.append('search', params.search);

    const res = await fetch(`${BASE_URL}/portfolio?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch holdings');
    return res.json();
  },

  async getAssets(): Promise<AssetModel[]> {
    const res = await fetch(`${BASE_URL}/assets`);
    if (!res.ok) throw new Error('Failed to fetch assets');
    return res.json();
  },

  async getAssetDetail(id: string): Promise<AssetModel> {
    const res = await fetch(`${BASE_URL}/assets/${id}`);
    if (!res.ok) throw new Error('Failed to fetch asset detail');
    return res.json();
  },

  async getInsights(): Promise<PortfolioInsightsResponse> {
    const res = await fetch(`${BASE_URL}/insights`);
    if (!res.ok) throw new Error('Failed to fetch insights');
    return res.json();
  },

  async getGoals(): Promise<GoalModel[]> {
    const res = await fetch(`${BASE_URL}/goals`);
    if (!res.ok) throw new Error('Failed to fetch goals');
    return res.json();
  },

  async createGoal(goal: { title: string; category: string; target_amount: number; current_amount: number; time_period: string; icon?: string }): Promise<GoalModel> {
    const res = await fetch(`${BASE_URL}/goals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(goal),
    });
    if (!res.ok) throw new Error('Failed to create goal');
    return res.json();
  },

  async deleteGoal(id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/goals/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete goal');
  },

  async resetDemoData(): Promise<void> {
    const res = await fetch(`${BASE_URL}/portfolio/reset`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to reset demo data');
  },

  async simulateImport(sourceName: string): Promise<any> {
    const res = await fetch(`${BASE_URL}/import/demo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source_name: sourceName }),
    });
    if (!res.ok) throw new Error('Failed to import from source');
    return res.json();
  },

  async uploadCsv(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${BASE_URL}/import/csv`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('Failed to upload CSV');
    return res.json();
  },

  async askCopilot(message: string, contextAssetId?: string): Promise<{ reply: string; suggested_questions: string[]; disclaimer: string }> {
    const res = await fetch(`${BASE_URL}/copilot/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, context_asset_id: contextAssetId }),
    });
    if (!res.ok) throw new Error('Failed to communicate with Copilot');
    return res.json();
  }
};
