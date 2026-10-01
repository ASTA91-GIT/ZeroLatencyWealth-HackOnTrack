import { MarketQuote } from '../types';

export type ConnectionStatus = 'CONNECTING' | 'CONNECTED' | 'RECONNECTING' | 'DISCONNECTED';

type TickCallback = (quote: MarketQuote) => void;
type StatusCallback = (status: ConnectionStatus) => void;

class MarketWebSocketService {
  private ws: WebSocket | null = null;
  private status: ConnectionStatus = 'DISCONNECTED';
  private subscriptions: Set<string> = new Set();
  private tickListeners: Set<TickCallback> = new Set();
  private statusListeners: Set<StatusCallback> = new Set();
  private reconnectAttempts = 0;
  private reconnectTimer: any = null;
  private pingInterval: any = null;
  private lastMessageTime = Date.now();

  constructor() {
    // Start connection automatically in browser context
    if (typeof window !== 'undefined') {
      this.connect();
    }
  }

  public connect() {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    this.setStatus(this.reconnectAttempts > 0 ? 'RECONNECTING' : 'CONNECTING');

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.hostname === 'localhost' ? '127.0.0.1:8000' : window.location.host;
    const wsUrl = `${protocol}//${host}/api/ws/markets`;

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.setStatus('CONNECTED');
        this.reconnectAttempts = 0;
        this.lastMessageTime = Date.now();

        // Resubscribe to tracked symbols
        if (this.subscriptions.size > 0) {
          this.sendSubscription(Array.from(this.subscriptions));
        }

        // Heartbeat
        this.startHeartbeat();
      };

      this.ws.onmessage = (event) => {
        this.lastMessageTime = Date.now();
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'TICK' && msg.data) {
            const quote: MarketQuote = msg.data;
            this.tickListeners.forEach(listener => listener(quote));
          }
        } catch (e) {
          console.error('[MarketWS] Failed to parse message', e);
        }
      };

      this.ws.onclose = () => {
        this.cleanup();
        this.setStatus('DISCONNECTED');
        this.scheduleReconnect();
      };

      this.ws.onerror = (err) => {
        console.warn('[MarketWS] WebSocket encountered an error, reconnecting...', err);
        if (this.ws) {
          this.ws.close();
        }
      };
    } catch (e) {
      console.error('[MarketWS] Connection initialization error', e);
      this.scheduleReconnect();
    }
  }

  private setStatus(newStatus: ConnectionStatus) {
    this.status = newStatus;
    this.statusListeners.forEach(cb => cb(newStatus));
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) return;
    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(1.5, this.reconnectAttempts), 15000);
    this.setStatus('RECONNECTING');
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, delay);
  }

  private startHeartbeat() {
    this.stopHeartbeat();
    this.pingInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ action: 'ping' }));
        // Stale detection: if no messages received in 20 seconds, reconnect
        if (Date.now() - this.lastMessageTime > 20000) {
          console.warn('[MarketWS] Stale connection detected. Forcing reconnect.');
          this.ws.close();
        }
      }
    }, 5000);
  }

  private stopHeartbeat() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  private cleanup() {
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.onopen = null;
      this.ws.onmessage = null;
      this.ws.onclose = null;
      this.ws.onerror = null;
      this.ws = null;
    }
  }

  public subscribe(symbols: string[]) {
    symbols.forEach(s => this.subscriptions.add(s.toUpperCase()));
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.sendSubscription(symbols);
    }
  }

  public unsubscribe(symbols: string[]) {
    symbols.forEach(s => this.subscriptions.delete(s.toUpperCase()));
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ action: 'unsubscribe', symbols }));
    }
  }

  private sendSubscription(symbols: string[]) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ action: 'subscribe', symbols }));
    }
  }

  public onTick(callback: TickCallback): () => void {
    this.tickListeners.add(callback);
    return () => this.tickListeners.delete(callback);
  }

  public onStatusChange(callback: StatusCallback): () => void {
    this.statusListeners.add(callback);
    callback(this.status);
    return () => this.statusListeners.delete(callback);
  }

  public getStatus(): ConnectionStatus {
    return this.status;
  }
}

export const marketWS = new MarketWebSocketService();
