import { afterEach, expect, test, jest } from '@jest/globals';
import { createRoutingStream } from '../src/routing/stream-client.mjs';

const sockets = [];
afterEach(() => sockets.splice(0).forEach((socket) => socket.close()));
class FakeWebSocket { constructor(url) { this.url = url; this.readyState = 0; sockets.push(this); } open() { this.readyState = 1; this.onopen?.(); } message(value) { this.onmessage?.({ data: JSON.stringify(value) }); } close() { this.readyState = 3; this.onclose?.(); } }
test('authenticates, applies updates, and resynchronizes gaps', async () => {
  const update = jest.fn(); const fetchBundle = jest.fn(async () => ({ bundleVersion: 'rest' }));
  const client = createRoutingStream({ endpoint: 'http://vip', token: 'root', WebSocketImpl: FakeWebSocket, fetchBundle, onUpdate: update, reconnectMs: 100000 }); const pending = client.connect(); const socket = sockets[0];
  expect(socket.url).toContain('token=root'); socket.open(); socket.message({ type: 'routing.update', version: 1 }); socket.message({ type: 'routing.update', version: 3 }); await pending; await Promise.resolve();
  expect(update).toHaveBeenCalled(); expect(fetchBundle).toHaveBeenCalledWith('default'); expect(client.state().expectedVersion).toBe(3); client.close();
});
