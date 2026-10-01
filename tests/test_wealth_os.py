import pytest
import asyncio
from backend.database import init_db, seed_demo_data
from backend.services.portfolio_service import (
    get_user_portfolio_summary,
    get_user_holdings,
    get_portfolio_analytics,
    get_portfolio_performance_history
)
from backend.services.portfolio_impact_service import calculate_portfolio_impact
from backend.services.local_ai_service import generate_chat_response

# Initialize test database
init_db()
seed_demo_data()

def test_empty_portfolio_handling():
    """Requirement #3 & #25: A user with no holdings must return 0 balances, empty arrays, and no fake portfolio."""
    empty_summary = get_user_portfolio_summary("non_existent_empty_user_999")
    assert empty_summary.total_value == 0.0
    assert empty_summary.total_invested == 0.0
    assert empty_summary.unrealized_pl == 0.0
    assert empty_summary.total_assets == 0
    assert len(empty_summary.allocations) == 0

    empty_holdings = get_user_holdings("non_existent_empty_user_999")
    assert len(empty_holdings) == 0

@pytest.mark.asyncio
async def test_empty_portfolio_impact_and_analytics():
    """Verify impact engine and analytics gracefully handle an empty portfolio without fabrication."""
    impact = await calculate_portfolio_impact("non_existent_empty_user_999")
    assert impact["total_portfolio_value"] == 0.0
    assert len(impact["contributors"]) == 0
    assert len(impact["insights"]) == 0

    analytics = get_portfolio_analytics("non_existent_empty_user_999")
    assert len(analytics["sector_exposure"]) == 0
    assert analytics["concentration"]["largest_holding"] is None

def test_portfolio_aggregation_and_allocation():
    """Requirements #2 & #4: Multi-asset aggregation across Equities, REITs, InvITs, and Bonds."""
    summary = get_user_portfolio_summary("demo-user-001")
    assert summary.total_value > 0
    assert summary.total_invested > 0
    assert summary.total_assets > 0
    assert len(summary.allocations) >= 3

    # Check allocation percentages sum to ~100%
    total_alloc = sum(a.percentage for a in summary.allocations)
    assert 99.0 <= total_alloc <= 101.0

    # Ensure canonical asset types exist
    asset_types = {a.asset_type for a in summary.allocations}
    assert "EQUITY" in asset_types
    assert "REIT" in asset_types or "BOND" in asset_types

def test_holding_model_metrics():
    """Requirement #7: Every holding must expose units, avg_buy_price, current_price, invested_value, and day changes."""
    holdings = get_user_holdings("demo-user-001")
    assert len(holdings) > 0
    for h in holdings:
        assert h.symbol != ""
        assert h.units > 0
        assert h.avg_buy_price > 0
        assert h.current_price > 0
        assert h.invested_value == round(h.units * h.avg_buy_price, 2)
        assert h.current_value == round(h.units * h.current_price, 2)
        assert hasattr(h, "day_change")
        assert hasattr(h, "day_change_percent")

@pytest.mark.asyncio
async def test_portfolio_impact_engine():
    """Requirements #8 & #10: Impact engine calculates holding contributions to today's P&L and grounds insights."""
    impact = await calculate_portfolio_impact("demo-user-001")
    assert impact["total_portfolio_value"] > 0
    assert "contributors" in impact
    assert len(impact["contributors"]) > 0

    # Test top contributor data structure
    top = impact["contributors"][0]
    assert "symbol" in top
    assert "day_pl_inr" in top
    assert "day_change_percent" in top
    assert "portfolio_impact_percent" in top

    # Verify macro pulse
    assert len(impact["macro_pulse"]) >= 4

    # Verify insights carry required groundings
    assert len(impact["insights"]) >= 1
    for insight in impact["insights"]:
        assert "what_happened" in insight
        assert "why_it_matters" in insight
        assert "portfolio_affected" in insight
        assert "labels" in insight
        for label in insight["labels"]:
            assert label in ["VERIFIED FACT", "CALCULATION", "EDUCATIONAL INTERPRETATION"]

def test_cross_asset_exposure_and_concentration():
    """Requirements #11 & #12: Cross-asset exposure and objective concentration analysis."""
    analytics = get_portfolio_analytics("demo-user-001")
    assert "sector_exposure" in analytics
    assert len(analytics["sector_exposure"]) > 0

    concentration = analytics["concentration"]
    assert "largest_holding" in concentration
    assert concentration["largest_holding"]["percentage"] > 0
    assert "analysis_note" in concentration
    assert "concentration" in concentration["analysis_note"].lower()

def test_risk_metrics_and_correlation():
    """Requirements #13 & #14: Annualized volatility, Sharpe ratio, Max drawdown, and real correlation matrix."""
    analytics = get_portfolio_analytics("demo-user-001")
    risk = analytics["risk_metrics"]
    assert "annualized_volatility" in risk
    assert risk["annualized_volatility"] >= 0
    assert "max_drawdown" in risk
    assert "beta_vs_nifty" in risk
    assert "Calculated from" in risk["status"]

    corr = analytics["correlation_matrix"]
    assert len(corr) >= 2
    # Self-correlation must be 1.0
    for item in corr:
        sym = item["symbol"]
        assert item["correlations"][sym] == 1.0

def test_portfolio_performance_and_benchmark():
    """Requirements #5 & #6: Real performance snapshots and benchmark comparison."""
    perf = get_portfolio_performance_history("demo-user-001", "ALL")
    assert "is_sufficient" in perf
    if perf["is_sufficient"]:
        assert len(perf["data_points"]) >= 2
        p0 = perf["data_points"][0]
        assert "total_value" in p0
        assert "benchmark_nifty" in p0
        assert "invested_value" in p0
    else:
        assert "Insufficient portfolio history" in perf["message"]

@pytest.mark.asyncio
async def test_copilot_portfolio_awareness():
    """Requirement #17: Copilot understands portfolio context and answers portfolio questions accurately."""
    res = await generate_chat_response(
        message="Why did my portfolio move today and what is my asset allocation?",
        user_id="demo-user-001"
    )
    assert res is not None
    assert "reply" in res
    assert len(res["reply"]) > 50
    # Response must mention portfolio, allocation or assets
    reply_lower = res["reply"].lower()
    assert "portfolio" in reply_lower or "allocation" in reply_lower or "asset" in reply_lower
