import { expect, test } from '@jest/globals';
import { validateBundleFields } from '../../../src/bundle/fields/index.mjs';
test('exports bundle field validation', () => expect(validateBundleFields).toBeDefined());
