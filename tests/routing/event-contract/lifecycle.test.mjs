import { expect, test } from '@jest/globals';
import { validateRoutingEvent } from '../../../src/routing/event-contract.mjs';

const envelope = { version: 1, generatedAt: '2030-01-01T00:00:00Z' };

test('validates context lifecycle events', () => {
  const base = { ...envelope, type: 'routing.drain', node: 'n', context: {} };
  expect(validateRoutingEvent(base)).toBe(base);
  expect(validateRoutingEvent({ ...base, type: 'routing.recovery', context: { reason: 'up' } })).toBeTruthy();
  expect(() => validateRoutingEvent({ ...base, node: '' })).toThrow('node');
  expect(() => validateRoutingEvent({ ...base, context: [] })).toThrow('context');
});

test('validates shutdown handoff fields', () => {
  expect(validateRoutingEvent({ ...envelope, type: 'routing.shutdown', node: 'elera-0', reason: 'maintenance', reconnectDeadlineMs: 1000, loadBalancerEndpoint: 'http://vip' })).toMatchObject({ node: 'elera-0' });
  expect(validateRoutingEvent({ ...envelope, type: 'routing.shutdown', node: 'elera-0', reason: 'maintenance', reconnectDeadlineMs: 0 })).toMatchObject({ node: 'elera-0' });
  expect(() => validateRoutingEvent({ ...envelope, type: 'routing.shutdown', reason: 'x', reconnectDeadlineMs: 1 })).toThrow('node');
  expect(() => validateRoutingEvent({ ...envelope, type: 'routing.shutdown', node: 'n', reason: '', reconnectDeadlineMs: 1 })).toThrow('reason');
  expect(() => validateRoutingEvent({ ...envelope, type: 'routing.shutdown', node: 'n', reason: 'x', reconnectDeadlineMs: -1 })).toThrow('deadline');
  expect(() => validateRoutingEvent({ ...envelope, type: 'routing.shutdown', node: 'n', reason: 'x', reconnectDeadlineMs: Infinity })).toThrow('deadline');
  expect(() => validateRoutingEvent({ ...envelope, type: 'routing.shutdown', node: 'n', reason: 'x', reconnectDeadlineMs: 1, loadBalancerEndpoint: 'ftp://x' })).toThrow('HTTP');
  expect(() => validateRoutingEvent({ ...envelope, type: 'routing.shutdown', node: 'n', reason: 'x', reconnectDeadlineMs: 1, loadBalancerEndpoint: 'not-url' })).toThrow('HTTP');
});
