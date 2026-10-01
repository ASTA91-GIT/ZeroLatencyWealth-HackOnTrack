import os
import re
from typing import Dict, Any, List, Optional
from backend.services.portfolio_service import get_user_portfolio_summary, get_user_holdings, get_asset_by_id
from backend.models import ChatResponse

DISCLAIMER = "SIMULATION / DEMO DATA — Educational information only. Not financial advice or investment solicitation."

# Comprehensive Educational & Portfolio Knowledge Base for Deterministic Copilot
KNOWLEDGE_TOPICS = {
    "reit": {
        "title": "Real Estate Investment Trusts (REITs)",
        "explanation": (
            "A **Real Estate Investment Trust (REIT)** is an investment vehicle that owns, operates, or finances income-generating commercial real estate.\n\n"
            "### How it works:\n"
            "- **Structure**: Similar to mutual funds, REITs pool capital from multiple retail and institutional investors to purchase Grade-A commercial properties (tech parks, corporate office towers, logistics hubs).\n"
            "- **90% Mandatory Distribution Rule**: Under SEBI guidelines in India (and globally), REITs must distribute at least 90% of their net distributable cash flows to unitholders regularly (typically quarterly).\n"
            "- **Liquidity**: Unlike physical real estate which takes months to sell and requires large capital, REIT units trade on the stock exchange (NSE/BSE) just like ordinary shares.\n"
            "- **Income Stream**: Yield is composed of lease rentals paid by multinational tenants plus long-term capital appreciation of underlying land and buildings.\n\n"
            "### In your Demo Portfolio:\n"
            "- REIT holdings include **Embassy Office Parks REIT**, **Mindspace Business Parks**, and **Brookfield India Real Estate Trust**.\n"
            "- Current REIT allocation: **~14.9% (₹1,25,435)** with an average indicative yield of **~7.0%**."
        ),
        "suggested": [
            "What percentage is invested in REITs?",
            "REIT vs InvIT — what is the difference?",
            "What is an InvIT?",
            "Show my demo portfolio allocation."
        ]
    },
    "invit": {
        "title": "Infrastructure Investment Trusts (InvITs)",
        "explanation": (
            "An **Infrastructure Investment Trust (InvIT)** is an investment vehicle designed to pool money to invest directly in revenue-generating infrastructure assets.\n\n"
            "### How it works:\n"
            "- **Asset Types**: InvITs own infrastructure projects with long-term concession agreements — such as power transmission lines, national highway toll roads, gas pipelines, and telecom towers.\n"
            "- **Cash Flow Predictability**: Revenue comes from government-backed tariffs or essential toll collections, making income relatively steady regardless of standard business cycles.\n"
            "- **90% Cash Distribution Mandate**: Similar to REITs, SEBI mandates that InvITs distribute >=90% of net distributable cash flow at least half-yearly or quarterly.\n"
            "- **Inflation Linkage**: Toll fees and power transmission contracts frequently feature periodic tariff escalations linked to inflation indices.\n\n"
            "### In your Demo Portfolio:\n"
            "- InvIT holdings include **PowerGrid Infrastructure Trust (PGInvIT)** and **IRB InvIT Fund**.\n"
            "- Current InvIT allocation: **~10.0% (₹84,140)** with an attractive yield of **~10.1%**."
        ),
        "suggested": [
            "REIT vs InvIT: How do they differ?",
            "How do bonds compare to InvITs?",
            "Show my demo portfolio allocation.",
            "Explain PowerGrid InvIT."
        ]
    },
    "equity_vs_bond": {
        "title": "Equities vs. Bonds Comparison",
        "explanation": (
            "### Equities vs. Bonds: Core Differences\n\n"
            "| Feature | Equities (Stocks) | Bonds (Fixed Income) |\n"
            "|---|---|---|\n"
            "| **Ownership vs Loan** | Represents partial equity ownership in the business. | Represents a loan made by you to a government or corporation. |\n"
            "| **Return Mechanism** | Share price growth (capital gains) + variable dividends. | Fixed or floating coupon (interest) payments + principal return at maturity. |\n"
            "| **Risk & Volatility** | Higher volatility; potential for capital loss during economic downturns. | Lower volatility; backed by sovereign or corporate credit ratings. |\n"
            "| **Liquidation Priority** | Residual claimants (paid last in event of bankruptcy). | Senior claimants (paid before common equity shareholders). |\n"
            "| **Role in Portfolio** | Primary engine for inflation-beating wealth accumulation. | Capital preservation anchor and steady cash flow stabilizer. |\n\n"
            "In your demo portfolio, equities comprise **~52%** (growth) while bonds provide a **18%** defensive cushion."
        ),
        "suggested": [
            "What is a Sovereign Bond?",
            "Explain REITs simply.",
            "Show my demo portfolio allocation."
        ]
    },
    "reit_vs_invit": {
        "title": "REIT vs. InvIT Comparison",
        "explanation": (
            "### REITs vs. InvITs: Understanding Alternative Yield Assets\n\n"
            "| Feature | REIT (Real Estate Trust) | InvIT (Infrastructure Trust) |\n"
            "|---|---|---|\n"
            "| **Underlying Assets** | Grade-A IT parks, commercial office complexes, retail malls. | Highways, toll roads, power transmission grids, telecom towers. |\n"
            "| **Revenue Engine** | Long-term commercial office lease rentals (multi-year escalation clauses). | Regulated transmission tariffs, vehicular toll collection fees. |\n"
            "| **Yield Profile** | Typically 6.5% – 7.5% distribution yield + property value appreciation. | Typically 9.0% – 11.0% distribution yield (higher cash yield, lower terminal land value). |\n"
            "| **Depreciation Factor** | Land value often appreciates over decades. | Concession periods (e.g. 30-year toll road) amortize over time. |\n"
            "| **Regulatory Distribution** | >=90% of net distributable cash flows distributed periodically. | >=90% of net distributable cash flows distributed periodically. |\n\n"
            "Both provide accessible, liquid fractional ownership of physical infrastructure with institutional management."
        ),
        "suggested": [
            "What is a REIT?",
            "What is an InvIT?",
            "What percentage is invested in REITs?",
            "Show my demo portfolio allocation."
        ]
    }
}

