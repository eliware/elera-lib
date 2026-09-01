import { expect, test } from '@jest/globals';
import { validateRoutingEvent } from '../../../src/routing/event-contract/index.mjs';

const envelope = { version: 1, generatedAt: '2030-01-01T00:00:00Z' };

test('rejects unsupported and malformed event envelopes', () => {
  expect(() => validateRoutingEvent(undefined)).toThrow('unsupported');
  expect(() => validateRoutingEvent({ type: 'other' })).toThrow('unsupported');
  expect(() => validateRoutingEvent({ ...envelope, type: 'routing.resync' })).toThrow('unsupported');
  expect(() => validateRoutingEvent({ type: 'routing.update' })).toThrow('version');
  const base = { ...envelope, type: 'routing.drain', node: 'n', context: {} };
  for (const field of ['version', 'generatedAt']) expect(() => validateRoutingEvent({ ...base, [field]: undefined })).toThrow();
  expect(() => validateRoutingEvent({ ...base, version: -1 })).toThrow('version');
  expect(() => validateRoutingEvent({ ...base, generatedAt: 'bad' })).toThrow('generatedAt');
});
