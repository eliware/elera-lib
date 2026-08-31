import { expect, test } from '@jest/globals';
import { validateBundleDatabaseFields } from '../../../src/bundle/fields/database.mjs';
test('validates database fields', () => {
  expect(validateBundleDatabaseFields({ database: 'logical', physicalDatabase: 'physical' })).toBeUndefined();
  expect(() => validateBundleDatabaseFields({ database: 'logical' })).toThrow('physicalDatabase');
  expect(() => validateBundleDatabaseFields({ database: 'logical', physicalDatabase: 'physical', databaseId: '' })).toThrow('databaseId');
});
