import { expect, test } from '@jest/globals';
import { validateRoutingEvent } from '../../../../src/routing/event-contract/index.mjs';
import { validateTopologyNodes } from '../../../../src/routing/event-contract/topology/nodes.mjs';
const node = { nodeId: 'elera-0', address: '10.0.0.1', sqlPort: 3306, state: 'ready', draining: false };
const event = { type: 'routing.topology', version: 1, generatedAt: '2099-01-01T00:00:00.000Z', node: 'elera-0', context: { nodeIdentity: { name: 'elera-0' }, ports: { sql: 3306, http: 8080 }, clusterCondition: 'Primary' }, topology: { nodes: [node] } };
test('validates topology availability nodes', () => {
  expect(validateRoutingEvent(event)).toEqual(event);
  expect(() => validateRoutingEvent({ ...event, topology: { nodes: null } })).toThrow('nodes');
  expect(() => validateRoutingEvent({ ...event, topology: { nodes: [{ nodeId: 'n' }] } })).toThrow('record');
  expect(() => validateRoutingEvent({ ...event, topology: { nodes: [{ ...node, sqlPort: '3306' }] } })).toThrow('record');
  expect(() => validateRoutingEvent({ ...event, topology: { nodes: [{ ...node, sqlPort: 70000 }] } })).toThrow('availability port');
  expect(() => validateRoutingEvent({ ...event, topology: { nodes: [{ ...node, extra: true }] } })).toThrow('availability field');
  expect(() => validateRoutingEvent({ ...event, topology: { nodes: [node, { ...node }] } })).toThrow('duplicate nodeId');
});

test('rejects invalid node shapes and accepts boundary ports', () => {
  const base = { nodeId: 'n', address: 'a', sqlPort: 1, state: 'ready', draining: false };
  for (const field of ['nodeId', 'address', 'state']) expect(() => validateRoutingEvent({ ...event, topology: { nodes: [{ ...base, [field]: '' }] } })).toThrow('record');
  expect(() => validateRoutingEvent({ ...event, topology: { nodes: [{ ...base, draining: 'false' }] } })).toThrow('record');
  expect(() => validateRoutingEvent({ ...event, topology: { nodes: [{ ...base, sqlPort: 65536 }] } })).toThrow('availability port');
  expect(validateRoutingEvent({ ...event, topology: { nodes: [{ ...base, sqlPort: 65535 }] } })).toBeDefined();
});

test('covers empty topology node list directly', () => {
  expect(validateTopologyNodes([])).toEqual([]);
  expect(() => validateTopologyNodes([null])).toThrow('record');
  expect(() => validateTopologyNodes([{}])).toThrow('record');
  expect(() => validateTopologyNodes([{ nodeId: 'n', address: 'a', sqlPort: 1, state: 'ready', draining: false, extra: true }])).toThrow('field');
  const originalClone = globalThis.structuredClone;
  globalThis.structuredClone = () => { throw new Error('clone'); };
  try { expect(() => validateTopologyNodes([node])).toThrow('cloneable'); }
  finally { globalThis.structuredClone = originalClone; }
});
