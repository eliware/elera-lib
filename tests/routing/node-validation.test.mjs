import { expect, test } from '@jest/globals';
import { validateRoutingNode, validateRoutingNodes } from '../../src/routing/node-validation.mjs';

test('normalizes valid nodes and defaults the SQL port', () => {
  expect(validateRoutingNode({ host: ' node ' })).toEqual({ host: 'node', port: 3306 });
  expect(validateRoutingNodes([{ host: 'a', port: 3307 }])).toEqual([{ host: 'a', port: 3307 }]);
});

test('rejects invalid and duplicate nodes', () => {
  expect(() => validateRoutingNode({ host: '' })).toThrow('host');
  expect(() => validateRoutingNode({ host: 'a', port: 0 })).toThrow('port');
  expect(() => validateRoutingNodes([{ host: 'a' }, { host: 'a', port: 3306 }])).toThrow('duplicate');
});
