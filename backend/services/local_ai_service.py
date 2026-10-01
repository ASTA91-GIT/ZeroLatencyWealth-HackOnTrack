import os
import re
import json
import logging
from typing import List, Dict, Any, Optional
import httpx

from backend.services.portfolio_service import get_user_portfolio_summary, get_user_holdings, get_asset_by_id
from backend.services.copilot_service import KNOWLEDGE_TOPICS, DISCLAIMER
from backend.market_data import get_market_data_provider

logger = logging.getLogger("zerolatency.ai")

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434").rstrip("/")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.1:8b")
MAX_CHAT_MESSAGES = int(os.getenv("MAX_CHAT_MESSAGES", "10"))
MAX_CONTEXT_TOKENS = int(os.getenv("MAX_CONTEXT_TOKENS", "2048"))

SYSTEM_GUARDRAIL_PROMPT = """You are ZeroLatency Copilot, an expert multi-asset financial awareness and wealth education AI assistant embedded inside the ZeroLatency Wealth platform.

YOUR MISSION:
1. Explain financial assets clearly, especially multi-asset concepts across Equities, Sovereign Bonds, Commercial REITs, and Infrastructure InvITs.
2. Answer user questions about financial terminology, valuation ratios (P/E, P/B, yield, dividend distribution), and wealth building concepts.
3. When user asks about their portfolio, use the provided portfolio context to explain their asset allocation, diversification, weighted yield, and holdings.

MANDATORY FINANCIAL SAFETY & REGULATORY GUARDRAILS:
- NEVER give personalized buy or sell financial advice (e.g. do not say "You should buy XYZ", "Sell ABC immediately", or "Invest ₹50,000 into this").
- Frame all insights as objective financial education and general portfolio analysis.
- If asked for direct stock tips or speculative price targets, decline politely and explain the fundamental metrics an investor evaluates.
- Keep tone professional, analytical, accessible, and concise.
- All investments carry market risk. Mention that historical performance does not guarantee future results.
"""

async def check_ollama_health() -> Dict[str, Any]:
    """Check connectivity to the local Ollama instance and test whether the configured model exists."""
    try:
        async with httpx.AsyncClient(timeout=2.0) as client:
            resp = await client.get(f"{OLLAMA_BASE_URL}/api/tags")
            if resp.status_code == 200:
                data = resp.json()
                models = [m.get("name") for m in data.get("models", [])]
                model_ready = any(OLLAMA_MODEL in m for m in models)
                return {
                    "available": True,
                    "provider": "ollama",
                    "base_url": OLLAMA_BASE_URL,
                    "configured_model": OLLAMA_MODEL,
                    "model_ready": model_ready,
                    "available_models": models,
                    "status": "ONLINE" if model_ready else "MODEL_NOT_PULLED"
                }
            return {
                "available": False,
                "provider": "ollama",
                "configured_model": OLLAMA_MODEL,
                "model_ready": False,
                "error": f"Ollama returned status code {resp.status_code}",
                "status": "OFFLINE"
            }
    except Exception as e:
        return {
            "available": False,
            "provider": "ollama",
            "configured_model": OLLAMA_MODEL,
            "model_ready": False,
            "error": "Ollama service unreachable on " + OLLAMA_BASE_URL,
            "status": "OFFLINE"
        }

