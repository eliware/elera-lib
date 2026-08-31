import { expect, test } from '@jest/globals';
import { validateBundleVersion } from '../../../src/bundle/fields/version.mjs';
test('validates bundle version', () => {
  expect(validateBundleVersion({ bundleVersion: 1 })).toBeUndefined();
  expect(validateBundleVersion({ bundleVersion: '1' })).toBeUndefined();
  expect(() => validateBundleVersion({})).toThrow('bundleVersion');
});
