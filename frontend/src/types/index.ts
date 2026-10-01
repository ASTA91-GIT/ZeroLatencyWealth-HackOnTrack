export const ZERO_LATENCY_VERSION = '2.0.0';

export type AssetType = 'EQUITY' | 'BOND' | 'REIT' | 'INVIT' | 'OTHER';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  is_demo: boolean;
  email_verified?: boolean;
  created_at?: string;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
  message: string;
  refresh_token?: string;
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

export interface MarketIndex {
  symbol: string;
  name: string;
  value: number;
  change: number;
  change_percent: number;
  status: 'UP' | 'DOWN';
}

export interface MarketOverview {
  market_status: string;
  provider: string;
  last_updated: string;
  indices: MarketIndex[];
  top_gainers: MarketQuote[];
  top_losers: MarketQuote[];
  market_breadth: {
    advances: number;
    declines: number;
    unchanged: number;
  };
}

export interface MarketQuote extends AssetModel {
  volume_24h?: string;
  high_52w?: number;
  low_52w?: number;
  pe_ratio?: number;
  market_cap?: string;
  dividend_frequency?: string;
  history?: Array<{ date: string; price: number }>;
}

export interface WatchlistItem {
  id: string;
  asset_id: string;
  symbol: string;
  name: string;
  asset_type: AssetType;
  sector?: string;
  price: number;
  change_24h: number;
  annual_yield: number;
  risk_level?: string;
  added_at: string;
}

export interface PaperAccount {
  user_id: string;
  cash_balance: number;
  currency: string;
  holdings_value: number;
  total_portfolio_equity: number;
  unrealized_pl: number;
  is_simulated: boolean;
  disclaimer: string;
}

export interface PaperOrder {
  id: string;
  asset_id: string;
  symbol: string;
  name: string;
  asset_type: AssetType;
  order_type: 'BUY' | 'SELL';
  units: number;
  price: number;
  total_amount: number;
  status: string;
  created_at: string;
}

export interface PaperOrderResponse {
  success: boolean;
  order_id?: string;
  order_type?: string;
  symbol?: string;
  units?: number;
  execution_price?: number;
  total_amount?: number;
  remaining_cash?: number;
  status?: string;
  message: string;
  is_simulated: boolean;
  disclaimer: string;
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
  summary: Record<string, any>;
  observations: Array<{
    type?: string;
    title: string;
    category?: string;
    text?: string;
    description?: string;
    impact?: string;
    actionable_takeaway?: string;
  }>;
  risk_assessment: Record<string, any>;
  income_projections: Record<string, any>;
  concentration_flags: Array<{
    asset: string;
    allocation: number;
    threshold: number;
    severity: string;
    rationale: string;
  }>;
  historical_trend: HistoricalDataPoint[];
}

export interface AiHealthResponse {
  available: boolean;
  provider: string;
  base_url?: string;
  configured_model?: string;
  model_ready?: boolean;
  available_models?: string[];
  status: string;
  error?: string;
}
