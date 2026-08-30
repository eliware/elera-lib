import { expect, test } from '@jest/globals';
import * as api from '../../src/index.mjs';

test('exports only the shared public helpers', () => {
  for (const name of ['validateBundle', 'validateRoutingEvent']) {
    expect(api[name]).toBeDefined();
  }
  for (const name of ['createDb', 'createDbFromBundle']) {
    expect(api[name]).toBeUndefined();
  }
});

test('exports shared policy helpers', () => {
});
