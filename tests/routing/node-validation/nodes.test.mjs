import { expect, test } from '@jest/globals';
import { validateRoutingNodes } from '../../../src/routing/node-validation/index.mjs';

test('validates node lists, including empty lists and duplicate detection', () => {
  expect(validateRoutingNodes([], 'readers')).toEqual([]);
  expect(validateRoutingNodes([{ host: 'a', port: 3306 }, { host: 'b', port: 3307 }], 'readers')).toEqual([
    { host: 'a', port: 3306 }, { host: 'b', port: 3307 },
  ]);
  expect(() => validateRoutingNodes(undefined, 'readers')).toThrow('must be an array');
  expect(() => validateRoutingNodes([{ host: 'a', port: 3306 }, { host: 'a', port: 3306 }], 'readers')).toThrow('duplicate nodes');
});
