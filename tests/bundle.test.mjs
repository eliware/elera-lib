import { expect, test } from '@jest/globals';
import { validateBundle } from '../src/bundle.mjs';
test('compatibility bundle entrypoint exports validation', () => expect(validateBundle).toBeDefined());
