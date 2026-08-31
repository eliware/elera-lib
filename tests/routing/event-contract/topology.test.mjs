import { expect, test } from '@jest/globals';
import { validateRoutingEvent } from '../../../src/routing/event-contract.mjs';

test('validates credential-free topology events', () => {
  const event = { type: 'routing.topology', version: 1, generatedAt: '2099-01-01T00:00:00.000Z', node: 'elera-0', context: { nodeIdentity: { name: 'elera-0' }, ports: { sql: 3306, http: 8080 }, clusterCondition: 'Primary', refreshAfter: '2099-01-01T00:01:00.000Z' }, topology: { nodes: [{ nodeId: 'elera-0', address: '10.0.0.1', sqlPort: 3306, state: 'ready', draining: false }] } };
  expect(validateRoutingEvent(event)).toBe(event);
  expect(() => validateRoutingEvent({ ...event, version: 0 })).toThrow('positive');
  expect(() => validateRoutingEvent({ ...event, generatedAt: '2099-01-01T00:00:00.000+00:00' })).toThrow('UTC');
  expect(() => validateRoutingEvent({ ...event, topology: { nodes: [{ ...event.topology.nodes[0], sqlPort: '3306' }] } })).toThrow('record');
  for (const key of ['node', 'context', 'topology']) { const copy = { ...event }; delete copy[key]; expect(() => validateRoutingEvent(copy)).toThrow('field'); }
  expect(() => validateRoutingEvent({ ...event, node: '' })).toThrow('node');
  expect(() => validateRoutingEvent({ ...event, context: null })).toThrow('context');
  expect(() => validateRoutingEvent({ ...event, context: { ...event.context, nodeIdentity: null } })).toThrow('nodeIdentity');
  expect(() => validateRoutingEvent({ ...event, context: { ...event.context, ports: null } })).toThrow('ports');
  expect(() => validateRoutingEvent({ ...event, context: { ...event.context, ports: { sql: 0 } } })).toThrow('ports');
  expect(() => validateRoutingEvent({ ...event, context: { ...event.context, clusterCondition: '' } })).toThrow('clusterCondition');
  expect(() => validateRoutingEvent({ ...event, context: { ...event.context, refreshAfter: 'bad' } })).toThrow('refreshAfter');
  expect(() => validateRoutingEvent({ ...event, topology: { nodes: null } })).toThrow('nodes');
  expect(() => validateRoutingEvent({ ...event, topology: { nodes: [{ nodeId: 'n' }] } })).toThrow('record');
  expect(() => validateRoutingEvent({ ...event, topology: { nodes: [{ ...event.topology.nodes[0], sqlPort: 70000 }] } })).toThrow('availability port');
  expect(() => validateRoutingEvent({ ...event, extra: true })).toThrow('unknown');
  expect(() => validateRoutingEvent({ ...event, context: { ...event.context, extra: true } })).toThrow('context field');
  expect(() => validateRoutingEvent({ ...event, topology: { nodes: [{ ...event.topology.nodes[0], extra: true }] } })).toThrow('availability field');
});
