export const ZERO_LATENCY_VERSION = '1.0.0';

export type AssetType = 'EQUITY' | 'BOND' | 'REIT' | 'INVIT' | 'OTHER';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  is_demo: boolean;
  created_at?: string;
}

export interface HoldingModel {
  id: string;
  user_id: string;
  asset_id: string;
  symbol: string;
  name: string;
  asset_type: AssetType;
  sector?: string;
  source: string;
  units: number;
  avg_buy_price: number;
  current_price: number;
  invested_value: number;
  current_value: number;
  unrealized_pl: number;
  unrealized_pl_percent: number;
  allocation_percent: number;
  annual_yield: number;
  risk_level?: string;
}

export interface AllocationBreakdown {
  asset_type: AssetType;
  current_value: number;
  invested_value: number;
  percentage: number;
  unrealized_pl: number;
  unrealized_pl_percent: number;
  asset_count: number;
}

export interface SourceBreakdown {
  source: string;
  current_value: number;
  percentage: number;
  asset_count: number;
}

export interface PortfolioSummary {
  total_value: number;
  total_invested: number;
  unrealized_pl: number;
  unrealized_pl_percent: number;
  day_change_amount: number;
  day_change_percent: number;
  total_assets: number;
  projected_annual_income: number;
  weighted_yield: number;
  allocations: AllocationBreakdown[];
  sources: SourceBreakdown[];
  last_updated: string;
  is_demo: boolean;
}

export interface AssetModel {
  id: string;
  symbol: string;
  name: string;
  asset_type: AssetType;
  category?: string;
  sector?: string;
  description?: string;
  risk_level?: string;
  annual_yield: number;
  liquidity_score?: string;
  price: number;
  change_24h: number;
}

export interface GoalModel {
  id: string;
  user_id: string;
  title: string;
  category: string;
  target_amount: number;
  current_amount: number;
  progress_percent: number;
  time_period: string;
  icon: string;
  created_at?: string;
}

export interface HistoricalDataPoint {
  date: string;
  total_value: number;
  invested_value: number;
  equity_val: number;
  bond_val: number;
  reit_val: number;
  invit_val: number;
  other_val: number;
}

export interface PortfolioInsightsResponse {
  summary: {
    total_value: number;
    total_invested: number;
    unrealized_pl: number;
    unrealized_pl_percent: number;
    total_assets: number;
  };
  observations: Array<{
    title: string;
    text: string;
    category: string;
    type: string;
  }>;
  risk_assessment: {
    overall_score: string;
    volatility_index: string;
    liquidity_profile: {
      high_liquidity_pct: number;
      moderate_liquidity_pct: number;
      low_to_moderate_pct: number;
    };
    hedging_efficiency: string;
  };
  income_projections: {
    projected_annual: number;
    weighted_yield_pct: number;
    monthly_average: number;
    distribution_sources: Array<{
      source_type: string;
      amount: number;
      frequency: string;
    }>;
  };
  concentration_flags: Array<{
    symbol: string;
    name: string;
    allocation: number;
    asset_type: string;
    warning: string;
  }>;
  historical_trend: HistoricalDataPoint[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'copilot';
  text: string;
  timestamp: string;
  suggestedQuestions?: string[];
  disclaimer?: string;
}
