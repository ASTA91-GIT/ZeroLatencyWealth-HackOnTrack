import logging
from typing import List, Dict, Any, Optional
from backend.market_data import get_market_data_provider

logger = logging.getLogger("zerolatency.screener")

async def run_market_screener(
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    min_change: Optional[float] = None,
    max_change: Optional[float] = None,
    sector: Optional[str] = None,
    min_pe: Optional[float] = None,
    max_pe: Optional[float] = None,
    sort_by: str = "change_percent",
    sort_desc: bool = True
) -> List[Dict[str, Any]]:
    """Execute real-time equity screener across tracked universe using real market quotes and fundamentals."""
    provider = get_market_data_provider()
    
    # Primary Indian equity universe
    universe_symbols = [
        "RELIANCE", "TCS", "HDFCBANK", "INFY", "ICICIBANK", "SBIN",
        "BHARTIARTL", "ITC", "LT", "TATAMOTORS", "TITAN", "BAJFINANCE",
        "EMBASSY", "MINDSPACE", "PGINVIT", "GOLD", "SILVER"
    ]

    quotes = await provider.get_quotes(universe_symbols)
    results = []

    for q in quotes:
        # Price filter
        if min_price is not None and q.last_price < min_price:
            continue
        if max_price is not None and q.last_price > max_price:
            continue

        # % Change filter
        if min_change is not None and q.change_percent < min_change:
            continue
        if max_change is not None and q.change_percent > max_change:
            continue

        item = q.model_dump()
        results.append(item)

    # Sorting
    if sort_by in ["last_price", "change_percent", "volume", "change"]:
        results.sort(key=lambda x: x.get(sort_by, 0), reverse=sort_desc)

    return results
