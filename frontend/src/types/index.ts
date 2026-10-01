export const ZERO_LATENCY_VERSION = '2.0.0';

export type AssetType = 'EQUITY' | 'BOND' | 'REIT' | 'INVIT' | 'INDEX' | 'COMMODITY' | 'CURRENCY' | 'OTHER';

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

export interface MarketQuote extends Partial<AssetModel> {
  symbol: string;
  name?: string;
  exchange?: string;
  asset_type?: AssetType;
  last_price?: number;
  open?: number;
  high?: number;
  low?: number;
  previous_close?: number;
  change?: number;
  change_percent?: number;
  volume?: number;
  timestamp?: string;
  market_status?: string;
  source?: string;
  is_stale?: boolean;
  currency?: string;
  day_52w_high?: number;
  day_52w_low?: number;
  volume_24h?: string;
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

export interface CandleData {
  time: number; // Unix epoch seconds
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface MarketDepthItem {
  price: number;
  quantity: number;
  orders: number;
}

export interface MarketDepthData {
  symbol: string;
  bids: MarketDepthItem[];
  asks: MarketDepthItem[];
  timestamp: string;
  is_available: boolean;
  message?: string;
}

export interface CompanyFundamentals {
  symbol: string;
  company_name?: string;
  sector?: string;
  industry?: string;
  market_cap?: number;
  pe_ratio?: number;
  pb_ratio?: number;
  eps?: number;
  dividend_yield?: number;
  roe?: number;
  roce?: number;
  debt_to_equity?: number;
  revenue?: number;
  net_income?: number;
  operating_margin?: number;
  free_cash_flow?: number;
  description?: string;
  financial_statements?: {
    income_statement?: Array<{ year: string; revenue: number; net_income: number; operating_income: number }>;
    balance_sheet?: Array<{ year: string; total_assets: number; total_debt: number; cash: number }>;
  };
  is_available: boolean;
  message?: string;
}

export interface MarketNews {
  id: string;
  headline: string;
  source: string;
  timestamp: string;
  url?: string;
  related_symbols?: string[];
  category: string;
}

export interface EconomicEvent {
  event: string;
  country: string;
  time: string;
  importance: string;
  previous?: string;
  forecast?: string;
  actual?: string;
}

export interface OptionLegData {
  symbol?: string;
  ltp: number;
  change?: number;
  volume?: number;
  oi?: number;
  change_oi?: number;
  iv?: number;
}

export interface OptionStrikeRow {
  strike: number;
  call?: OptionLegData;
  put?: OptionLegData;
}

export interface OptionChainData {
  symbol: string;
  underlying_price?: number;
  expiry_dates: string[];
  selected_expiry?: string;
  strikes: OptionStrikeRow[];
  is_available: boolean;
  message?: string;
}

export interface PriceAlert {
  id: string;
  user_id: string;
  symbol: string;
  target_price: number;
  condition: string;
  triggered: boolean;
  created_at: string;
}

export interface MarketSessionStatus {
  exchange: string;
  status: 'OPEN' | 'CLOSED' | 'PRE-MARKET' | 'POST-MARKET' | 'WEEKEND' | 'HOLIDAY';
  timestamp: string;
  is_open: boolean;
  next_open?: string;
  next_close?: string;
}

export interface MarketBreadthData {
  advances: number;
  declines: number;
  unchanged: number;
  total: number;
  advance_decline_ratio: number;
  volume_advancing: number;
  volume_declining: number;
}

