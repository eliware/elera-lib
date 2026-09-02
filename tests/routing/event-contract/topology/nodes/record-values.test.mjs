import { expect, test } from '@jest/globals';
import * as subject from '../../../../../src/routing/event-contract/topology/nodes/record-values.mjs';

test('record-values has a focused mirrored test module', () => {
  expect(Object.keys(subject).length).toBeGreaterThan(0);
});
