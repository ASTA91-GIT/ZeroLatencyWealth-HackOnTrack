import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  createChart,
  IChartApi,
  ISeriesApi,
  CandlestickData,
  LineData,
  HistogramData,
  UTCTimestamp,
  ColorType,
  CrosshairMode,
  CandlestickSeries,
  LineSeries,
  AreaSeries,
  BarSeries,
  HistogramSeries,
} from 'lightweight-charts';
import { CandleData, MarketQuote } from '../../types';
import { api } from '../../services/api';
import { marketWS } from '../../services/marketWebSocket';
import { Maximize2, RotateCcw, TrendingUp, BarChart2, Activity, Layers } from 'lucide-react';

export type ChartType = 'candlestick' | 'line' | 'area' | 'bar';

interface LightweightChartProps {
  symbol: string;
  height?: number;
  initialInterval?: string;
  initialRange?: string;
  showIndicators?: boolean;
}

export const LightweightChart: React.FC<LightweightChartProps> = ({
  symbol,
  height = 480,
  initialInterval = '1d',
  initialRange = '1mo',
  showIndicators = true,
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const mainSeriesRef = useRef<ISeriesApi<any> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<any> | null>(null);
  const indicatorSeriesRef = useRef<Map<string, ISeriesApi<any>>>(new Map());

  const [interval, setIntervalState] = useState<string>(initialInterval);
  const [rangePeriod, setRangePeriod] = useState<string>(initialRange);
  const [chartType, setChartType] = useState<ChartType>('candlestick');
  const [activeIndicators, setActiveIndicators] = useState<string[]>(['SMA20', 'EMA50']);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentCandle, setCurrentCandle] = useState<CandleData | null>(null);
  const [drawnLines, setDrawnLines] = useState<Array<{ id: string; price: number; title: string }>>([]);
  const priceLineRefs = useRef<Map<string, any>>(new Map());

  // Intervals mapping
  const intervals = [
    { label: '1m', interval: '1m', range: '1d' },
    { label: '5m', interval: '5m', range: '5d' },
    { label: '15m', interval: '15m', range: '5d' },
    { label: '1H', interval: '1h', range: '1mo' },
    { label: '1D', interval: '1d', range: '1mo' },
    { label: '1W', interval: '1wk', range: '6mo' },
    { label: '1M', interval: '1mo', range: '2y' },
  ];

  // Initialize TradingView Chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Clear previous chart
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: height,
      layout: {
        background: { type: ColorType.Solid, color: '#09090B' },
        textColor: '#A1A1AA',
        fontSize: 12,
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      },
      grid: {
        vertLines: { color: 'rgba(39, 39, 42, 0.5)' },
        horzLines: { color: 'rgba(39, 39, 42, 0.5)' },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          color: '#8B5CF6',
          width: 1,
          style: 3,
          labelBackgroundColor: '#7C3AED',
        },
        horzLine: {
          color: '#8B5CF6',
          width: 1,
          style: 3,
          labelBackgroundColor: '#7C3AED',
        },
      },
      timeScale: {
        borderColor: '#27272A',
        timeVisible: true,
        secondsVisible: false,
      },
      rightPriceScale: {
        borderColor: '#27272A',
        autoScale: true,
      },
    });

    chartRef.current = chart;

    // Add Volume Series at bottom
    const volumeSeries = chart.addSeries(HistogramSeries, {
      color: '#3F3F46',
      priceFormat: { type: 'volume' },
      priceScaleId: 'volume',
    });
    chart.priceScale('volume').applyOptions({
      scaleMargins: {
        top: 0.8, // volume takes bottom 20%
        bottom: 0,
      },
    });
    volumeSeriesRef.current = volumeSeries;

    // Handle Window Resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [height]);

  // Load Real Historical Candles
  const loadCandles = useCallback(async () => {
    if (!chartRef.current) return;
    setLoading(true);
    setError(null);

    try {
      const res = await api.getMarketCandles(symbol, interval, rangePeriod);
      const rawCandles = res.candles || [];

      if (rawCandles.length === 0) {
        setError('Market data unavailable for this interval');
        setLoading(false);
        return;
      }

      // Sort ascending by time
      const sortedCandles = [...rawCandles].sort((a, b) => a.time - b.time);
      setCurrentCandle(sortedCandles[sortedCandles.length - 1]);

      // Remove existing series
      if (mainSeriesRef.current && chartRef.current) {
        chartRef.current.removeSeries(mainSeriesRef.current);
        mainSeriesRef.current = null;
      }

      // Create main series based on selected chart type
      let mainSeries: ISeriesApi<any>;
      if (chartType === 'candlestick') {
        mainSeries = chartRef.current.addSeries(CandlestickSeries, {
          upColor: '#10B981',
          downColor: '#EF4444',
          borderVisible: false,
          wickUpColor: '#10B981',
          wickDownColor: '#EF4444',
        });
        const formatted: CandlestickData[] = sortedCandles.map(c => ({
          time: c.time as UTCTimestamp,
          open: c.open,
          high: c.high,
          low: c.low,
          close: c.close,
        }));
        mainSeries.setData(formatted);
      } else if (chartType === 'area') {
        mainSeries = chartRef.current.addSeries(AreaSeries, {
          topColor: 'rgba(139, 92, 246, 0.4)',
          bottomColor: 'rgba(139, 92, 246, 0.0)',
          lineColor: '#8B5CF6',
          lineWidth: 2,
        });
        const formatted: LineData[] = sortedCandles.map(c => ({
          time: c.time as UTCTimestamp,
          value: c.close,
        }));
        mainSeries.setData(formatted);
      } else if (chartType === 'bar') {
        mainSeries = chartRef.current.addSeries(BarSeries, {
          upColor: '#10B981',
          downColor: '#EF4444',
        });
        const formatted = sortedCandles.map(c => ({
          time: c.time as UTCTimestamp,
          open: c.open,
          high: c.high,
          low: c.low,
          close: c.close,
        }));
        mainSeries.setData(formatted);
      } else {
        // Line
        mainSeries = chartRef.current.addSeries(LineSeries, {
          color: '#8B5CF6',
          lineWidth: 2,
        });
        const formatted: LineData[] = sortedCandles.map(c => ({
          time: c.time as UTCTimestamp,
          value: c.close,
        }));
        mainSeries.setData(formatted);
      }
      mainSeriesRef.current = mainSeries;

      // Update Volume Series
      if (volumeSeriesRef.current) {
        const volumeData: HistogramData[] = sortedCandles.map(c => ({
          time: c.time as UTCTimestamp,
          value: c.volume || 0,
          color: c.close >= c.open ? 'rgba(16, 185, 129, 0.35)' : 'rgba(239, 68, 68, 0.35)',
        }));
        volumeSeriesRef.current.setData(volumeData);
      }

      // Add Indicators Overlay
      if (showIndicators) {
        renderIndicators(sortedCandles);
      }

      // Fit content
      chartRef.current.timeScale().fitContent();
      setLoading(false);
    } catch (e: any) {
      console.error('Error loading candles:', e);
      setError('Historical chart data unavailable');
      setLoading(false);
    }
  }, [symbol, interval, rangePeriod, chartType, showIndicators]);

  // Compute & Render Overlay Technical Indicators
  const renderIndicators = (candles: CandleData[]) => {
    if (!chartRef.current) return;

    // Clear old indicator series
    indicatorSeriesRef.current.forEach(series => {
      if (chartRef.current) chartRef.current.removeSeries(series);
    });
    indicatorSeriesRef.current.clear();

    // SMA 20
    if (activeIndicators.includes('SMA20') && candles.length >= 20) {
      const smaSeries = chartRef.current.addSeries(LineSeries, {
        color: '#F59E0B', // Amber
        lineWidth: 1,
        title: 'SMA 20',
      });
      const smaData: LineData[] = [];
      for (let i = 19; i < candles.length; i++) {
        const slice = candles.slice(i - 19, i + 1);
        const sum = slice.reduce((acc, c) => acc + c.close, 0);
        smaData.push({
          time: candles[i].time as UTCTimestamp,
          value: Number((sum / 20).toFixed(2)),
        });
      }
      smaSeries.setData(smaData);
      indicatorSeriesRef.current.set('SMA20', smaSeries);
    }

    // EMA 50
    if (activeIndicators.includes('EMA50') && candles.length >= 50) {
      const emaSeries = chartRef.current.addSeries(LineSeries, {
        color: '#3B82F6', // Blue
        lineWidth: 1,
        title: 'EMA 50',
      });
      const k = 2 / (50 + 1);
      let prevEma = candles.slice(0, 50).reduce((acc, c) => acc + c.close, 0) / 50;
      const emaData: LineData[] = [{ time: candles[49].time as UTCTimestamp, value: Number(prevEma.toFixed(2)) }];

      for (let i = 50; i < candles.length; i++) {
        const ema = candles[i].close * k + prevEma * (1 - k);
        prevEma = ema;
        emaData.push({
          time: candles[i].time as UTCTimestamp,
          value: Number(ema.toFixed(2)),
        });
      }
      emaSeries.setData(emaData);
      indicatorSeriesRef.current.set('EMA50', emaSeries);
    }
  };

  useEffect(() => {
    loadCandles();
  }, [loadCandles]);

  // Real-time Incremental Candle Updates via WebSocket
  useEffect(() => {
    marketWS.subscribe([symbol]);

    const unsubscribeTick = marketWS.onTick((quote: MarketQuote) => {
      if (quote.symbol.toUpperCase() !== symbol.toUpperCase()) return;

      const lastPrice = quote.last_price || (quote as any).price;
      if (!lastPrice || !mainSeriesRef.current) return;

      setCurrentCandle(prev => {
        if (!prev) return null;

        const updatedHigh = Math.max(prev.high, lastPrice);
        const updatedLow = Math.min(prev.low, lastPrice);
        const updatedClose = lastPrice;

        const updatedCandle: CandleData = {
          ...prev,
          high: updatedHigh,
          low: updatedLow,
          close: updatedClose,
        };

        if (chartType === 'candlestick' || chartType === 'bar') {
          mainSeriesRef.current?.update({
            time: prev.time as UTCTimestamp,
            open: prev.open,
            high: updatedHigh,
            low: updatedLow,
            close: updatedClose,
          });
        } else {
          mainSeriesRef.current?.update({
            time: prev.time as UTCTimestamp,
            value: updatedClose,
          });
        }

        return updatedCandle;
      });
    });

    return () => {
      unsubscribeTick();
      marketWS.unsubscribe([symbol]);
    };
  }, [symbol, chartType]);

  const toggleIndicator = (name: string) => {
    setActiveIndicators(prev =>
      prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]
    );
  };

  const addHorizontalLine = (type: 'support' | 'resistance' = 'resistance') => {
    if (!mainSeriesRef.current || !currentCandle) return;
    const price = type === 'resistance' ? currentCandle.high : currentCandle.low;
    const color = type === 'resistance' ? '#EF4444' : '#10B981';
    const id = `line_${Date.now()}`;
    const title = type === 'resistance' ? `Res: ₹${price}` : `Sup: ₹${price}`;

    try {
      const lineRef = (mainSeriesRef.current as any).createPriceLine({
        price,
        color,
        lineWidth: 1,
        lineStyle: 2, // Dashed
        axisLabelVisible: true,
        title,
      });
      priceLineRefs.current.set(id, lineRef);
      setDrawnLines(prev => [...prev, { id, price, title }]);
    } catch (e) {
      console.error('Failed to create price line', e);
    }
  };

  const removeAllDrawnLines = () => {
    if (!mainSeriesRef.current) return;
    priceLineRefs.current.forEach((lineRef) => {
      try {
        (mainSeriesRef.current as any)?.removePriceLine(lineRef);
      } catch (e) {}
    });
    priceLineRefs.current.clear();
    setDrawnLines([]);
  };

  const handleReset = () => {
    if (chartRef.current) {
      chartRef.current.timeScale().fitContent();
    }
  };

  return (
    <div className="flex flex-col bg-[#09090B] border border-[#27272A] rounded-xl overflow-hidden shadow-2xl">
      {/* Top Chart Toolbar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-[#121214] border-b border-[#27272A] gap-2">
        {/* Left: Timeframe Shortcuts */}
        <div className="flex items-center space-x-1">
          {intervals.map(item => (
            <button
              key={item.interval}
              onClick={() => {
                setIntervalState(item.interval);
                setRangePeriod(item.range);
              }}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                interval === item.interval
                  ? 'bg-violet-600 text-white shadow-sm shadow-violet-600/50'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Center: Chart Type Selector */}
        <div className="flex items-center space-x-1 border-l border-r border-[#27272A] px-2">
          {(['candlestick', 'line', 'area', 'bar'] as ChartType[]).map(type => (
            <button
              key={type}
              onClick={() => setChartType(type)}
              className={`px-2 py-1 text-xs font-medium rounded capitalize transition-all ${
                chartType === type
                  ? 'bg-zinc-800 text-violet-400 font-semibold border border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Right: Technical Indicators, Drawings & Actions */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => toggleIndicator('SMA20')}
              className={`px-2 py-0.5 text-xs rounded border transition-all ${
                activeIndicators.includes('SMA20')
                  ? 'border-amber-500/50 text-amber-400 bg-amber-500/10'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              SMA 20
            </button>
            <button
              onClick={() => toggleIndicator('EMA50')}
              className={`px-2 py-0.5 text-xs rounded border transition-all ${
                activeIndicators.includes('EMA50')
                  ? 'border-blue-500/50 text-blue-400 bg-blue-500/10'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              EMA 50
            </button>
          </div>

          {/* Drawing Tools: Support & Resistance */}
          <div className="flex items-center space-x-1 pl-2 border-l border-zinc-800">
            <button
              onClick={() => addHorizontalLine('resistance')}
              title="Draw Resistance Price Level"
              className="px-2 py-0.5 text-[11px] rounded border border-red-500/40 text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-all font-mono"
            >
              + Res
            </button>
            <button
              onClick={() => addHorizontalLine('support')}
              title="Draw Support Price Level"
              className="px-2 py-0.5 text-[11px] rounded border border-emerald-500/40 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 transition-all font-mono"
            >
              + Sup
            </button>
            {drawnLines.length > 0 && (
              <button
                onClick={removeAllDrawnLines}
                title="Clear Drawn Levels"
                className="px-1.5 py-0.5 text-[11px] text-zinc-500 hover:text-zinc-300 transition-all"
              >
                Clear ({drawnLines.length})
              </button>
            )}
          </div>

          <button
            onClick={handleReset}
            title="Reset Chart View"
            className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="relative w-full" style={{ height: `${height}px` }}>
        {loading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#09090B]/80 backdrop-blur-sm">
            <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-xs text-zinc-400 font-mono tracking-wide">STREAMING REAL EXCHANGE CANDLES...</p>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#09090B]/90 p-4">
            <Activity className="w-8 h-8 text-amber-500/80 mb-2" />
            <p className="text-sm font-semibold text-zinc-300">{error}</p>
            <p className="text-xs text-zinc-500 mt-1 max-w-sm text-center">
              Historical candle feed is temporarily unavailable for this timeframe. Please select 1D or 1W.
            </p>
          </div>
        )}

        {/* Active Candle Live Strip */}
        {currentCandle && !loading && (
          <div className="absolute top-2 left-3 z-10 flex items-center space-x-3 text-[11px] font-mono bg-zinc-950/80 px-2.5 py-1 rounded border border-zinc-800/80 backdrop-blur-sm pointer-events-none">
            <span className="text-zinc-400">O: <strong className="text-zinc-200">₹{currentCandle.open}</strong></span>
            <span className="text-zinc-400">H: <strong className="text-emerald-400">₹{currentCandle.high}</strong></span>
            <span className="text-zinc-400">L: <strong className="text-red-400">₹{currentCandle.low}</strong></span>
            <span className="text-zinc-400">C: <strong className={currentCandle.close >= currentCandle.open ? 'text-emerald-400' : 'text-red-400'}>₹{currentCandle.close}</strong></span>
            <span className="text-zinc-500 border-l border-zinc-700 pl-2">REAL EXCHANGE FEED</span>
          </div>
        )}

        <div ref={chartContainerRef} className="w-full h-full" />
      </div>
    </div>
  );
};
