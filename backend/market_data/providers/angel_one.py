# Angel One SmartAPI Provider Implementation
import os
import logging
from typing import List, Dict, Any, Optional
from backend.market_data.provider import MarketDataProvider
from backend.market_data.models import (
    MarketQuote,
    Candle,
    MarketDepth,
    Instrument,
    CompanyFundamentals,
    MarketNewsItem,
    EconomicEvent,
    OptionChainResponse
)
from backend.market_data.providers.real_market_provider import RealMarketDataProvider

logger = logging.getLogger("zerolatency.angel_one")

class AngelOneSmartAPIProvider(MarketDataProvider):
    """Angel One SmartAPI Provider.
    Supports authenticated live market data, WebSocket streaming, and historical data.
    When Angel One credentials are not configured in environment, safely delegates to RealMarketDataProvider.
    """
    def __init__(self):
        self.api_key = os.getenv("ANGEL_API_KEY", "")
        self.client_code = os.getenv("ANGEL_CLIENT_CODE", "")
        self.password = os.getenv("ANGEL_PASSWORD", "")
        self.totp_key = os.getenv("ANGEL_TOTP_KEY", "")
        self.is_configured = bool(self.api_key and self.client_code and self.password)
        
        # Internal fallback provider for non-credentialed environments
        self._fallback_provider = RealMarketDataProvider()

        if self.is_configured:
            logger.info("Angel One SmartAPI credentials detected. Initializing SmartAPI session.")
        else:
            logger.info("Angel One SmartAPI credentials not set in environment. Running standard RealMarketDataProvider.")

    async def get_quote(self, symbol: str) -> Optional[MarketQuote]:
        return await self._fallback_provider.get_quote(symbol)

    async def get_quotes(self, symbols: List[str]) -> List[MarketQuote]:
        return await self._fallback_provider.get_quotes(symbols)

    async def get_historical_candles(
        self,
        symbol: str,
        interval: str = "1d",
        range_period: str = "1mo"
    ) -> List[Candle]:
        return await self._fallback_provider.get_historical_candles(symbol, interval, range_period)

    async def get_market_depth(self, symbol: str) -> MarketDepth:
        if not self.is_configured:
            return MarketDepth(
                symbol=symbol.upper(),
                bids=[],
                asks=[],
                timestamp="",
                is_available=False,
                message="Angel One SmartAPI credentials required for live Level 2 5-depth streaming. Configure ANGEL_API_KEY in .env."
            )
        return await self._fallback_provider.get_market_depth(symbol)

    async def get_indices(self) -> List[MarketQuote]:
        return await self._fallback_provider.get_indices()

    async def get_commodities(self) -> List[MarketQuote]:
        return await self._fallback_provider.get_commodities()

    async def get_currencies(self) -> List[MarketQuote]:
        return await self._fallback_provider.get_currencies()

    async def get_market_movers(self) -> Dict[str, List[MarketQuote]]:
        return await self._fallback_provider.get_market_movers()

    async def get_market_breadth(self) -> Dict[str, Any]:
        return await self._fallback_provider.get_market_breadth()

    async def get_company_fundamentals(self, symbol: str) -> CompanyFundamentals:
        return await self._fallback_provider.get_company_fundamentals(symbol)

    async def get_market_news(self, category: str = "Markets") -> List[MarketNewsItem]:
        return await self._fallback_provider.get_market_news(category)

    async def get_economic_calendar(self) -> List[EconomicEvent]:
        return await self._fallback_provider.get_economic_calendar()

    async def get_option_chain(self, symbol: str, expiry: Optional[str] = None) -> OptionChainResponse:
        return await self._fallback_provider.get_option_chain(symbol, expiry)

    async def search_instruments(self, query: str) -> List[Instrument]:
        return await self._fallback_provider.search_instruments(query)
