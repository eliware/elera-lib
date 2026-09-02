import { expect, test } from '@jest/globals';
import { validateTopologyEvent } from '../../../../src/routing/event-contract/topology/index.mjs';
test('exports topology validation', () => expect(validateTopologyEvent).toBeDefined());

test('rejects malformed topology payloads', () => {
  const base = { type: 'routing.topology', version: 1, generatedAt: '2099-01-01T00:00:00Z', node: 'n', context: { nodeIdentity: { name: 'n' }, ports: { sql: 1, http: 2 }, clusterCondition: 'ok' }, topology: { nodes: [] } };
  expect(() => validateTopologyEvent({ ...base, topology: {} })).toThrow('nodes');
  expect(() => validateTopologyEvent({ ...base, topology: { nodes: [], extra: true } })).toThrow('unknown');
  expect(() => validateTopologyEvent({ ...base, topology: null })).toThrow('topology');
  expect(() => validateTopologyEvent({ ...base, topology: [] })).toThrow('topology');
});

test('returns detached validated topology data', () => {
  const event = { type: 'routing.topology', version: 1, generatedAt: '2099-01-01T00:00:00Z', node: 'n', context: { nodeIdentity: { name: 'n' }, ports: { sql: 1, http: 2 }, clusterCondition: 'ok' }, topology: { nodes: [] } };
  expect(validateTopologyEvent(event)).not.toBe(event);
  const originalClone = globalThis.structuredClone;
  let cloneCount = 0;
  globalThis.structuredClone = (value) => { cloneCount += 1; if (cloneCount === 2) throw new Error('clone'); return originalClone(value); };
  try { expect(() => validateTopologyEvent(event)).toThrow('cloneable'); }
  finally { globalThis.structuredClone = originalClone; }
});
