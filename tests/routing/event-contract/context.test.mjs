import { expect, test } from '@jest/globals';
import { validateRoutingEvent } from '../../../src/routing/event-contract.mjs';

const envelope = { version: 1, generatedAt: '2030-01-01T00:00:00Z' };

test('validates drain and recovery context events', () => {
  const base = { ...envelope, type: 'routing.drain', node: 'n', context: {} };
  expect(validateRoutingEvent(base)).toBe(base);
  expect(validateRoutingEvent({ ...base, type: 'routing.recovery', context: { reason: 'up' } })).toBeTruthy();
  expect(() => validateRoutingEvent({ ...base, node: '' })).toThrow('node');
  expect(() => validateRoutingEvent({ ...base, context: [] })).toThrow('context');
});
