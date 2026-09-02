import { expect, test } from '@jest/globals';
import * as subject from '../../../src/bundle/input/prototype.mjs';

test('prototype has a focused mirrored test module', () => {
  expect(Object.keys(subject).length).toBeGreaterThan(0);
});
