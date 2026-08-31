import { expect, test } from '@jest/globals';
import { validateRoutingNode, validateRoutingNodes } from '../../src/routing/node-validation.mjs';
test('compatibility node entrypoint exports validators', () => {
  expect(validateRoutingNode).toBeDefined();
  expect(validateRoutingNodes).toBeDefined();
});
