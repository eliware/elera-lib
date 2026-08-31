import { expect, test } from '@jest/globals';
import { validateBundleApiVersion } from '../../src/bundle/api-version.mjs';
test('validates bundle API version', () => {
  expect(validateBundleApiVersion({ apiVersion: 'v1' })).toBeUndefined();
  expect(() => validateBundleApiVersion({ apiVersion: 'v2' })).toThrow('apiVersion');
});
