# Technical Indicator Engine for Real Market Candles
from typing import List, Dict, Any, Optional
import math
from backend.market_data.models import Candle

def calculate_sma(candles: List[Candle], period: int = 20) -> List[Dict[str, Any]]:
    """Simple Moving Average (SMA)."""
    if len(candles) < period:
        return []
    results = []
    for i in range(period - 1, len(candles)):
        slice_c = candles[i - period + 1 : i + 1]
        avg = sum(c.close for c in slice_c) / period
        results.append({"time": candles[i].time, "value": round(avg, 2)})
    return results

def calculate_ema(candles: List[Candle], period: int = 20) -> List[Dict[str, Any]]:
    """Exponential Moving Average (EMA)."""
    if len(candles) < period:
        return []
    k = 2 / (period + 1)
    # Start with SMA of first 'period' candles
    current_ema = sum(c.close for c in candles[:period]) / period
    results = [{"time": candles[period - 1].time, "value": round(current_ema, 2)}]

    for i in range(period, len(candles)):
        current_ema = (candles[i].close * k) + (current_ema * (1 - k))
        results.append({"time": candles[i].time, "value": round(current_ema, 2)})
    return results

def calculate_rsi(candles: List[Candle], period: int = 14) -> List[Dict[str, Any]]:
    """Relative Strength Index (RSI)."""
    if len(candles) < period + 1:
        return []

    changes = [candles[i].close - candles[i - 1].close for i in range(1, len(candles))]
    gains = [max(0.0, c) for c in changes]
    losses = [max(0.0, -c) for c in changes]

    avg_gain = sum(gains[:period]) / period
    avg_loss = sum(losses[:period]) / period

    results = []
    if avg_loss == 0:
        rs = 100.0
    else:
        rs = avg_gain / avg_loss
    rsi = 100.0 - (100.0 / (1.0 + rs))
    results.append({"time": candles[period].time, "value": round(rsi, 2)})

    for i in range(period + 1, len(candles)):
        gain = gains[i - 1]
        loss = losses[i - 1]
        avg_gain = (avg_gain * (period - 1) + gain) / period
        avg_loss = (avg_loss * (period - 1) + loss) / period

        if avg_loss == 0:
            rsi = 100.0
        else:
            rs = avg_gain / avg_loss
            rsi = 100.0 - (100.0 / (1.0 + rs))
        results.append({"time": candles[i].time, "value": round(rsi, 2)})

    return results

def calculate_macd(
    candles: List[Candle],
    fast_period: int = 12,
    slow_period: int = 26,
    signal_period: int = 9
) -> List[Dict[str, Any]]:
    """Moving Average Convergence Divergence (MACD)."""
    if len(candles) < slow_period + signal_period:
        return []

    ema_fast = calculate_ema(candles, fast_period)
    ema_slow = calculate_ema(candles, slow_period)

    # Map by time
    slow_map = {e["time"]: e["value"] for e in ema_slow}
    macd_line = []
    for f in ema_fast:
        t = f["time"]
        if t in slow_map:
            val = f["value"] - slow_map[t]
            macd_line.append({"time": t, "close": val})

    # Fake candle objects for signal EMA calculation
    signal_candles = [Candle(time=m["time"], open=m["close"], high=m["close"], low=m["close"], close=m["close"]) for m in macd_line]
    signal_line = calculate_ema(signal_candles, signal_period)
    sig_map = {s["time"]: s["value"] for s in signal_line}

    results = []
    for m in macd_line:
        t = m["time"]
        if t in sig_map:
            hist = m["close"] - sig_map[t]
            results.append({
                "time": t,
                "macd": round(m["close"], 2),
                "signal": round(sig_map[t], 2),
                "histogram": round(hist, 2)
            })
    return results

def calculate_bollinger_bands(candles: List[Candle], period: int = 20, num_std: float = 2.0) -> List[Dict[str, Any]]:
    """Bollinger Bands (Upper, Middle, Lower)."""
    if len(candles) < period:
        return []
    results = []
    for i in range(period - 1, len(candles)):
        slice_c = candles[i - period + 1 : i + 1]
        mean = sum(c.close for c in slice_c) / period
        variance = sum((c.close - mean) ** 2 for c in slice_c) / period
        std = math.sqrt(variance)

        results.append({
            "time": candles[i].time,
            "middle": round(mean, 2),
            "upper": round(mean + (num_std * std), 2),
            "lower": round(mean - (num_std * std), 2)
        })
    return results

def calculate_vwap(candles: List[Candle]) -> List[Dict[str, Any]]:
    """Volume Weighted Average Price (VWAP)."""
    results = []
    cum_pv = 0.0
    cum_vol = 0.0
    for c in candles:
        typical_price = (c.high + c.low + c.close) / 3.0
        cum_pv += typical_price * c.volume
        cum_vol += c.volume
        vwap = (cum_pv / cum_vol) if cum_vol > 0 else c.close
        results.append({"time": c.time, "value": round(vwap, 2)})
    return results

def calculate_atr(candles: List[Candle], period: int = 14) -> List[Dict[str, Any]]:
    """Average True Range (ATR)."""
    if len(candles) < period + 1:
        return []
    tr_list = []
    for i in range(1, len(candles)):
        c = candles[i]
        prev_close = candles[i - 1].close
        tr = max(c.high - c.low, abs(c.high - prev_close), abs(c.low - prev_close))
        tr_list.append((c.time, tr))

    results = []
    atr = sum(t[1] for t in tr_list[:period]) / period
    results.append({"time": tr_list[period - 1][0], "value": round(atr, 2)})

    for i in range(period, len(tr_list)):
        atr = (atr * (period - 1) + tr_list[i][1]) / period
        results.append({"time": tr_list[i][0], "value": round(atr, 2)})
    return results
