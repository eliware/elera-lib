import { log as defaultLog } from '@eliware/common';
import { compareBundleVersions } from './bundle-version.mjs';

export function createRoutingStream({ endpoint, token, application = 'default', fetchBundle, WebSocketImpl = globalThis.WebSocket, onUpdate, onError, reconnectMs = 1000, maxReconnectMs = 30000, heartbeatMs = 45000, now = () => Date.now() } = {}) {
  if (!endpoint || typeof fetchBundle !== 'function') throw new TypeError('endpoint and fetchBundle are required');
  let socket; let closed = false; let timer; let heartbeat; let expectedVersion = 0; let delay = reconnectMs; let updateHandler = onUpdate; let mode = 'disconnected';
  const log = arguments[0]?.log ?? defaultLog;
  const streamUrl = () => `${endpoint.replace(/^http/i, 'ws').replace(/\/$/, '')}/api/v1/routing/stream?application=${encodeURIComponent(application)}&token=${encodeURIComponent(token ?? '')}`;
  async function fallback() { try { const bundle = await fetchBundle(application); if (closed) return; mode = 'rest'; updateHandler?.({ type: 'routing.resync', version: expectedVersion, bundle, receivedAt: now() }); } catch (error) { if (closed) return; mode = 'disconnected'; onError?.(error); log.warn?.('Routing REST fallback failed', { error }); } }
  function schedule() { if (closed || timer) return; timer = setTimeout(() => { timer = undefined; void connect(); }, delay); delay = Math.min(maxReconnectMs, delay * 2); }
  async function connect() {
    if (closed || typeof WebSocketImpl !== 'function') { await fallback(); schedule(); return; }
    try {
      socket = new WebSocketImpl(streamUrl());
      socket.onopen = () => { mode = 'websocket'; delay = reconnectMs; heartbeat = setInterval(() => socket?.send?.(JSON.stringify({ type: 'heartbeat', sentAt: now() })), heartbeatMs); };
      socket.onmessage = async ({ data }) => {
        try {
          const event = JSON.parse(data); const version = event.version;
          if (version !== undefined && expectedVersion !== 0 && compareBundleVersions(version, expectedVersion) <= 0) return;
          const numericVersion = Number(version); const numericExpected = Number(expectedVersion);
          if (Number.isInteger(numericVersion) && Number.isInteger(numericExpected) && numericExpected > 0 && numericVersion > numericExpected + 1) await fallback();
          if (version !== undefined && (expectedVersion === 0 || compareBundleVersions(version, expectedVersion) > 0)) expectedVersion = version;
          updateHandler?.(event);
        } catch (error) { onError?.(error); }
      };
      socket.onerror = (error) => { onError?.(error); };
      socket.onclose = () => { clearInterval(heartbeat); heartbeat = undefined; socket = undefined; mode = 'disconnected'; if (!closed) { void fallback(); schedule(); } };
    } catch (error) { mode = 'disconnected'; onError?.(error); await fallback(); schedule(); }
  }
  return { connect, sendTelemetry: (payload) => { if (socket?.readyState === 1) socket.send(JSON.stringify(payload)); }, setOnUpdate: (handler) => { updateHandler = handler; }, close: () => { closed = true; mode = 'disconnected'; clearTimeout(timer); clearInterval(heartbeat); socket?.close?.(); }, state: () => ({ connected: socket?.readyState === 1, mode, expectedVersion }) };
}
