import asyncio
import logging
from backend.market_data import get_market_data_provider
from backend.market_data.websocket_manager import ws_manager

logger = logging.getLogger("zerolatency.streamer")

class MarketStreamerWorker:
    """Background worker that streams live ticks to WebSocket subscribers."""
    def __init__(self):
        self._running = False
        self._task = None
        # Default core symbols to stream continuously for tickers and watchlists
        self.monitored_symbols = [
            "NIFTY", "SENSEX", "BANKNIFTY", "NIFTYIT", "GOLD", "SILVER", "USDINR",
            "RELIANCE", "TCS", "HDFCBANK", "INFY", "ICICIBANK", "SBIN", "BHARTIARTL",
            "ITC", "LT", "TATAMOTORS", "TITAN", "BAJFINANCE", "EMBASSY", "MINDSPACE", "PGINVIT"
        ]

    async def start(self):
        if self._running:
            return
        self._running = True
        self._task = asyncio.create_task(self._run_loop())
        logger.info("MarketStreamerWorker background task started.")

    async def stop(self):
        self._running = False
        if self._task:
            self._task.cancel()
            try:
                await self._task
            except asyncio.CancelledError:
                pass
        logger.info("MarketStreamerWorker background task stopped.")

    async def _run_loop(self):
        provider = get_market_data_provider()
        while self._running:
            try:
                # Only poll if there are active WebSocket connections
                if ws_manager.active_connections:
                    # Gather all requested symbols across connected clients
                    active_symbols = set(self.monitored_symbols)
                    for symbols_set in ws_manager.active_connections.values():
                        for s in symbols_set:
                            if s != "ALL":
                                active_symbols.add(s)

                    # Batch fetch quotes
                    quotes = await provider.get_quotes(list(active_symbols)[:25])
                    for q in quotes:
                        await ws_manager.broadcast_tick(q.model_dump())

                await asyncio.sleep(2.5) # Non-aggressive polling to preserve provider rate limits
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error("Error in MarketStreamerWorker loop: %s", e)
                await asyncio.sleep(5)

market_streamer = MarketStreamerWorker()
