import os
from backend.market_data.provider import MarketDataProvider
from backend.market_data.providers.real_market_provider import RealMarketDataProvider
from backend.market_data.providers.angel_one import AngelOneSmartAPIProvider

_provider_instance = None

def get_market_data_provider() -> MarketDataProvider:
    """Return configured MarketDataProvider singleton."""
    global _provider_instance
    if _provider_instance is None:
        provider_type = os.getenv("MARKET_DATA_PROVIDER", "real").lower()
        if provider_type == "angel_one" or provider_type == "smartapi":
            _provider_instance = AngelOneSmartAPIProvider()
        else:
            _provider_instance = RealMarketDataProvider()
    return _provider_instance
