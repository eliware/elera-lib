import { log as defaultLog } from '@eliware/common';

export function createRoutingStream({ endpoint, token, application = 'default', fetchBundle, WebSocketImpl = globalThis.WebSocket, onUpdate, onError, reconnectMs = 1000, maxReconnectMs = 30000, now = () => Date.now() } = {}) {
  if (!endpoint || typeof fetchBundle !== 'function') throw new TypeError('endpoint and fetchBundle are required');
  let socket; let closed = false; let timer; let expectedVersion = 0; let delay = reconnectMs; let updateHandler = onUpdate; let mode = 'disconnected';
  const log = arguments[0]?.log ?? defaultLog;
  const streamUrl = () => `${endpoint.replace(/^http/i, 'ws').replace(/\/$/, '')}/api/v1/routing/stream?application=${encodeURIComponent(application)}&token=${encodeURIComponent(token ?? '')}`;
  async function fallback() { try { const bundle = await fetchBundle(application); if (closed) return; mode = 'rest'; onUpdate?.({ type: 'routing.resync', version: expectedVersion, bundle, receivedAt: now() }); } catch (error) { if (closed) return; mode = 'disconnected'; onError?.(error); log.warn?.('Routing REST fallback failed', { error }); } }
  function schedule() { if (closed || timer) return; timer = setTimeout(() => { timer = undefined; void connect(); }, delay); delay = Math.min(maxReconnectMs, delay * 2); }
  async function connect() {
    if (closed || typeof WebSocketImpl !== 'function') { await fallback(); schedule(); return; }
    try {
      socket = new WebSocketImpl(streamUrl());
      socket.onopen = () => { mode = 'websocket'; delay = reconnectMs; };
      socket.onmessage = async ({ data }) => {
        try {
          const event = JSON.parse(data); const version = Number(event.version ?? 0);
          if (expectedVersion && version > expectedVersion + 1) await fallback();
          expectedVersion = Math.max(expectedVersion, version); updateHandler?.(event);
        } catch (error) { onError?.(error); }
      };
      socket.onerror = (error) => { onError?.(error); };
      socket.onclose = () => { socket = undefined; mode = 'disconnected'; if (!closed) { void fallback(); schedule(); } };
    } catch (error) { mode = 'disconnected'; onError?.(error); await fallback(); schedule(); }
  }
  return { connect, setOnUpdate: (handler) => { updateHandler = handler; }, close: () => { closed = true; mode = 'disconnected'; clearTimeout(timer); socket?.close?.(); }, state: () => ({ connected: socket?.readyState === 1, mode, expectedVersion }) };
}
