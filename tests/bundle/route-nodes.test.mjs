import { expect, test } from '@jest/globals';
import { validateBundleRouteNodes } from '../../src/bundle/route-nodes.mjs';
test('validates bundle route nodes', () => {
  expect(validateBundleRouteNodes({ routes: { primary: [], balanced: [] } })).toBeUndefined();
  expect(() => validateBundleRouteNodes({ routes: { primary: [], balanced: 'bad' } })).toThrow('balanced');
});
