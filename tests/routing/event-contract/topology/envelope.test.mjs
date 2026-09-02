import { expect, test } from '@jest/globals';
import { validateRoutingEvent } from '../../../../src/routing/event-contract/index.mjs';
import { validateTopologyEnvelope } from '../../../../src/routing/event-contract/topology/envelope.mjs';
const event = { type: 'routing.topology', version: 1, generatedAt: '2099-01-01T00:00:00.000Z', node: 'elera-0', context: { nodeIdentity: { name: 'elera-0' }, ports: { sql: 3306, http: 8080 }, clusterCondition: 'Primary' }, topology: { nodes: [] } };
test('validates topology envelope', () => {
  expect(() => validateTopologyEnvelope([])).toThrow('required');
  expect(validateRoutingEvent(event)).toEqual(event);
  expect(() => validateRoutingEvent({ ...event, version: 0 })).toThrow('positive');
  expect(() => validateRoutingEvent({ ...event, generatedAt: '2099-01-01T00:00:00.000+00:00' })).toThrow('UTC');
  for (const key of ['node', 'context', 'topology']) { const copy = { ...event }; delete copy[key]; expect(() => validateRoutingEvent(copy)).toThrow('field'); }
  expect(() => validateRoutingEvent({ ...event, node: '' })).toThrow('node');
  expect(() => validateRoutingEvent({ ...event, extra: true })).toThrow('unknown');
  expect(() => validateRoutingEvent({ ...event, topology: null })).toThrow('topology');
  expect(() => validateRoutingEvent({ ...event, topology: [] })).toThrow('topology');
  expect(() => validateRoutingEvent({ ...event, topology: { nodes: [], extra: true } })).toThrow('unknown');
  expect(() => validateRoutingEvent({ ...event, generatedAt: 'badZ' })).toThrow('UTC');
  expect(() => validateTopologyEnvelope({ ...event, generatedAt: 'badZ' })).toThrow('UTC');
});

test('rejects invalid generatedAt calendar values', () => {
  expect(() => validateTopologyEnvelope({ ...event, generatedAt: '2099-02-29T00:00:00Z' })).toThrow('UTC');
});

test('covers valid topology envelope directly', () => {
  expect(validateTopologyEnvelope(event)).toBeUndefined();
  expect(() => validateTopologyEnvelope(null)).toThrow('required');
  expect(() => validateTopologyEnvelope({ ...event, type: 'routing.update' })).toThrow('type');
  expect(validateTopologyEnvelope({ ...event, generatedAt: '2099-01-01T00:00:00Z' })).toBeUndefined();
});
