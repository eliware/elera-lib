import { expect, test } from '@jest/globals';
import { validateBundleIdentityFields } from '../../../src/bundle/fields/identity.mjs';
test('validates identity fields', () => {
  expect(validateBundleIdentityFields({ identity: 'runtime', nodeIdentity: 'node' })).toBeUndefined();
  expect(() => validateBundleIdentityFields({ identity: 'runtime' })).toThrow('nodeIdentity');
  expect(() => validateBundleIdentityFields({ identity: 'runtime', nodeIdentity: 'node', identityId: '' })).toThrow('identityId');
});
