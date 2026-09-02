import { expect, test } from '@jest/globals';
import * as subject from '../../../../src/routing/event-contract/envelope/rules.mjs';

test('rules has a focused mirrored test module', () => {
  expect(Object.keys(subject).length).toBeGreaterThan(0);
});
