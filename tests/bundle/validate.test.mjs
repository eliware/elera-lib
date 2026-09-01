import { expect, test } from '@jest/globals';
import { validateBundle } from '../../src/bundle/validate.mjs';
test('rejects missing bundles', () => {
  expect(() => validateBundle()).toThrow('required');
  expect(() => validateBundle({ get apiVersion() { throw new Error('getter failure'); } })).toThrow('JSON-compatible');
});

test('normalizes unexpected clone failures', () => {
  const originalClone = globalThis.structuredClone;
  globalThis.structuredClone = () => { throw new Error('clone failure'); };
  try { expect(() => validateBundle({})).toThrow('cloneable JSON-compatible'); }
  finally { globalThis.structuredClone = originalClone; }
});
