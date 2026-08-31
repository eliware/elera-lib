import { expect, test } from '@jest/globals';
import { validateRoutingEvent } from '../../../../src/routing/event-contract.mjs';
const event = { type: 'routing.topology', version: 1, generatedAt: '2099-01-01T00:00:00.000Z', node: 'elera-0', context: { nodeIdentity: { name: 'elera-0' }, ports: { sql: 3306, http: 8080 }, clusterCondition: 'Primary' }, topology: { nodes: [] } };
test('validates topology envelope', () => {
  expect(validateRoutingEvent(event)).toBe(event);
  expect(() => validateRoutingEvent({ ...event, version: 0 })).toThrow('positive');
  expect(() => validateRoutingEvent({ ...event, generatedAt: '2099-01-01T00:00:00.000+00:00' })).toThrow('UTC');
  for (const key of ['node', 'context', 'topology']) { const copy = { ...event }; delete copy[key]; expect(() => validateRoutingEvent(copy)).toThrow('field'); }
  expect(() => validateRoutingEvent({ ...event, node: '' })).toThrow('node');
  expect(() => validateRoutingEvent({ ...event, extra: true })).toThrow('unknown');
});
