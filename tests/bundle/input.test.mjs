import { expect, test } from '@jest/globals';
import { validateBundleInput } from '../../src/bundle/input.mjs';
test('validates bundle input', () => {
  expect(validateBundleInput({})).toBeUndefined();
  expect(() => validateBundleInput()).toThrow('required');
  expect(() => validateBundleInput(null)).toThrow('required');
  expect(() => validateBundleInput([])).toThrow('object');
  expect(() => validateBundleInput({ unexpected: true })).toThrow('unknown');
  expect(() => validateBundleInput(new Date())).toThrow('plain');
});
