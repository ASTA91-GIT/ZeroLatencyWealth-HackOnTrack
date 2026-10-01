import asyncio
import json
import logging
from typing import Dict, Set, Any, Optional
from datetime import datetime, timezone
from fastapi import WebSocket, WebSocketDisconnect

logger = logging.getLogger("zerolatency.ws")

class MarketWebSocketManager:
    """Centralized WebSocket streaming manager for real-time market data ticks and order events."""

    def __init__(self):
        # Client connections mapped to their active symbol subscriptions
        self.active_connections: Dict[WebSocket, Set[str]] = {}
        # Background streaming task
        self._broadcast_task: Optional[asyncio.Task] = None
        self._is_running = False

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[websocket] = set()
        logger.info("Market WebSocket client connected. Total clients: %d", len(self.active_connections))
        
        # Send initial connection handshake
        await websocket.send_json({
            "type": "CONNECTION_STATUS",
            "status": "CONNECTED",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "message": "Connected to ZeroLatency Real-Time Market Feed"
        })

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            del self.active_connections[websocket]
            logger.info("Market WebSocket client disconnected. Remaining clients: %d", len(self.active_connections))

    def subscribe(self, websocket: WebSocket, symbols: list[str]):
        if websocket in self.active_connections:
            for s in symbols:
                self.active_connections[websocket].add(s.upper())

    def unsubscribe(self, websocket: WebSocket, symbols: list[str]):
        if websocket in self.active_connections:
            for s in symbols:
                self.active_connections[websocket].discard(s.upper())

    async def broadcast_tick(self, quote_data: Dict[str, Any]):
        """Broadcast live price tick to clients subscribed to this symbol."""
        symbol = quote_data.get("symbol", "").upper()
        disconnected_clients = []

        payload = {
            "type": "TICK",
            "symbol": symbol,
            "data": quote_data,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

        for client, subscribed_symbols in self.active_connections.items():
            # If client subscribed to this symbol or subscribed to ALL
            if not subscribed_symbols or symbol in subscribed_symbols or "ALL" in subscribed_symbols:
                try:
                    await client.send_json(payload)
                except Exception:
                    disconnected_clients.append(client)

        for dc in disconnected_clients:
            self.disconnect(dc)

    async def broadcast_system_event(self, event_type: str, data: Dict[str, Any]):
        """Broadcast general market system events (e.g. market open/close, heartbeat)."""
        payload = {
            "type": event_type,
            "data": data,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        disconnected = []
        for client in self.active_connections.keys():
            try:
                await client.send_json(payload)
            except Exception:
                disconnected.append(client)
        for dc in disconnected:
            self.disconnect(dc)

ws_manager = MarketWebSocketManager()