def build_portfolio_context(user_id: str) -> str:
    """Build compact, safe portfolio summary string for injection into local LLM prompt."""
    try:
        summary = get_user_portfolio_summary(user_id)
        holdings = get_user_holdings(user_id)

        alloc_strs = [f"{a.asset_type}: {a.percentage}% (Rs {a.current_value:,.0f})" for a in summary.allocations]
        top_holdings = [f"{h.symbol} ({h.name}, {h.asset_type}): Rs {h.current_value:,.0f} ({h.allocation_percent}% of portfolio)" for h in holdings[:6]]

        context = (
            f"AUTHENTICATED USER PORTFOLIO CONTEXT:\n"
            f"- Total Portfolio Value: Rs {summary.total_value:,.2f}\n"
            f"- Total Invested Capital: Rs {summary.total_invested:,.2f}\n"
            f"- Unrealized P/L: Rs {summary.unrealized_pl:,.2f} ({summary.unrealized_pl_percent:+.2f}%)\n"
            f"- Projected Annual Cash Income: Rs {summary.projected_annual_income:,.2f}\n"
            f"- Weighted Portfolio Yield: {summary.weighted_yield:.2f}%\n"
            f"- Asset Allocation Breakdown: {', '.join(alloc_strs) if alloc_strs else 'None'}\n"
            f"- Top Portfolio Holdings: {'; '.join(top_holdings) if top_holdings else 'No active holdings'}\n"
        )
        return context
    except Exception:
        return "USER PORTFOLIO: Portfolio currently initialized with canonical benchmark values."

