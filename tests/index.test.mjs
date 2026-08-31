import { expect, test } from '@jest/globals';
import * as api from '../src/index.mjs';

test('exports only the public validation API', () => {
  expect(api.validateBundle).toBeDefined();
  expect(api.validateRoutingEvent).toBeDefined();
  expect(api.createDb).toBeUndefined();
  expect(api.createDbFromBundle).toBeUndefined();
});
