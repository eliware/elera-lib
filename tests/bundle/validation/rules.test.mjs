import { expect, test } from '@jest/globals';
import * as subject from '../../../src/bundle/validation/rules.mjs';

test('rules has a focused mirrored test module', () => {
  expect(Object.keys(subject).length).toBeGreaterThan(0);
});
