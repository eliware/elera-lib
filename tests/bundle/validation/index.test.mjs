import { expect, test } from '@jest/globals';
import * as subject from '../../../src/bundle/validation/index.mjs';

test('index has a focused mirrored test module', () => {
  expect(Object.keys(subject).length).toBeGreaterThan(0);
});
