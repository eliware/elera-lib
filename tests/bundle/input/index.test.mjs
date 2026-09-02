import { expect, test } from '@jest/globals';
import * as subject from '../../../src/bundle/input/index.mjs';

test('index has a focused mirrored test module', () => {
  expect(Object.keys(subject).length).toBeGreaterThan(0);
});
