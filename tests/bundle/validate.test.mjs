import { expect, test } from '@jest/globals';
import { validateBundle } from '../../src/bundle/validate.mjs';
test('rejects missing bundles', () => expect(() => validateBundle()).toThrow('required'));
