import { expect, test } from '@jest/globals';
import { validateBundleVersion } from '../../../src/bundle/fields/version.mjs';
test('validates bundle version', () => {
  expect(validateBundleVersion({ bundleVersion: 1 })).toBeUndefined();
  expect(validateBundleVersion({ bundleVersion: '1' })).toBeUndefined();
  expect(() => validateBundleVersion({})).toThrow('bundleVersion');
  expect(() => validateBundleVersion({ bundleVersion: NaN })).toThrow('bundleVersion');
  expect(() => validateBundleVersion({ bundleVersion: Infinity })).toThrow('bundleVersion');
  expect(() => validateBundleVersion({ bundleVersion: -1 })).toThrow('bundleVersion');
});
