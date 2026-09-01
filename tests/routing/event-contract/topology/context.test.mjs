import { expect, test } from '@jest/globals';
import { validateRoutingEvent } from '../../../../src/routing/event-contract/index.mjs';
const event = { type: 'routing.topology', version: 1, generatedAt: '2099-01-01T00:00:00.000Z', node: 'elera-0', context: { nodeIdentity: { name: 'elera-0' }, ports: { sql: 3306, http: 8080 }, clusterCondition: 'Primary', refreshAfter: '2099-01-01T00:01:00.000Z' }, topology: { nodes: [] } };
test('validates topology context', () => {
  expect(validateRoutingEvent(event)).toBe(event);
  expect(() => validateRoutingEvent({ ...event, context: null })).toThrow('context');
  expect(() => validateRoutingEvent({ ...event, context: { ...event.context, nodeIdentity: null } })).toThrow('nodeIdentity');
  expect(() => validateRoutingEvent({ ...event, context: { ...event.context, ports: null } })).toThrow('ports');
  expect(() => validateRoutingEvent({ ...event, context: { ...event.context, ports: { sql: 0 } } })).toThrow('ports');
  expect(() => validateRoutingEvent({ ...event, context: { ...event.context, clusterCondition: '' } })).toThrow('clusterCondition');
  expect(() => validateRoutingEvent({ ...event, context: { ...event.context, refreshAfter: 'bad' } })).toThrow('refreshAfter');
  expect(() => validateRoutingEvent({ ...event, context: { ...event.context, extra: true } })).toThrow('context field');
  expect(() => validateRoutingEvent({ ...event, context: { ...event.context, nodeIdentity: [] } })).toThrow('nodeIdentity');
  expect(() => validateRoutingEvent({ ...event, context: { ...event.context, nodeIdentity: {} } })).toThrow('nodeIdentity');
  expect(() => validateRoutingEvent({ ...event, context: { ...event.context, ports: [] } })).toThrow('ports');
  expect(() => validateRoutingEvent({ ...event, context: { ...event.context, ports: { sql: 3306 } } })).toThrow('ports.http');
  expect(() => validateRoutingEvent({ ...event, context: { ...event.context, ports: { sql: 3306, http: 8080, mysql: 3306 } } })).toThrow('ports field');
});
