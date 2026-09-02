import { expect, test } from '@jest/globals';
import * as subject from '../../../../src/routing/event-contract/json-value/primitives.mjs';

test('primitives has a focused mirrored test module', () => {
  expect(Object.keys(subject).length).toBeGreaterThan(0);
});
