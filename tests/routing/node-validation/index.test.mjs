import { expect, test } from '@jest/globals';
import * as validation from '../../../src/routing/node-validation/index.mjs';
test('exports node validators', () => {
  expect(validation.validateRoutingNode).toBeDefined();
  expect(validation.validateRoutingNodes).toBeDefined();
});
