import { expect, test } from '@jest/globals';
import { validateBundleEndpointNodes } from '../../src/bundle/endpoint-nodes.mjs';
test('validates bundle endpoint nodes', () => {
  const bundle = { writer: { host: 'w', port: 1 }, failover: [], readers: [] };
  expect(validateBundleEndpointNodes(bundle)).toBeUndefined();
  expect(() => validateBundleEndpointNodes({ ...bundle, failover: [{ host: 'w', port: 1 }] })).toThrow('duplicates writer');
});