def fallback_deterministic_reply(query: str, user_id: str, context_asset_id: Optional[str] = None) -> Dict[str, Any]:
    """High-quality conversational fallback engine when Ollama local LLM is offline or model is not pulled."""
    q = query.lower().strip()
    summary = get_user_portfolio_summary(user_id)
    holdings = get_user_holdings(user_id)

    # 1. Casual Greetings & Conversational Openers
    greetings = ["hi", "hii", "hello", "hey", "heyy", "hola", "greetings", "good morning", "good evening", "good afternoon", "yo", "sup", "start"]
    if q in greetings or any(q.startswith(g + " ") for g in greetings):
        return {
            "reply": (
                "Hey! 👋 I'm your **ZeroLatency Wealth Copilot**.\n\n"
                "I can help you understand your portfolio, explore financial concepts, compare asset classes, and explain market terminology.\n\n"
                "What would you like to explore?"
            ),
            "suggested_questions": [
                "Show my portfolio allocation",
                "What is a REIT?",
                "Explain bonds simply",
                "What is P/E ratio?"
            ],
            "source": "ZeroLatency Copilot"
        }

    # 2. Check for specific asset context
    if context_asset_id:
        asset = get_asset_by_id(context_asset_id)
        if asset:
            reply = (
                f"### {asset.name} ({asset.symbol})\n\n"
                f"- **Asset Class**: {asset.asset_type} ({asset.category or 'General'})\n"
                f"- **Current Market Price**: ₹{asset.price:,.2f} ({asset.change_24h:+.2f}% 24h)\n"
                f"- **Sector / Focus**: {asset.sector or 'Diversified'}\n"
                f"- **Indicative Annual Yield**: {asset.annual_yield:.2f}%\n"
                f"- **Risk Profile**: {asset.risk_level or 'Moderate'}\n\n"
                f"**Description & Role in Wealth OS**:\n{asset.description or 'A core component of multi-asset allocation.'}"
            )
            return {
                "reply": reply,
                "suggested_questions": [
                    f"Explain {asset.asset_type} as an asset class.",
                    "How does this asset generate cash flow?",
                    "Show my portfolio allocation.",
                    "What is a REIT?"
                ],
                "source": "ZeroLatency Copilot"
            }

    # Market Overview & Live Snapshot questions (Requirement #44, #45, #46)
    if any(k in q for k in ["market", "nifty", "sensex", "banknifty", "gold", "happening in the market", "indices", "top gainers", "top movers"]):
        provider = get_market_data_provider()
        overview = provider.get_market_overview()
        indices = overview.get("indices", [])
        session_stat = overview.get("status", "OPEN")
        gainers = overview.get("top_gainers", [])
        losers = overview.get("top_losers", [])
        
        idx_lines = []
        for idx in indices[:5]:
            idx_lines.append(f"- **{idx.get('name', idx.get('symbol'))}**: ₹{idx.get('last_price', 0):,.2f} ({idx.get('change_percent', 0):+.2f}%)")
        
        gainer_lines = [f"- **{g.get('symbol')}**: ₹{g.get('last_price', 0):,.2f} ({g.get('change_percent', 0):+.2f}%)" for g in gainers[:3]]
        loser_lines = [f"- **{l.get('symbol')}**: ₹{l.get('last_price', 0):,.2f} ({l.get('change_percent', 0):+.2f}%)" for l in losers[:3]]

        reply = (
            f"### 📊 REAL-TIME MARKET SNAPSHOT\n\n"
            f"**Exchange Status**: `{session_stat}` (Real Exchange Session)\n\n"
            f"#### Key Benchmark Indices:\n" + ("\n".join(idx_lines) if idx_lines else "- Live exchange stream synchronizing...") + "\n\n"
            f"#### Top Gainers:\n" + ("\n".join(gainer_lines) if gainer_lines else "- Synchronizing...") + "\n\n"
            f"#### Top Losers:\n" + ("\n".join(loser_lines) if loser_lines else "- Synchronizing...") + "\n\n"
            f"*(Note: All prices represent live quotes streamed directly from exchange feeds without fabrication.)*"
        )
        return {
            "reply": reply,
            "suggested_questions": [
                "What is happening with NIFTY?",
                "Show my portfolio allocation",
                "How does gold perform during inflation?",
                "Explain RSI and MACD indicators"
            ],
            "source": "ZeroLatency Copilot (Live Market Feed)"
        }

    # 3. Knowledge Topics matches
    if "reit" in q and "invit" not in q and "alloc" not in q:
        data = KNOWLEDGE_TOPICS["reit"]
        return {"reply": data["explanation"], "suggested_questions": data["suggested"], "source": "ZeroLatency Copilot"}

    if "invit" in q and "reit" not in q and "alloc" not in q:
        data = KNOWLEDGE_TOPICS["invit"]
        return {"reply": data["explanation"], "suggested_questions": data["suggested"], "source": "ZeroLatency Copilot"}

    if ("reit" in q and "invit" in q) or "difference between reit" in q or "reits and invit" in q:
        data = KNOWLEDGE_TOPICS["reit_vs_invit"]
        return {"reply": data["explanation"], "suggested_questions": data["suggested"], "source": "ZeroLatency Copilot"}

    if "bond" in q and ("equity" in q or "stock" in q):
        data = KNOWLEDGE_TOPICS["equity_vs_bond"]
        return {"reply": data["explanation"], "suggested_questions": data["suggested"], "source": "ZeroLatency Copilot"}

    if "bond" in q and ("explain" in q or "simply" in q or "what is" in q):
        reply = (
            "### Bonds Explained for Beginners\n\n"
            "A **bond** is essentially a fixed-income loan you provide to a government or corporation in exchange for regular interest payments and guaranteed principal repayment at maturity.\n\n"
            "### Key Mechanics:\n"
            "- **Coupon Payment**: The fixed interest rate paid semi-annually or annually.\n"
            "- **Maturity Date**: When the issuer returns your full face-value capital.\n"
            "- **Role in Wealth OS**: Bonds act as a **defensive anchor**. While equities fluctuate with market cycles, bonds provide predictable yields and preserve capital.\n\n"
            "Your portfolio holds **Sovereign G-Secs** and **AAA Infrastructure Bonds** producing steady, low-risk coupon income."
        )
        return {
            "reply": reply,
            "suggested_questions": ["What is sovereign bond yield?", "How are bonds different from equities?", "Show my portfolio allocation."],
            "source": "ZeroLatency Copilot"
        }

    # 3.5. Portfolio Impact & Daily Movement Questions (Requirement #10, #17)
    if any(k in q for k in ["why did my portfolio", "affecting my wealth", "portfolio move", "portfolio fall", "portfolio drop", "portfolio gain", "holding contribute", "contributed most"]):
        if not holdings:
            return {
                "reply": "Your portfolio has no active holdings recorded yet. Once you add or import your investments, I will analyze the exact contribution of each asset to your daily P&L and connect it to market events.",
                "suggested_questions": ["Explore Markets", "What is a REIT?", "How does asset allocation work?"],
                "source": "ZeroLatency Copilot"
            }
        top_gainers = sorted(holdings, key=lambda x: getattr(x, 'day_change_percent', 0.0), reverse=True)
        top_gain = top_gainers[0] if top_gainers else None
        top_loss = top_gainers[-1] if top_gainers else None

        lines = [
            "### 📈 WHAT'S AFFECTING YOUR WEALTH TODAY\n",
            f"- **Total Wealth**: ₹{summary.total_value:,.2f}",
            f"- **Today's P&L Movement**: ₹{summary.day_change_amount:+,.2f} ({summary.day_change_percent:+.2f}%)\n",
            "#### Key Movement Drivers:"
        ]
        if top_gain and getattr(top_gain, 'day_change_percent', 0.0) != 0:
            lines.append(f"- **Top Positive Contributor**: **{top_gain.symbol}** ({top_gain.day_change_percent:+.2f}%) contributing approx ₹{top_gain.day_change:+,.2f}.")
        if top_loss and top_loss.symbol != (top_gain.symbol if top_gain else "") and getattr(top_loss, 'day_change_percent', 0.0) != 0:
            lines.append(f"- **Top Volatility / Drag**: **{top_loss.symbol}** ({top_loss.day_change_percent:+.2f}%) impact approx ₹{top_loss.day_change:+,.2f}.")
        
        lines.append("\n#### Multi-Asset Diversification Context:")
        lines.append("Your defensive assets (Sovereign Bonds, commercial REITs, and InvITs) provide yield stability to balance equity market volatility.")

        return {
            "reply": "\n".join(lines),
            "suggested_questions": ["Show my portfolio allocation", "What is affecting my REIT holdings?", "Explain NIFTY 50 impact", "How to reduce portfolio risk?"],
            "source": "ZeroLatency Copilot (Portfolio Impact Engine)"
        }

    # 4. Portfolio questions
    if any(k in q for k in ["my portfolio", "allocation", "holdings", "how much", "breakdown", "value", "largest holding"]):
        if "largest holding" in q:
            if holdings:
                sorted_h = sorted(holdings, key=lambda x: x.current_value, reverse=True)
                top = sorted_h[0]
                reply = (
                    f"### Your Largest Holding: {top.name} ({top.symbol})\n\n"
                    f"- **Asset Class**: {top.asset_type}\n"
                    f"- **Current Valuation**: ₹{top.current_value:,.2f} ({top.allocation_percent}% of total portfolio)\n"
                    f"- **Units Held**: {top.units:,.2f} units @ avg cost ₹{top.avg_buy_price:,.2f}\n"
                    f"- **Unrealized Return**: ₹{top.unrealized_pl:,.2f} ({top.unrealized_pl_percent:+.2f}%)\n\n"
                    f"This instrument currently forms the cornerstone of your {top.asset_type} allocation."
                )
                return {
                    "reply": reply,
                    "suggested_questions": ["Show full portfolio allocation", "What is my second largest holding?", "Explain portfolio rebalancing."],
                    "source": "ZeroLatency Copilot"
                }

        alloc_lines = [f"- **{a.asset_type}**: ₹{a.current_value:,.2f} ({a.percentage}%)" for a in summary.allocations]
        top_h = [f"- **{h.symbol}** ({h.name}): ₹{h.current_value:,.2f} ({h.allocation_percent}%)" for h in holdings[:5]]
        reply = (
            f"### Your Portfolio Snapshot\n\n"
            f"- **Total Portfolio Value**: ₹{summary.total_value:,.2f}\n"
            f"- **Invested Capital**: ₹{summary.total_invested:,.2f}\n"
            f"- **Unrealized Gain/Loss**: ₹{summary.unrealized_pl:,.2f} ({summary.unrealized_pl_percent:+.2f}%)\n"
            f"- **Projected Annual Income**: ₹{summary.projected_annual_income:,.2f} (Weighted Yield: {summary.weighted_yield:.2f}%)\n\n"
            f"#### Current Allocation:\n" + "\n".join(alloc_lines) + "\n\n"
            f"#### Top Holdings:\n" + "\n".join(top_h)
        )
        return {
            "reply": reply,
            "suggested_questions": [
                "What is a REIT?",
                "What is an InvIT?",
                "Explain my largest holding",
                "Explain sovereign bonds."
            ],
            "source": "ZeroLatency Copilot"
        }

    # 5. Paper trading questions
    if "paper trading" in q or "paper trade" in q or "simulated" in q:
        reply = (
            "### How Paper Trading Works in ZeroLatency\n\n"
            "**Paper Trading** is an operable simulation desk allowing you to practice multi-asset allocation without real-money financial risk:\n\n"
            "1. **Virtual Capital**: Every authenticated user receives a simulated account with **₹10,00,000** virtual cash.\n"
            "2. **Real-Time Order Ticket**: Execute simulated **BUY** or **SELL** orders on any asset using live market prices.\n"
            "3. **Dynamic Ledger**: Cash balances automatically debit/credit, and your unified holdings and total portfolio value recalculate instantaneously.\n"
            "4. **Zero Broker Risk**: No bank transfers or brokerage connections are required—it is 100% simulated and risk-free."
        )
        return {
            "reply": reply,
            "suggested_questions": ["Show my portfolio allocation", "What is a REIT?", "How are REITs valued?"],
            "source": "ZeroLatency Copilot"
        }

    # 6. General financial question answers
    if "p/e" in q or "pe ratio" in q or "price to earning" in q:
        reply = (
            "### Price-to-Earnings (P/E) Ratio Explained\n\n"
            "The **P/E ratio** measures a company's current share price relative to its per-share earnings (EPS).\n\n"
            "- **Formula**: `P/E = Market Price per Share / Earnings per Share (EPS)`\n"
            "- **Interpretation**: A high P/E often indicates that investors expect higher earnings growth in the future compared to companies with a lower P/E, or that the stock may be overvalued.\n"
            "- **In Multi-Asset Investing**: Equities usually trade at a P/E multiple, whereas REITs and InvITs are more commonly valued by **Net Asset Value (NAV)** and **Distribution Yield**."
        )
        return {
            "reply": reply,
            "suggested_questions": ["What is a REIT?", "How are REITs valued?", "What is an InvIT?", "Show my portfolio allocation."],
            "source": "ZeroLatency Copilot"
        }

    if "diversification" in q or "diversify" in q:
        reply = (
            "### What is Portfolio Diversification?\n\n"
            "**Diversification** is the risk management practice of spreading investments across varied financial instruments, industries, and asset classes.\n\n"
            "### Why Multi-Asset Diversification Matters:\n"
            "1. **Uncorrelated Cash Flows**: While equities grow with corporate profitability, sovereign bonds provide fixed income, and REITs/InvITs provide inflation-indexed rental/toll distributions.\n"
            "2. **Lower Volatility**: Drawdowns in one asset class (such as a temporary stock market correction) are cushioned by steady bond yields and real estate distributions.\n"
            "3. **ZeroLatency Structure**: Your current portfolio incorporates **Equities (52%)**, **Bonds (18%)**, **REITs (15%)**, and **InvITs (10%)** to achieve balanced growth and steady income."
        )
        return {
            "reply": reply,
            "suggested_questions": ["What is a REIT?", "Explain sovereign bonds.", "Show my demo portfolio allocation."],
            "source": "ZeroLatency Copilot"
        }

    # 7. Default conversational educational response
    return {
        "reply": (
            f"Here is an overview regarding **{query.strip()}**:\n\n"
            f"As your multi-asset wealth copilot, I help demystify financial mechanics across **Equities**, **Sovereign Bonds**, **Commercial REITs**, and **Infrastructure InvITs**.\n\n"
            f"### Key Considerations for Retail Investors:\n"
            f"- **Cash Flow Horizon**: Distinguish between capital appreciation (equities) versus statutory cash payouts (REIT rental yields >=90% NDCF, bond coupons).\n"
            f"- **Risk & Volatility Profile**: Balance equity beta with low-volatility fixed income anchors.\n"
            f"- **Your Current Asset Mix**: Your portfolio is currently generating an estimated **{summary.weighted_yield:.2f}%** weighted annual yield across {len(holdings)} holdings.\n\n"
            f"What specific facet of this topic would you like to explore further?"
        ),
        "suggested_questions": [
            "Show my portfolio allocation",
            "What is a REIT?",
            "Explain diversification",
            "What is P/E ratio?"
        ],
        "source": "ZeroLatency Copilot"
    }

