import { expect, test } from '@jest/globals';
import * as lifecycle from '../../../../src/routing/event-contract/lifecycle/index.mjs';
test('exports lifecycle validators', () => {
  expect(lifecycle.validateContextEvent).toBeDefined();
  expect(lifecycle.validateShutdownEvent).toBeDefined();
});
