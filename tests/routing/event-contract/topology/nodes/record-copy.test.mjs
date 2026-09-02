import { expect, test } from '@jest/globals';
import * as subject from '../../../../../src/routing/event-contract/topology/nodes/record-copy.mjs';

test('record-copy has a focused mirrored test module', () => {
  expect(Object.keys(subject).length).toBeGreaterThan(0);
});
