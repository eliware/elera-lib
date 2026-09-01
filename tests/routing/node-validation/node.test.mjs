import { expect, test } from '@jest/globals';
import { validateRoutingNode } from '../../../src/routing/node-validation/index.mjs';

test('normalizes a valid node', () => {
  expect(validateRoutingNode({ host: '  node-a ', port: 3306, weight: 2 })).toEqual({ host: 'node-a', port: 3306, weight: 2 });
});

test('rejects missing, empty, and invalid node fields', () => {
  expect(() => validateRoutingNode()).toThrow('host is required');
  expect(() => validateRoutingNode({ host: '   ' })).toThrow('host is required');
  expect(() => validateRoutingNode({ host: 'node', port: 0 })).toThrow('port is invalid');
  expect(() => validateRoutingNode({ host: 'node', port: 65536 })).toThrow('port is invalid');
  expect(() => validateRoutingNode({ host: 'node', port: 1.5 })).toThrow('port is invalid');
  expect(() => validateRoutingNode({ host: 'node', port: 3306, weight: -1 })).toThrow('weight is invalid');
  expect(() => validateRoutingNode({ host: 'node', port: 3306, weight: 'bad' })).toThrow('weight is invalid');
  expect(() => validateRoutingNode({ host: 'node', port: 3306, extra: true })).toThrow('field is unknown');
  expect(() => validateRoutingNode({ host: 'node', port: 3306, nodeId: '' })).toThrow('nodeId');
  expect(() => validateRoutingNode({ host: 'node', port: 3306, nodeId: 42 })).toThrow('nodeId');
});
