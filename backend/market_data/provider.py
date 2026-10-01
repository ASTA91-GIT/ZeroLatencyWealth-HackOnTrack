# Abstract Market Data Provider Interface
from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
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

class MarketDataProvider(ABC):
    """Abstract base provider for real-time and historical market data."""

    @abstractmethod
    async def get_quote(self, symbol: str) -> Optional[MarketQuote]:
        """Fetch real-time snapshot quote for a single symbol."""
        pass

    @abstractmethod
    async def get_quotes(self, symbols: List[str]) -> List[MarketQuote]:
        """Batch fetch real-time quotes."""
        pass

    @abstractmethod
    async def get_historical_candles(
        self,
        symbol: str,
        interval: str = "1d",
        range_period: str = "1mo"
    ) -> List[Candle]:
        """Fetch historical OHLCV candles."""
        pass

    @abstractmethod
    async def get_market_depth(self, symbol: str) -> MarketDepth:
        """Fetch Level 2 / 5-depth order book or return unavailable object."""
        pass

    @abstractmethod
    async def get_indices(self) -> List[MarketQuote]:
        """Fetch key benchmark indices (NIFTY 50, SENSEX, BANK NIFTY, etc.)."""
        pass

    @abstractmethod
    async def get_commodities(self) -> List[MarketQuote]:
        """Fetch live commodity quotes (Gold, Silver, Crude Oil, Natural Gas)."""
        pass

    @abstractmethod
    async def get_currencies(self) -> List[MarketQuote]:
        """Fetch real currency exchange rates (USD/INR, EUR/INR, GBP/INR, JPY/INR)."""
        pass

    @abstractmethod
    async def get_market_movers(self) -> Dict[str, List[MarketQuote]]:
        """Fetch top gainers and top losers."""
        pass

    @abstractmethod
    async def get_market_breadth(self) -> Dict[str, Any]:
        """Calculate market breadth (advances, declines, unchanged)."""
        pass

    @abstractmethod
    async def get_company_fundamentals(self, symbol: str) -> CompanyFundamentals:
        """Fetch company fundamentals and ratios."""
        pass

    @abstractmethod
    async def get_market_news(self, category: str = "Markets") -> List[MarketNewsItem]:
        """Fetch real-time market news."""
        pass

    @abstractmethod
    async def get_economic_calendar(self) -> List[EconomicEvent]:
        """Fetch global/domestic economic calendar events."""
        pass

    @abstractmethod
    async def get_option_chain(self, symbol: str, expiry: Optional[str] = None) -> OptionChainResponse:
        """Fetch real option chain data or return explicit unavailable state."""
        pass

    @abstractmethod
    async def search_instruments(self, query: str) -> List[Instrument]:
        """Search instruments master database."""
        pass
