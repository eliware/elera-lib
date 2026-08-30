import { validateRoutingNode, validateRoutingNodes } from '../../src/routing/node-validation.mjs';

test('normalizes a valid node and applies the default SQL port', () => {
  expect(validateRoutingNode({ host: '  node-a ', weight: 2 })).toEqual({ host: 'node-a', port: 3306, weight: 2 });
});

test('rejects missing, empty, and invalid node fields', () => {
  expect(() => validateRoutingNode()).toThrow('host is required');
  expect(() => validateRoutingNode({ host: '   ' })).toThrow('host is required');
  expect(() => validateRoutingNode({ host: 'node', port: 0 })).toThrow('port is invalid');
  expect(() => validateRoutingNode({ host: 'node', port: 65536 })).toThrow('port is invalid');
  expect(() => validateRoutingNode({ host: 'node', port: 1.5 })).toThrow('port is invalid');
  expect(() => validateRoutingNode({ host: 'node', weight: -1 })).toThrow('weight is invalid');
  expect(() => validateRoutingNode({ host: 'node', weight: 'bad' })).toThrow('weight is invalid');
});

test('validates node lists, including empty lists and duplicate detection', () => {
  expect(validateRoutingNodes([], 'readers')).toEqual([]);
  expect(validateRoutingNodes([{ host: 'a', port: 3306 }, { host: 'b', port: 3307 }], 'readers')).toEqual([
    { host: 'a', port: 3306 }, { host: 'b', port: 3307 },
  ]);
  expect(() => validateRoutingNodes(undefined, 'readers')).toThrow('must be an array');
  expect(() => validateRoutingNodes([{ host: 'a' }, { host: 'a', port: 3306 }], 'readers')).toThrow('duplicate nodes');
});
