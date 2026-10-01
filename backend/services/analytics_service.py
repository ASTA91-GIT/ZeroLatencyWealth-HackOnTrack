from typing import List, Dict, Any
from backend.database import get_connection
from backend.services.portfolio_service import get_user_portfolio_summary, get_user_holdings
from backend.models import PortfolioInsightsResponse, HistoricalDataPoint

def get_portfolio_insights(user_id: str = "demo-user-001") -> PortfolioInsightsResponse:
    summary = get_user_portfolio_summary(user_id)
    holdings = get_user_holdings(user_id)

    # 1. Generate factual, neutral observations
    observations = []

    equity_alloc = next((a for a in summary.allocations if a.asset_type == "EQUITY"), None)
    reit_alloc = next((a for a in summary.allocations if a.asset_type == "REIT"), None)
    bond_alloc = next((a for a in summary.allocations if a.asset_type == "BOND"), None)
    invit_alloc = next((a for a in summary.allocations if a.asset_type == "INVIT"), None)

    if equity_alloc:
        observations.append({
            "title": "Equities Allocation",
            "text": f"Equities represent approximately {equity_alloc.percentage}% (₹{equity_alloc.current_value:,.0f}) of this demo portfolio, offering growth potential alongside market volatility.",
            "category": "allocation",
            "type": "info"
        })

    if reit_alloc:
        observations.append({
            "title": "Real Estate Trust Exposure",
            "text": f"REIT exposure represents approximately {reit_alloc.percentage}% (₹{reit_alloc.current_value:,.0f}), providing commercial real estate exposure with contractual rental yields.",
            "category": "allocation",
            "type": "highlight"
        })

    if invit_alloc:
        observations.append({
            "title": "Infrastructure Cash Flows",
            "text": f"InvIT exposure accounts for approximately {invit_alloc.percentage}% (₹{invit_alloc.current_value:,.0f}), backed by essential utility assets like power transmission and national toll highways.",
            "category": "income",
            "type": "highlight"
        })

    if bond_alloc:
        observations.append({
            "title": "Fixed Income Anchor",
            "text": f"Bonds comprise approximately {bond_alloc.percentage}% (₹{bond_alloc.current_value:,.0f}), providing capital preservation and predictable coupon receipts.",
            "category": "risk",
            "type": "safe"
        })

    observations.append({
        "title": "Multi-Asset Category Breadth",
        "text": f"The demo portfolio contains {len(summary.allocations)} major asset categories spanning {summary.total_assets} instruments across 4 independent custody sources.",
        "category": "diversification",
        "type": "neutral"
    })

    # 2. Risk Assessment
    risk_assessment = {
        "overall_score": "Balanced Growth & Yield",
        "volatility_index": "Moderate (Beta ~0.72 vs Nifty 50)",
        "liquidity_profile": {
            "high_liquidity_pct": 57.0, # Equities + LiquidBeES
            "moderate_liquidity_pct": 33.0, # Sovereign Bonds + REITs
            "low_to_moderate_pct": 10.0 # Corporate Debentures & InvITs
        },
        "hedging_efficiency": "High - Multi-asset uncorrelated distributions"
    }

    # 3. Income Projections
    income_projections = {
        "projected_annual": summary.projected_annual_income,
        "weighted_yield_pct": summary.weighted_yield,
        "monthly_average": round(summary.projected_annual_income / 12, 2),
        "distribution_sources": [
            {"source_type": "REIT Distributions", "amount": 8750.0, "frequency": "Quarterly"},
            {"source_type": "InvIT Cash Payouts", "amount": 8580.0, "frequency": "Quarterly / Semi-Annual"},
            {"source_type": "Bond Coupons", "amount": 11520.0, "frequency": "Semi-Annual / Annual"},
            {"source_type": "Equity Dividends", "amount": 5420.0, "frequency": "Annual / Interim"}
        ]
    }

    # 4. Concentration Flags
    concentration_flags = []
    # Check if single holding > 20%
    for h in holdings:
        if h.allocation_percent > 20.0:
            concentration_flags.append({
                "symbol": h.symbol,
                "name": h.name,
                "allocation": h.allocation_percent,
                "asset_type": h.asset_type,
                "warning": f"{h.symbol} accounts for {h.allocation_percent}% of total portfolio value."
            })

    # 5. Historical Snapshots
    conn = get_connection()
    cursor = conn.cursor()
    hist_rows = cursor.execute("""
    SELECT date, total_value, invested_value, equity_val, bond_val, reit_val, invit_val, other_val
    FROM portfolio_snapshots
    WHERE user_id = ?
    ORDER BY id ASC
    """, (user_id,)).fetchall()
    conn.close()

    history = [
        HistoricalDataPoint(
            date=r["date"],
            total_value=r["total_value"],
            invested_value=r["invested_value"],
            equity_val=r["equity_val"],
            bond_val=r["bond_val"],
            reit_val=r["reit_val"],
            invit_val=r["invit_val"],
            other_val=r["other_val"]
        )
        for r in hist_rows
    ]

    return PortfolioInsightsResponse(
        summary={
            "total_value": summary.total_value,
            "total_invested": summary.total_invested,
            "unrealized_pl": summary.unrealized_pl,
            "unrealized_pl_percent": summary.unrealized_pl_percent,
            "total_assets": summary.total_assets
        },
        observations=observations,
        risk_assessment=risk_assessment,
        income_projections=income_projections,
        concentration_flags=concentration_flags,
        historical_trend=history
    )
