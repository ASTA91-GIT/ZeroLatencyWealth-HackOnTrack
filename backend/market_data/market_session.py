# Real Market Session & Exchange Hours Engine
from typing import Dict, Any
from datetime import datetime, time
import pytz

IST = pytz.timezone("Asia/Kolkata")

def get_market_session_status(exchange: str = "NSE") -> Dict[str, Any]:
    """Calculate exact real-time exchange session status based on IST clock."""
    now_ist = datetime.now(IST)
    current_time = now_ist.time()
    weekday = now_ist.weekday() # 0 = Monday, 6 = Sunday

    # Weekends (Saturday=5, Sunday=6)
    if weekday in (5, 6):
        return {
            "status": "CLOSED",
            "reason": "Weekend (Markets closed)",
            "timestamp": now_ist.isoformat(),
            "next_open": "Monday 09:15 AM IST",
            "is_open": False
        }

    # Pre-market: 09:00 - 09:15
    if time(9, 0) <= current_time < time(9, 15):
        return {
            "status": "PRE-MARKET",
            "reason": "Pre-market order matching session",
            "timestamp": now_ist.isoformat(),
            "next_open": "Today 09:15 AM IST",
            "is_open": False
        }

    # Regular Trading Hours: 09:15 - 15:30
    if time(9, 15) <= current_time <= time(15, 30):
        return {
            "status": "OPEN",
            "reason": "Live Trading Session",
            "timestamp": now_ist.isoformat(),
            "next_open": None,
            "is_open": True
        }

    # Post-market: 15:40 - 16:00
    if time(15, 40) <= current_time <= time(16, 0):
        return {
            "status": "POST-MARKET",
            "reason": "Post-market closing session",
            "timestamp": now_ist.isoformat(),
            "next_open": "Next trading day 09:15 AM IST",
            "is_open": False
        }

    # Outside market hours
    return {
        "status": "CLOSED",
        "reason": "Outside exchange trading hours",
        "timestamp": now_ist.isoformat(),
        "next_open": "09:15 AM IST",
        "is_open": False
    }
