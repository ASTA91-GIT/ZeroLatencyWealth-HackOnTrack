import os
import re
import json
import logging
from typing import List, Dict, Any, Optional
import httpx

from backend.services.portfolio_service import get_user_portfolio_summary, get_user_holdings, get_asset_by_id
from backend.services.copilot_service import KNOWLEDGE_TOPICS, DISCLAIMER

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
    """High-quality deterministic fallback engine when Ollama local LLM is offline or model is not pulled."""
    q = query.lower().strip()
    summary = get_user_portfolio_summary(user_id)
    holdings = get_user_holdings(user_id)

    # 1. Check for specific asset context
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
                f"**Description & Role in Wealth OS**:\n{asset.description or 'A core component of multi-asset allocation.'}\n\n"
                f"*Note: Running via ZeroLatency Knowledge Engine while local Ollama model is offline.*"
            )
            return {
                "reply": reply,
                "suggested_questions": [
                    f"Explain {asset.asset_type} as an asset class.",
                    "How does this asset generate cash flow?",
                    "Show my portfolio allocation.",
                    "What is a REIT?"
                ],
                "source": "ZeroLatency Knowledge Engine (Local AI Offline)"
            }

    # 2. Knowledge Topics matches
    if "reit" in q and "invit" not in q and "alloc" not in q:
        data = KNOWLEDGE_TOPICS["reit"]
        return {"reply": data["explanation"], "suggested_questions": data["suggested"], "source": "ZeroLatency Knowledge Engine"}

    if "invit" in q and "reit" not in q and "alloc" not in q:
        data = KNOWLEDGE_TOPICS["invit"]
        return {"reply": data["explanation"], "suggested_questions": data["suggested"], "source": "ZeroLatency Knowledge Engine"}

    if ("reit" in q and "invit" in q) or "difference between reit" in q:
        data = KNOWLEDGE_TOPICS["reit_vs_invit"]
        return {"reply": data["explanation"], "suggested_questions": data["suggested"], "source": "ZeroLatency Knowledge Engine"}

    if "bond" in q and ("equity" in q or "stock" in q):
        data = KNOWLEDGE_TOPICS["equity_vs_bond"]
        return {"reply": data["explanation"], "suggested_questions": data["suggested"], "source": "ZeroLatency Knowledge Engine"}

    # 3. Portfolio questions
    if any(k in q for k in ["my portfolio", "allocation", "holdings", "how much", "breakdown", "value"]):
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
                "How can I rebalance my portfolio?",
                "Explain sovereign bonds."
            ],
            "source": "ZeroLatency Knowledge Engine (Portfolio Aware)"
        }

    # 4. General financial question answers
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
            "source": "ZeroLatency Knowledge Engine"
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
            "source": "ZeroLatency Knowledge Engine"
        }

    # 5. Default conversational fallback
    return {
        "reply": (
            f"I understand your query: *\"{query}\"*. \n\n"
            f"I am operating on the **ZeroLatency Knowledge Engine** while the local Ollama instance ({OLLAMA_MODEL}) is starting up or offline.\n\n"
            f"I can help explain:\n"
            f"- **Asset Classes**: Equities, Sovereign Government Bonds, Commercial REITs, and Infrastructure InvITs.\n"
            f"- **Portfolio Metrics**: Allocation percentages, weighted yield ({summary.weighted_yield:.2f}%), annual cash flow.\n"
            f"- **Valuation & Fundamentals**: P/E ratios, NAV, coupon yields, and distribution rules."
        ),
        "suggested_questions": [
            "What is a REIT?",
            "Explain InvITs simply.",
            "What is diversification?",
            "Show my demo portfolio allocation."
        ],
        "source": "ZeroLatency Knowledge Engine (Ollama Offline)"
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
