from typing import List, Dict, Any, Optional
from datetime import datetime
from backend.services.portfolio_service import get_user_holdings, get_user_portfolio_summary
from backend.market_data import get_market_data_provider

async def calculate_portfolio_impact(user_id: str) -> Dict[str, Any]:
    """
    Portfolio Impact Engine:
    Connects real market movements to actual user holdings and macro trends.
    Calculates exact INR contributions, percentage allocations, and returns
    structured insights categorized into VERIFIED FACT, CALCULATION, and EDUCATIONAL INTERPRETATION.
    """
    holdings = get_user_holdings(user_id)
    summary = get_user_portfolio_summary(user_id)
    provider = get_market_data_provider()

    if not holdings or summary.total_value == 0:
        return {
            "total_portfolio_value": 0.0,
            "today_total_pl": 0.0,
            "contributors": [],
            "insights": [],
            "macro_pulse": []
        }

    # Fetch live quotes for macro context
    macro_symbols = ["NIFTY", "SENSEX", "GOLD", "CRUDE", "USDINR"]
    macro_quotes = {}
    for ms in macro_symbols:
        try:
            q = await provider.get_quote(ms)
            if q:
                macro_quotes[ms] = q
        except Exception:
            pass

    contributors = []
    total_day_pl = 0.0

    # Calculate holding level contribution
    for h in holdings:
        try:
            quote = await provider.get_quote(h.symbol)
            cur_price = quote.last_price if quote and quote.last_price > 0 else h.current_price
            day_chg_pct = quote.change_percent if quote else (getattr(h, 'day_change_percent', 0.0) or 0.0)
        except Exception:
            cur_price = h.current_price
            day_chg_pct = getattr(h, 'day_change_percent', 0.0) or 0.0

        current_val = h.units * cur_price
        # Previous close price
        prev_price = cur_price / (1.0 + (day_chg_pct / 100.0)) if day_chg_pct != -100 else cur_price
        day_pl_inr = current_val - (h.units * prev_price)
        total_day_pl += day_pl_inr

        allocation_pct = (current_val / summary.total_value * 100.0) if summary.total_value > 0 else 0.0
        portfolio_impact_pct = (day_pl_inr / summary.total_value * 100.0) if summary.total_value > 0 else 0.0

        contributors.append({
            "symbol": h.symbol,
            "name": h.name,
            "asset_type": h.asset_type,
            "sector": h.sector or "Diversified",
            "units": h.units,
            "current_price": round(cur_price, 2),
            "current_value": round(current_val, 2),
            "day_change_percent": round(day_chg_pct, 2),
            "day_pl_inr": round(day_pl_inr, 2),
            "allocation_percent": round(allocation_pct, 1),
            "portfolio_impact_percent": round(portfolio_impact_pct, 2)
        })

    # Sort contributors by absolute INR impact
    contributors.sort(key=lambda x: abs(x["day_pl_inr"]), reverse=True)

    # Generate grounded insights
    insights = []

    # 1. Top Asset Driver Insight
    if contributors:
        top_driver = contributors[0]
        direction = "gained" if top_driver["day_pl_inr"] >= 0 else "declined"
        sign = "+" if top_driver["day_pl_inr"] >= 0 else ""
        insights.append({
            "id": "insight_top_driver",
            "title": f"Top Portfolio Movement Driver: {top_driver['symbol']}",
            "what_happened": f"{top_driver['symbol']} ({top_driver['name']}) {direction} {abs(top_driver['day_change_percent']):.2f}% in today's trading session.",
            "why_it_matters": f"Holding {top_driver['units']} units representing {top_driver['allocation_percent']}% of your total wealth makes it the single largest contributor to today's portfolio volatility.",
            "portfolio_impact": f"{sign}₹{abs(top_driver['day_pl_inr']):,.2f} ({sign}{top_driver['portfolio_impact_percent']:.2f}% impact on total wealth).",
            "portfolio_affected": f"{top_driver['symbol']} ({top_driver['asset_type']}) - {top_driver['allocation_percent']}% allocation",
            "affected_assets": [top_driver['symbol']],
            "level": "CALCULATION",
            "labels": ["CALCULATION"],
            "sentiment": "positive" if top_driver["day_pl_inr"] >= 0 else "negative"
        })

    # 2. Asset Class / REIT / Bond Distribution Insight
    reit_invit_contributors = [c for c in contributors if c["asset_type"] in ["REIT", "INVIT", "BOND"]]
    if reit_invit_contributors:
        total_yield_val = sum(c["current_value"] for c in reit_invit_contributors)
        yield_alloc = (total_yield_val / summary.total_value * 100) if summary.total_value > 0 else 0
        insights.append({
            "id": "insight_yield_cushion",
            "title": "Income & Statutory Distribution Cushion",
            "what_happened": f"You hold ₹{total_yield_val:,.2f} ({yield_alloc:.1f}%) in yield-generating assets (REITs, InvITs, and Sovereign Bonds).",
            "why_it_matters": "Under SEBI regulations, REITs and InvITs must distribute at least 90% of Net Distributable Cash Flows (NDCF) bi-annually, providing cash flow stability even during equity market drawdowns.",
            "portfolio_impact": f"Lowers overall portfolio beta and provides an estimated ₹{summary.projected_annual_income:,.2f} in projected annual distributions.",
            "portfolio_affected": "REIT, InvIT and Sovereign Bond sleeves",
            "affected_assets": [c["symbol"] for c in reit_invit_contributors],
            "level": "EDUCATIONAL INTERPRETATION",
            "labels": ["EDUCATIONAL INTERPRETATION"],
            "sentiment": "neutral"
        })

    # 3. Macro Benchmark Correlation Insight
    nifty_quote = macro_quotes.get("NIFTY")
    if nifty_quote:
        nifty_chg = nifty_quote.change_percent
        portfolio_chg = summary.day_change_percent
        diff = portfolio_chg - nifty_chg
        rel_performance = "outperforming" if diff > 0 else "lagging"
        insights.append({
            "id": "insight_benchmark_pulse",
            "title": f"Market Comparison: NIFTY 50 ({nifty_chg:+.2f}%)",
            "what_happened": f"NIFTY 50 moved {nifty_chg:+.2f}% while your multi-asset portfolio moved {portfolio_chg:+.2f}%.",
            "why_it_matters": f"Your portfolio is {rel_performance} the broad market benchmark by {abs(diff):.2f}% today due to your multi-asset diversification.",
            "portfolio_impact": f"Net day change across all holdings: {portfolio_chg:+.2f}% (₹{summary.day_change_amount:+,.2f}).",
            "portfolio_affected": "Consolidated Multi-Asset Portfolio",
            "affected_assets": ["All Holdings"],
            "level": "VERIFIED FACT",
            "labels": ["VERIFIED FACT"],
            "sentiment": "positive" if diff >= 0 else "neutral"
        })

    # Macro pulse cards
    macro_pulse = []
    for sym, q in macro_quotes.items():
        macro_pulse.append({
            "symbol": sym,
            "name": q.name or sym,
            "last_price": q.last_price,
            "change": q.change,
            "change_percent": q.change_percent,
            "timestamp": q.timestamp,
            "status": q.market_status
        })

    return {
        "total_portfolio_value": summary.total_value,
        "total_invested": summary.total_invested,
        "total_day_pl": round(total_day_pl, 2),
        "contributors": contributors,
        "insights": insights,
        "macro_pulse": macro_pulse
    }
