import { expect, test } from '@jest/globals';
import { validateBundle } from '../../src/bundle/index.mjs';
test('exports bundle validation', () => expect(validateBundle).toBeDefined());
