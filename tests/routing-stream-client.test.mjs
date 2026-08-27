import { afterEach, expect, test, jest } from '@jest/globals';
import { createRoutingStream } from '../src/routing/stream-client.mjs';

test('requires endpoint and REST fallback', () => {
  expect(() => createRoutingStream()).toThrow('endpoint and fetchBundle');
});

const sockets = [];
afterEach(() => sockets.splice(0).forEach((socket) => socket.close()));
class FakeWebSocket { constructor(url) { this.url = url; this.readyState = 0; sockets.push(this); } open() { this.readyState = 1; this.onopen?.(); } message(value) { this.onmessage?.({ data: JSON.stringify(value) }); } close() { this.readyState = 3; this.onclose?.(); } }
test('authenticates, applies updates, and resynchronizes gaps', async () => {
  const update = jest.fn(); const fetchBundle = jest.fn(async () => ({ bundleVersion: 'rest' }));
  const client = createRoutingStream({ endpoint: 'http://vip', token: 'root', WebSocketImpl: FakeWebSocket, fetchBundle, onUpdate: update, reconnectMs: 100000 }); const pending = client.connect(); const socket = sockets[0];
  expect(socket.url).toContain('token=root'); socket.open(); socket.message({ type: 'routing.update', version: 1 }); socket.message({ type: 'routing.update' }); socket.message({ type: 'routing.update', version: 3 }); await pending; await Promise.resolve();
  expect(update).toHaveBeenCalled(); expect(fetchBundle).toHaveBeenCalledWith('default'); expect(client.state().expectedVersion).toBe(3); client.close();
});
test('falls back to REST when WebSocket is unavailable or fails', async () => { const fetchBundle = jest.fn(async () => { throw new Error('offline'); }); const warn = jest.fn(); const client = createRoutingStream({ endpoint: 'http://vip', fetchBundle, WebSocketImpl: null, reconnectMs: 1, maxReconnectMs: 1, log: { warn } }); await client.connect(); await new Promise((resolve) => setTimeout(resolve, 5)); client.close(); expect(fetchBundle).toHaveBeenCalled(); expect(warn).toHaveBeenCalled(); });
test('reports malformed events and socket errors', async () => { const errors = []; const client = createRoutingStream({ endpoint: 'http://vip', fetchBundle: async () => ({}), WebSocketImpl: FakeWebSocket, onError: (error) => errors.push(error), reconnectMs: 100000 }); await client.connect(); const socket = sockets.at(-1); socket.open(); socket.onmessage?.({ data: '{' }); socket.onerror?.(new Error('socket')); client.close(); expect(errors).toHaveLength(2); });
test('replaces the update handler and closes an unopened stream', () => { const client = createRoutingStream({ endpoint: 'http://vip', fetchBundle: async () => ({ }), WebSocketImpl: FakeWebSocket }); const handler = jest.fn(); client.setOnUpdate(handler); client.close(); expect(client.state().connected).toBe(false); });
test('recovers from a WebSocket constructor failure', async () => { const errors = []; class BrokenWebSocket { constructor() { throw new Error('constructor'); } } const client = createRoutingStream({ endpoint: 'http://vip', fetchBundle: async () => ({}), WebSocketImpl: BrokenWebSocket, onError: (error) => errors.push(error), reconnectMs: 100000 }); await client.connect(); client.close(); expect(errors[0].message).toBe('constructor'); });
