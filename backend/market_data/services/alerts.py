import time
import logging
from typing import List, Dict, Any, Optional
from pydantic import BaseModel

logger = logging.getLogger("zerolatency.alerts")

class PriceAlert(BaseModel):
    id: str
    user_id: str
    symbol: str
    target_price: float
    condition: str # "ABOVE", "BELOW", "PCT_MOVE_UP", "PCT_MOVE_DOWN"
    triggered: bool = False
    triggered_at: Optional[str] = None
    created_at: str

# In-memory alert store with persistence interface
_alerts: Dict[str, PriceAlert] = {}
_last_triggered: Dict[str, float] = {}

def create_alert(user_id: str, symbol: str, target_price: float, condition: str = "ABOVE") -> PriceAlert:
    alert_id = f"alert-{int(time.time()*1000)}"
    alert = PriceAlert(
        id=alert_id,
        user_id=user_id,
        symbol=symbol.upper(),
        target_price=target_price,
        condition=condition.upper(),
        triggered=False,
        created_at=time.strftime("%Y-%m-%d %H:%M:%S")
    )
    _alerts[alert_id] = alert
    return alert

def get_user_alerts(user_id: str) -> List[PriceAlert]:
    return [a for a in _alerts.values() if a.user_id == user_id]

def delete_alert(alert_id: str, user_id: str) -> bool:
    if alert_id in _alerts and _alerts[alert_id].user_id == user_id:
        del _alerts[alert_id]
        return True
    return False

def evaluate_alerts(symbol: str, current_price: float) -> List[Dict[str, Any]]:
    """Evaluate alerts against real current price with cooldown suppression."""
    triggered_events = []
    now = time.time()

    for alert in list(_alerts.values()):
        if alert.symbol == symbol and not alert.triggered:
            # Check cooldown (30 seconds)
            if now - _last_triggered.get(alert.id, 0) < 30:
                continue

            is_match = False
            if alert.condition == "ABOVE" and current_price >= alert.target_price:
                is_match = True
            elif alert.condition == "BELOW" and current_price <= alert.target_price:
                is_match = True

            if is_match:
                alert.triggered = True
                alert.triggered_at = time.strftime("%Y-%m-%d %H:%M:%S")
                _last_triggered[alert.id] = now
                triggered_events.append({
                    "alert_id": alert.id,
                    "user_id": alert.user_id,
                    "symbol": alert.symbol,
                    "condition": alert.condition,
                    "target_price": alert.target_price,
                    "current_price": current_price,
                    "message": f"Alert triggered: {alert.symbol} is {alert.condition} ₹{alert.target_price:,.2f} (Current: ₹{current_price:,.2f})"
                })

    return triggered_events
