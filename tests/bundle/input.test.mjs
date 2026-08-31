import { expect, test } from '@jest/globals';
import { validateBundleInput } from '../../src/bundle/input.mjs';
test('validates bundle input', () => {
  expect(validateBundleInput({})).toBeUndefined();
  expect(() => validateBundleInput()).toThrow('required');
  expect(() => validateBundleInput(null)).toThrow('required');
});