async def generate_copilot_response(
    message: str,
    context_asset_id: Optional[str] = None,
    user_id: str = "demo-user-001"
) -> ChatResponse:
    query = message.strip().lower()
    summary = get_user_portfolio_summary(user_id)
    holdings = get_user_holdings(user_id)

    # 1. Guardrail against buy/sell financial advice
    advice_triggers = ["should i buy", "should i sell", "buy this", "sell this", "what to buy", "recommend a stock", "target price"]
    if any(trigger in query for trigger in advice_triggers):
        reply = (
            "**Policy Notice: Educational Guidance Only**\n\n"
            "ZeroLatency Wealth is an educational and portfolio consolidation platform. We strictly do not provide buy, sell, or hold recommendations, nor personalized investment advice.\n\n"
            "Instead, I can help you analyze:\n"
            "- How different asset classes (Equities, Bonds, REITs, InvITs) fit your risk profile\n"
            "- Your demo portfolio's current asset allocation and concentration\n"
            "- The fundamental mechanics, cash flow structures, and risk factors of specific financial instruments."
        )
        return ChatResponse(
            reply=reply,
            suggested_questions=[
                "Show my demo portfolio allocation.",
                "What is the difference between REITs and InvITs?",
                "How do bonds protect my portfolio?"
            ],
            disclaimer=DISCLAIMER
        )

    # 2. Specific Asset Context Query
    if context_asset_id or "this asset" in query:
        target_asset = None
        if context_asset_id:
            target_asset = get_asset_by_id(context_asset_id)
        if not target_asset and holdings:
            target_asset = get_asset_by_id(holdings[0].asset_id)

        if target_asset:
            holding_info = next((h for h in holdings if h.asset_id == target_asset.id), None)
            holding_context = ""
            if holding_info:
                holding_context = (
                    f"\n\n### Your Demo Holding in {target_asset.symbol}:\n"
                    f"- **Source**: {holding_info.source}\n"
                    f"- **Units**: {holding_info.units:,.2f} @ Avg Price ₹{holding_info.avg_buy_price:,.2f}\n"
                    f"- **Current Value**: ₹{holding_info.current_value:,.2f} ({holding_info.allocation_percent}% of portfolio)\n"
                    f"- **Unrealized Gain/Loss**: {'+' if holding_info.unrealized_pl >= 0 else ''}₹{holding_info.unrealized_pl:,.2f} ({holding_info.unrealized_pl_percent:+.2f}%)"
                )

            reply = (
                f"### Asset Overview: {target_asset.name} ({target_asset.symbol})\n"
                f"- **Asset Class**: `{target_asset.asset_type}` | Sector: `{target_asset.sector or 'Diversified'}`\n"
                f"- **Current Market Price**: ₹{target_asset.price:,.2f} ({'+' if target_asset.change_24h >= 0 else ''}{target_asset.change_24h}% today)\n"
                f"- **Risk Classification**: {target_asset.risk_level}\n"
                f"- **Indicated Yield**: {target_asset.annual_yield}%\n"
                f"- **Liquidity Rating**: {target_asset.liquidity_score}\n\n"
                f"**Description & Role**:\n{target_asset.description}{holding_context}"
            )
            return ChatResponse(
                reply=reply,
                suggested_questions=[
                    f"How does {target_asset.symbol} compare to other holdings?",
                    "Show my demo portfolio allocation.",
                    "Explain REITs simply."
                ],
                context_data={"asset_id": target_asset.id, "symbol": target_asset.symbol},
                disclaimer=DISCLAIMER
            )

    # 3. Portfolio Allocation queries
    if any(k in query for k in ["allocation", "my portfolio", "breakdown", "distribution", "how much is invested"]):
        alloc_lines = []
        for a in summary.allocations:
            alloc_lines.append(f"- **{a.asset_type}**: {a.percentage}% (₹{a.current_value:,.0f}) across {a.asset_count} holding(s)")
        
        reply = (
            f"### ZeroLatency Demo Portfolio Overview\n"
            f"- **Total Portfolio Value**: ₹{summary.total_value:,.2f}\n"
            f"- **Total Capital Invested**: ₹{summary.total_invested:,.2f}\n"
            f"- **Unrealized P/L**: {'+' if summary.unrealized_pl >= 0 else ''}₹{summary.unrealized_pl:,.2f} ({summary.unrealized_pl_percent:+.2f}%)\n"
            f"- **Estimated Annual Cash Flow Yield**: {summary.weighted_yield}% (~₹{summary.projected_annual_income:,.0f}/year)\n\n"
            f"### Multi-Asset Allocation:\n" + "\n".join(alloc_lines) + "\n\n"
            f"**Observation**: This allocation combines equity growth engines (~52%) with high-yielding alternative cash-flow assets (REITs 15% & InvITs 10%) and sovereign debt preservation (18%)."
        )
        return ChatResponse(
            reply=reply,
            suggested_questions=[
                "What percentage is invested in REITs?",
                "What is an InvIT?",
                "How are bonds different from equities?"
            ],
            disclaimer=DISCLAIMER
        )

    # 4. REIT percentage query specifically
    if "percentage" in query and "reit" in query or "how much" in query and "reit" in query:
        reit_alloc = next((a for a in summary.allocations if a.asset_type == "REIT"), None)
        pct = reit_alloc.percentage if reit_alloc else 14.9
        val = reit_alloc.current_value if reit_alloc else 125435.0
        reply = (
            f"### REIT Allocation in Demo Portfolio\n\n"
            f"Your demo portfolio has **{pct}%** allocated to Real Estate Investment Trusts (REITs), representing a current value of **₹{val:,.2f}**.\n\n"
            f"### Holdings in this bucket:\n"
            f"- **Embassy Office Parks REIT** (Broker A)\n"
            f"- **Mindspace Business Parks REIT** (Broker B)\n"
            f"- **Brookfield India Real Estate Trust** (Imported CSV)\n\n"
            f"These provide contractual rental cash flows from top Grade-A office tenants distributed quarterly."
        )
        return ChatResponse(
            reply=reply,
            suggested_questions=[
                "What is a REIT?",
                "What percentage is in InvITs?",
                "Show my demo portfolio allocation."
            ],
            disclaimer=DISCLAIMER
        )

    # 5. Concept explanations
    if "reit vs invit" in query or "difference between reit and invit" in query:
        item = KNOWLEDGE_TOPICS["reit_vs_invit"]
        return ChatResponse(reply=item["explanation"], suggested_questions=item["suggested"], disclaimer=DISCLAIMER)

    if "reit" in query:
        item = KNOWLEDGE_TOPICS["reit"]
        return ChatResponse(reply=item["explanation"], suggested_questions=item["suggested"], disclaimer=DISCLAIMER)

    if "invit" in query:
        item = KNOWLEDGE_TOPICS["invit"]
        return ChatResponse(reply=item["explanation"], suggested_questions=item["suggested"], disclaimer=DISCLAIMER)

    if "bond" in query and ("equity" in query or "stock" in query or "difference" in query):
        item = KNOWLEDGE_TOPICS["equity_vs_bond"]
        return ChatResponse(reply=item["explanation"], suggested_questions=item["suggested"], disclaimer=DISCLAIMER)

    if "bond" in query or "sovereign" in query:
        reply = (
            "### Understanding Bonds & Fixed Income\n\n"
            "A **Bond** is a fixed-income instrument representing a loan made by an investor to a borrower (government or corporation).\n\n"
            "### Key Characteristics:\n"
            "- **Coupon Rate**: The periodic interest rate paid to the bondholder (e.g. 7.18% semi-annually).\n"
            "- **Maturity Date**: The date when the principal investment amount is repaid in full.\n"
            "- **Sovereign Safety**: Government of India bonds carry virtually zero credit default risk.\n"
            "- **Role in Portfolio**: Bonds act as a shock absorber when equities fluctuate, ensuring steady cash flow.\n\n"
            "In your demo portfolio, bonds comprise **18% (₹1,52,380)**."
        )
        return ChatResponse(
            reply=reply,
            suggested_questions=[
                "How are bonds different from equities?",
                "Show my demo portfolio allocation.",
                "What is a REIT?"
            ],
            disclaimer=DISCLAIMER
        )

    # Default friendly educational response
    default_reply = (
        "Hello! I am **ZeroLatency Copilot**, your intelligent multi-asset awareness assistant.\n\n"
        "I can help you understand complex financial instruments and analyze your simulated holdings:\n"
        "- **Asset Education**: Ask me about REITs, InvITs, Sovereign Bonds, or Equity ETFs.\n"
        "- **Portfolio Insights**: Ask for your allocation breakdown, concentration factors, or projected cash flows.\n"
        "- **Comparisons**: Ask 'REIT vs InvIT' or 'Bonds vs Equities'.\n\n"
        "How can I assist your portfolio journey today?"
    )
    return ChatResponse(
        reply=default_reply,
        suggested_questions=[
            "What is a REIT?",
            "Explain InvITs simply.",
            "How are bonds different from equities?",
            "Show my demo portfolio allocation."
        ],
        disclaimer=DISCLAIMER
    )
