import { expect, test } from '@jest/globals';
import { validateBundleRoutes } from '../../src/bundle/routes.mjs';
test('orchestrates bundle route validation', () => {
  expect(() => validateBundleRoutes({ routes: { primary: [], balanced: [] }, writer: { host: 'w', port: 1 }, failover: [], readers: [] })).not.toThrow();
});
