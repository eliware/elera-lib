import { expect, test } from '@jest/globals';
import { validateRoutingEvent } from '../../../src/routing/event-contract/index.mjs';
import { validateEnvelope } from '../../../src/routing/event-contract/envelope.mjs';

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
  expect(() => validateRoutingEvent({ get type() { return 'routing.drain'; }, version: 1, generatedAt: '2030-01-01T00:00:00Z' })).toThrow('unsupported');
  expect(() => validateRoutingEvent(new Proxy({}, { ownKeys() { throw new Error('proxy failure'); } }))).toThrow('unsupported');
});

test('rejects accessors, symbols, and unsupported values', () => {
  const accessor = Object.defineProperty({ type: 'routing.drain', version: 1, generatedAt: '2030-01-01T00:00:00Z' }, 'node', { get() { return 'n'; }, enumerable: true });
  expect(() => validateRoutingEvent(accessor)).toThrow('unsupported');
  const symbol = { type: 'routing.drain', version: 1, generatedAt: '2030-01-01T00:00:00Z', node: 'n', reason: 'r', reconnectDeadlineMs: 0 };
  symbol[Symbol('metadata')] = true;
  expect(() => validateRoutingEvent(symbol)).toThrow('unsupported');
  expect(() => validateRoutingEvent({ type: 'routing.drain', version: 1, generatedAt: '2030-01-01T00:00:00Z', node: 'n', reason: 'r', reconnectDeadlineMs: 0, bad: undefined })).toThrow('JSON-compatible');
});

test('covers envelope descriptor and timestamp branches directly', () => {
  expect(validateEnvelope({ type: 'routing.drain', version: 1, generatedAt: '2030-01-01T00:00:00.000Z' })).toMatchObject({ type: 'routing.drain' });
  expect(validateEnvelope({ type: 'routing.drain', version: 1, generatedAt: '2030-01-01T00:00:00Z' })).toMatchObject({ type: 'routing.drain' });
  const nonEnumerable = { type: 'routing.drain', version: 1, generatedAt: '2030-01-01T00:00:00Z' };
  Object.defineProperty(nonEnumerable, 'hidden', { value: true, enumerable: false });
  expect(() => validateEnvelope(nonEnumerable)).toThrow('unsupported');
  expect(() => validateEnvelope({ type: 'routing.drain', version: 1, generatedAt: '2030-02-30T00:00:00Z' })).toThrow('generatedAt');
  expect(() => validateEnvelope(Object.create(null))).toThrow('unsupported');
  expect(() => validateEnvelope({ type: undefined, version: 1, generatedAt: '2030-01-01T00:00:00Z' })).toThrow('JSON-compatible');
  expect(() => validateEnvelope({ type: 'routing.drain', version: 1, generatedAt: '2030-01-01T00:00:00Z', value: () => {} })).toThrow('JSON-compatible');
  expect(() => validateEnvelope({ type: 'routing.drain', version: 1, generatedAt: '2030-01-01T00:00:00Z', value: { nested: undefined } })).toThrow('JSON-compatible');
  expect(() => validateEnvelope({ type: 'routing.drain', version: -1, generatedAt: '2030-01-01T00:00:00Z' })).toThrow('version');
  expect(() => validateEnvelope(Object.create({ inherited: true }))).toThrow('unsupported');
  const originalClone = globalThis.structuredClone;
  globalThis.structuredClone = () => { throw new Error('clone'); };
  try { expect(() => validateEnvelope({ type: 'routing.drain', version: 1, generatedAt: '2030-01-01T00:00:00Z' })).toThrow('unsupported'); }
  finally { globalThis.structuredClone = originalClone; }
  const originalStringify = JSON.stringify;
  JSON.stringify = () => undefined;
  try { expect(() => validateEnvelope({ type: 'routing.drain', version: 1, generatedAt: '2030-01-01T00:00:00Z' })).toThrow('unsupported'); }
  finally { JSON.stringify = originalStringify; }
  JSON.stringify = () => { throw new Error('serialization'); };
  try { expect(() => validateEnvelope({ type: 'routing.drain', version: 1, generatedAt: '2030-01-01T00:00:00Z' })).toThrow('unsupported'); }
  finally { JSON.stringify = originalStringify; }
  expect(() => validateEnvelope({ type: 'routing.drain', version: 1, generatedAt: '2030-01-01T00:00:00Z', value: 'x'.repeat(1_048_576) })).toThrow('maximum contract size');
  const originalEncoder = globalThis.TextEncoder;
  globalThis.TextEncoder = class { encode() { throw new Error('encoding'); } };
  try { expect(() => validateEnvelope({ type: 'routing.drain', version: 1, generatedAt: '2030-01-01T00:00:00Z' })).toThrow('maximum contract size'); }
  finally { globalThis.TextEncoder = originalEncoder; }
});
