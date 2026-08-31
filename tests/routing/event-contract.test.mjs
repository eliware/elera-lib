import { expect, test } from '@jest/globals';
import { validateRoutingEvent } from '../../src/routing/event-contract.mjs';

const envelope = { version: 1, generatedAt: '2030-01-01T00:00:00Z' };
test('validates shutdown handoff fields', () => {
  expect(validateRoutingEvent({ ...envelope, type: 'routing.shutdown', node: 'elera-0', reason: 'maintenance', reconnectDeadlineMs: 1000, loadBalancerEndpoint: 'http://vip' })).toMatchObject({ node: 'elera-0' });
  expect(validateRoutingEvent({ ...envelope, type: 'routing.shutdown', node: 'elera-0', reason: 'maintenance', reconnectDeadlineMs: 0 })).toMatchObject({ node: 'elera-0' });
  expect(() => validateRoutingEvent({ ...envelope, type: 'routing.shutdown', node: 'n', reason: 'x', reconnectDeadlineMs: -1 })).toThrow('deadline');
  expect(() => validateRoutingEvent({ ...envelope, type: 'routing.shutdown', node: 'n', reason: 'x', reconnectDeadlineMs: 1, loadBalancerEndpoint: 'ftp://x' })).toThrow('HTTP');
  expect(() => validateRoutingEvent({ ...envelope, type: 'routing.shutdown', reason: 'x', reconnectDeadlineMs: 1 })).toThrow('node');
});

test('rejects unsupported routing events', () => {
  expect(() => validateRoutingEvent(undefined)).toThrow('unsupported');
  expect(() => validateRoutingEvent({ type: 'other' })).toThrow('unsupported');
  expect(() => validateRoutingEvent({ ...envelope, type: 'routing.resync' })).toThrow('unsupported');
  expect(() => validateRoutingEvent({ type: 'routing.update' })).toThrow('version');
});

test('validates strict event envelopes and context events', () => {
  const base = { ...envelope, type: 'routing.drain', node: 'n', context: {} };
  expect(validateRoutingEvent(base)).toBe(base);
  expect(validateRoutingEvent({ ...base, type: 'routing.recovery', context: { reason: 'up' } })).toBeTruthy();
  for (const field of ['version', 'generatedAt']) expect(() => validateRoutingEvent({ ...base, [field]: undefined })).toThrow();
  expect(() => validateRoutingEvent({ ...base, version: -1 })).toThrow('version');
  expect(() => validateRoutingEvent({ ...base, generatedAt: 'bad' })).toThrow('generatedAt');
  expect(() => validateRoutingEvent({ ...base, node: '' })).toThrow('node');
  expect(() => validateRoutingEvent({ ...base, context: [] })).toThrow('context');
  expect(() => validateRoutingEvent({ ...base, type: 'routing.shutdown', reason: '', reconnectDeadlineMs: 1 })).toThrow('reason');
  expect(() => validateRoutingEvent({ ...base, type: 'routing.shutdown', reason: 'x', reconnectDeadlineMs: Infinity })).toThrow('deadline');
});

test('validates update bundles and endpoint syntax', () => {
  const bundle = { apiVersion: 'v1', application: 'a', database: 'logical-d', physicalDatabase: 'elera_db_1', identity: 'i', credentials: { username: 'u', password: 'p' }, writer: { host: 'w', port: 3306 }, readers: [], failover: [], bundleVersion: 1, expiresAt: '2099-01-01T00:00:00Z', nodeIdentity: 'w', ports: { sql: 3306, http: 8080 }, routes: { primary: [], balanced: [] } };
  expect(validateRoutingEvent({ ...envelope, type: 'routing.update', ...bundle })).toMatchObject(bundle);
  expect(() => validateRoutingEvent({ ...envelope, type: 'routing.update', application: 'a' })).toThrow();
  expect(() => validateRoutingEvent({ ...envelope, type: 'routing.shutdown', node: 'n', reason: 'x', reconnectDeadlineMs: 1, loadBalancerEndpoint: 'not-url' })).toThrow('HTTP');
});

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
