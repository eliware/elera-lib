import { expect, test } from '@jest/globals';
import * as subject from '../../../../src/routing/node-validation/node/descriptors.mjs';

test('descriptors has a focused mirrored test module', () => {
  expect(Object.keys(subject).length).toBeGreaterThan(0);
});
