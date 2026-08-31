import { expect, test } from '@jest/globals';
import { validateBundleApplicationFields } from '../../../src/bundle/fields/application.mjs';
test('validates application fields', () => {
  expect(validateBundleApplicationFields({ application: 'app' })).toBeUndefined();
  expect(() => validateBundleApplicationFields({ application: '' })).toThrow('application');
  expect(() => validateBundleApplicationFields({ application: 'app', applicationId: '' })).toThrow('applicationId');
});
