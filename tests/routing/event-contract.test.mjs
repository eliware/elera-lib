import { expect, test } from '@jest/globals';
import { validateRoutingEvent } from '../../src/routing/event-contract.mjs';

test('validates shutdown handoff fields', () => {
  expect(validateRoutingEvent({ type: 'routing.shutdown', node: 'elera-0', reconnectDeadlineMs: 1000, loadBalancerEndpoint: 'http://vip' })).toMatchObject({ node: 'elera-0' });
  expect(validateRoutingEvent({ type: 'routing.shutdown' })).toEqual({ type: 'routing.shutdown' });
  expect(() => validateRoutingEvent({ type: 'routing.shutdown', reconnectDeadlineMs: -1 })).toThrow('deadline');
  expect(() => validateRoutingEvent({ type: 'routing.shutdown', loadBalancerEndpoint: 1 })).toThrow('endpoint');
  expect(() => validateRoutingEvent({ type: 'routing.shutdown', node: 1 })).toThrow('node');
});

test('rejects unsupported routing events', () => {
  expect(() => validateRoutingEvent(undefined)).toThrow('unsupported');
  expect(() => validateRoutingEvent({ type: 'other' })).toThrow('unsupported');
  expect(validateRoutingEvent({ type: 'routing.update', version: 1 })).toEqual({ type: 'routing.update', version: 1 });
});
