import { expect, test } from '@jest/globals';
import { validateRoutingEvent } from '../../../../src/routing/event-contract/index.mjs';
import { validateShutdownEvent } from '../../../../src/routing/event-contract/lifecycle/shutdown.mjs';
const envelope = { version: 1, generatedAt: '2030-01-01T00:00:00Z' };
test('validates shutdown handoff fields', () => {
  expect(validateRoutingEvent({ ...envelope, type: 'routing.shutdown', node: 'elera-0', reason: 'maintenance', reconnectDeadlineMs: 1000, loadBalancerEndpoint: 'http://vip' })).toMatchObject({ node: 'elera-0' });
  expect(validateRoutingEvent({ ...envelope, type: 'routing.shutdown', node: 'elera-0', reason: 'maintenance', reconnectDeadlineMs: 0 })).toMatchObject({ node: 'elera-0' });
  expect(() => validateRoutingEvent({ ...envelope, type: 'routing.shutdown', reason: 'x', reconnectDeadlineMs: 1 })).toThrow('node');
  expect(() => validateRoutingEvent({ ...envelope, type: 'routing.shutdown', node: 'n', reason: '', reconnectDeadlineMs: 1 })).toThrow('reason');
  expect(() => validateRoutingEvent({ ...envelope, type: 'routing.shutdown', node: 'n', reason: 'x', reconnectDeadlineMs: -1 })).toThrow('deadline');
  expect(() => validateRoutingEvent({ ...envelope, type: 'routing.shutdown', node: 'n', reason: 'x', reconnectDeadlineMs: Infinity })).toThrow('JSON-compatible');
  expect(() => validateRoutingEvent({ ...envelope, type: 'routing.shutdown', node: 'n', reason: 'x', reconnectDeadlineMs: 1.5 })).toThrow('deadline');
  expect(() => validateRoutingEvent({ ...envelope, type: 'routing.shutdown', node: 'n', reason: 'x', reconnectDeadlineMs: 1, loadBalancerEndpoint: 'ftp://x' })).toThrow('HTTP');
  expect(() => validateRoutingEvent({ ...envelope, type: 'routing.shutdown', node: 'n', reason: 'x', reconnectDeadlineMs: 1, loadBalancerEndpoint: 'not-url' })).toThrow('HTTP');
  expect(() => validateRoutingEvent({ ...envelope, type: 'routing.shutdown', node: 'n', reason: 'x', reconnectDeadlineMs: 1, loadBalancerEndpoint: {} })).toThrow('HTTP');
  expect(() => validateRoutingEvent({ ...envelope, type: 'routing.shutdown', node: 'n', reason: 'x', reconnectDeadlineMs: 1, extra: true })).toThrow('unknown');
});

test('rejects unsafe endpoint forms and accepts valid public variants', () => {
  const base = { ...envelope, type: 'routing.shutdown', node: 'n', reason: 'r', reconnectDeadlineMs: 1 };
  expect(validateRoutingEvent({ ...base, loadBalancerEndpoint: 'https://example.com:443/path' })).toMatchObject({ node: 'n' });
  for (const endpoint of ['http://localhost', 'http://localhost.', 'http://service.local', 'http://127.0.0.1', 'http://10.0.0.1', 'http://0.0.0.0', 'http://[::]', 'http://user:pass@example.com', 'http://example.com/?x=1', 'http://example.com/#x', 'http://2130706433']) expect(() => validateRoutingEvent({ ...base, loadBalancerEndpoint: endpoint })).toThrow('plain HTTP');
  expect(() => validateRoutingEvent({ ...base, loadBalancerEndpoint: 'http://[::1]' })).toThrow('plain HTTP');
});

test('covers endpoint port and literal checks directly', () => {
  const base = { type: 'routing.shutdown', version: 1, generatedAt: '2030-01-01T00:00:00Z', node: 'n', reason: 'r', reconnectDeadlineMs: 1 };
  expect(validateShutdownEvent({ ...base, loadBalancerEndpoint: 'http://example.com:80' })).toBeDefined();
  expect(() => validateShutdownEvent({ ...base, loadBalancerEndpoint: 'http://0x7f000001' })).toThrow('plain HTTP');
  expect(validateShutdownEvent({ ...base, loadBalancerEndpoint: 'http://8.8.8.8' })).toBeDefined();
  const OriginalURL = globalThis.URL;
  globalThis.URL = class { protocol = 'http:'; hostname = 'example.com'; username = ''; password = ''; search = ''; hash = ''; port = '65536'; };
  try { expect(() => validateShutdownEvent({ ...base, loadBalancerEndpoint: 'http://example.com' })).toThrow('plain HTTP'); }
  finally { globalThis.URL = OriginalURL; }
});
