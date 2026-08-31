import { expect, test } from '@jest/globals';
import { validateRoutingEvent } from '../../../../src/routing/event-contract.mjs';
const node = { nodeId: 'elera-0', address: '10.0.0.1', sqlPort: 3306, state: 'ready', draining: false };
const event = { type: 'routing.topology', version: 1, generatedAt: '2099-01-01T00:00:00.000Z', node: 'elera-0', context: { nodeIdentity: {}, ports: { sql: 3306 }, clusterCondition: 'Primary' }, topology: { nodes: [node] } };
test('validates topology availability nodes', () => {
  expect(validateRoutingEvent(event)).toBe(event);
  expect(() => validateRoutingEvent({ ...event, topology: { nodes: null } })).toThrow('nodes');
  expect(() => validateRoutingEvent({ ...event, topology: { nodes: [{ nodeId: 'n' }] } })).toThrow('record');
  expect(() => validateRoutingEvent({ ...event, topology: { nodes: [{ ...node, sqlPort: '3306' }] } })).toThrow('record');
  expect(() => validateRoutingEvent({ ...event, topology: { nodes: [{ ...node, sqlPort: 70000 }] } })).toThrow('availability port');
  expect(() => validateRoutingEvent({ ...event, topology: { nodes: [{ ...node, extra: true }] } })).toThrow('availability field');
});
