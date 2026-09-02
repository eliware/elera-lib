import { expect, test } from '@jest/globals';
import { requiredText } from '../../../src/bundle/fields/required-text.mjs';

test('validates required text', () => {
  expect(requiredText('value', 'field')).toBeUndefined();
  expect(() => requiredText('  ', 'field')).toThrow('field');
});