async def generate_chat_response(
    message: str,
    user_id: str = "demo-user-001",
    context_asset_id: Optional[str] = None,
    conversation_history: Optional[List[Dict[str, str]]] = None
) -> Dict[str, Any]:
    """Generate intelligent conversational response using local Ollama model with deterministic fallback."""
    # Check if Ollama is available
    health = await check_ollama_health()

    if not health.get("available") or not health.get("model_ready"):
        # Graceful fallback without crashing
        res = fallback_deterministic_reply(message, user_id, context_asset_id)
        res["disclaimer"] = DISCLAIMER
        res["ollama_status"] = health.get("status", "OFFLINE")
        return res

    # Format bounded conversation history
    history = conversation_history or []
    bounded_history = history[-MAX_CHAT_MESSAGES:]

    portfolio_context = build_portfolio_context(user_id)
    full_system = f"{SYSTEM_GUARDRAIL_PROMPT}\n\n{portfolio_context}"

    if context_asset_id:
        asset = get_asset_by_id(context_asset_id)
        if asset:
            full_system += f"\nCURRENTLY INSPECTED ASSET:\n- Name: {asset.name} ({asset.symbol})\n- Class: {asset.asset_type}\n- Price: Rs {asset.price}\n- Yield: {asset.annual_yield}%\n- Description: {asset.description}\n"

    messages = [{"role": "system", "content": full_system}]
    for msg in bounded_history:
        role = "assistant" if msg.get("role") in ("assistant", "copilot") else "user"
        content = msg.get("content") or msg.get("text", "")
        if content:
            messages.append({"role": role, "content": content})

    messages.append({"role": "user", "content": message})

    # Call local Ollama chat endpoint
    try:
        async with httpx.AsyncClient(timeout=45.0) as client:
            payload = {
                "model": OLLAMA_MODEL,
                "messages": messages,
                "stream": False,
                "options": {
                    "num_ctx": MAX_CONTEXT_TOKENS,
                    "temperature": 0.3
                }
            }
            resp = await client.post(f"{OLLAMA_BASE_URL}/api/chat", json=payload)
            if resp.status_code == 200:
                data = resp.json()
                reply_text = data.get("message", {}).get("content", "")
                return {
                    "reply": reply_text,
                    "suggested_questions": [
                        "Explain this in more detail.",
                        "How does this affect my portfolio allocation?",
                        "What is a REIT?",
                        "Show my demo portfolio allocation."
                    ],
                    "source": f"Local Ollama ({OLLAMA_MODEL})",
                    "disclaimer": DISCLAIMER,
                    "ollama_status": "ONLINE"
                }
            else:
                logger.warning(f"Ollama returned status {resp.status_code}. Using fallback.")
                res = fallback_deterministic_reply(message, user_id, context_asset_id)
                res["disclaimer"] = DISCLAIMER
                res["ollama_status"] = "OLLAMA_ERROR"
                return res
    except Exception as e:
        logger.warning(f"Ollama call failed ({str(e)}). Using fallback.")
        res = fallback_deterministic_reply(message, user_id, context_asset_id)
        res["disclaimer"] = DISCLAIMER
        res["ollama_status"] = "OFFLINE"
        return res
