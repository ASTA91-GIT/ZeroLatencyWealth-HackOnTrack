import os
import time
import logging
from typing import Any, Optional, Dict

logger = logging.getLogger("zerolatency.cache")

class MarketDataCache:
    """Thread-safe in-memory cache with TTL expiry and optional Redis integration."""
    def __init__(self):
        self._store: Dict[str, Dict[str, Any]] = {}
        self.redis_client = None
        redis_url = os.getenv("REDIS_URL")
        if redis_url:
            try:
                import redis
                self.redis_client = redis.from_url(redis_url)
                logger.info("Connected to Redis cache: %s", redis_url)
            except Exception as e:
                logger.warning("Redis connection failed, using in-memory cache: %s", e)

    def get(self, key: str) -> Optional[Any]:
        if self.redis_client:
            try:
                import json
                val = self.redis_client.get(key)
                if val:
                    return json.loads(val)
            except Exception:
                pass

        entry = self._store.get(key)
        if not entry:
            return None
        if time.time() > entry["expires_at"]:
            del self._store[key]
            return None
        return entry["value"]

    def set(self, key: str, value: Any, ttl_seconds: int = 10) -> None:
        if self.redis_client:
            try:
                import json
                self.redis_client.setex(key, ttl_seconds, json.dumps(value, default=str))
            except Exception:
                pass

        self._store[key] = {
            "value": value,
            "expires_at": time.time() + ttl_seconds
        }

    def delete(self, key: str) -> None:
        if self.redis_client:
            try:
                self.redis_client.delete(key)
            except Exception:
                pass
        self._store.pop(key, None)

    def clear(self) -> None:
        if self.redis_client:
            try:
                self.redis_client.flushdb()
            except Exception:
                pass
        self._store.clear()

cache = MarketDataCache()
market_cache = cache
