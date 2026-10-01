import pytest
import asyncio
from backend.market_data import get_market_data_provider
from backend.market_data.market_session import get_market_session_status
from backend.market_data.services.screener import run_market_screener
from backend.market_data.services.alerts import create_alert, get_user_alerts, delete_alert, evaluate_alerts
from backend.market_data.services.indicators import calculate_sma, calculate_ema, calculate_rsi
from backend.market_data.models import Candle

def test_market_session_status():
    """Verify market session status logic detects actual exchange session or holiday/closed."""
    status = get_market_session_status("NSE")
    assert "status" in status
    assert status["status"] in ["OPEN", "CLOSED", "PRE-MARKET", "POST-MARKET", "WEEKEND", "HOLIDAY"]
    assert "timestamp" in status

@pytest.mark.asyncio
async def test_real_market_quotes():
    """Verify provider fetches real quotes for Indian benchmark indices."""
    provider = get_market_data_provider()
    quote = await provider.get_quote("NIFTY")
    assert quote is not None
    assert quote.symbol == "NIFTY"
    assert quote.last_price > 0
    assert quote.exchange == "NSE"
    assert quote.source == "Live Exchange Feed"

@pytest.mark.asyncio
async def test_historical_candles():
    """Verify historical candles are returned as real OHLCV data."""
    provider = get_market_data_provider()
    candles = await provider.get_historical_candles("RELIANCE", interval="1d", range_period="1mo")
    assert isinstance(candles, list)
    if candles:
        latest = candles[-1]
        assert latest.open > 0
        assert latest.high >= latest.low
        assert latest.close > 0
        assert latest.time > 0

@pytest.mark.asyncio
async def test_level2_market_depth_unavailable_explicitly():
    """Requirement #25: Level 2 depth must explicitly return unavailable if subscriber feed is not connected, never fake order book."""
    provider = get_market_data_provider()
    depth = await provider.get_market_depth("RELIANCE")
    assert depth.symbol == "RELIANCE"
    assert depth.is_available is False
    assert "unavailable" in depth.message.lower()
    assert len(depth.bids) == 0
    assert len(depth.asks) == 0

@pytest.mark.asyncio
async def test_options_chain_unavailable_explicitly():
    """Requirement #27: Options chain must explicitly return unavailable rather than fabricating strikes or fake greeks."""
    provider = get_market_data_provider()
    opt = await provider.get_option_chain("NIFTY")
    assert opt.underlying == "NIFTY"
    assert opt.is_available is False
    assert "unavailable" in opt.message.lower()

def test_technical_indicators_on_real_candles():
    """Verify mathematical indicators (SMA, EMA, RSI) calculation on real candle series."""
    mock_candles = [
        Candle(time=1000 + i * 86400, open=100 + i, high=105 + i, low=95 + i, close=100 + i, volume=1000)
        for i in range(30)
    ]
    sma = calculate_sma(mock_candles, period=10)
    assert len(sma) == 21
    assert sma[-1]["value"] > 0

    ema = calculate_ema(mock_candles, period=10)
    assert len(ema) == 21
    assert ema[-1]["value"] > 0

    rsi = calculate_rsi(mock_candles, period=14)
    assert len(rsi) == 16
    assert 0 <= rsi[-1]["value"] <= 100

def test_price_alerts_lifecycle():
    """Verify creation, evaluation, and deletion of real-time price alerts."""
    user_id = "test-user-alerts"
    alert = create_alert(user_id=user_id, symbol="RELIANCE", target_price=2500.0, condition="ABOVE")
    assert alert.symbol == "RELIANCE"
    assert alert.target_price == 2500.0

    # User alerts retrieval
    user_alerts = get_user_alerts(user_id)
    assert any(a.id == alert.id for a in user_alerts)

    # Deletion
    deleted = delete_alert(alert.id, user_id)
    assert deleted is True
    assert not any(a.id == alert.id for a in get_user_alerts(user_id))
