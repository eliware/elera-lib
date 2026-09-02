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

test('rejects cloneable values that cannot be JSON serialized', () => {
  expect(() => validateBundle({ value: 1n })).toThrow('JSON-compatible');
});

test('rejects non-finite numbers before JSON serialization can normalize them', () => {
  for (const value of [Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]) {
    expect(() => validateBundle({ value })).toThrow('JSON-compatible');
    expect(() => validateBundle({ nested: { value } })).toThrow('JSON-compatible');
  }
});

test('rejects oversized bundles', () => {
  expect(() => validateBundle({ value: 'x'.repeat(1_048_576) })).toThrow('maximum contract size');
});

test('normalizes serialization and encoding failures', () => {
  const originalStringify = JSON.stringify;
  JSON.stringify = () => { throw new Error('serialization failure'); };
  try { expect(() => validateBundle({})).toThrow('JSON-compatible'); }
  finally { JSON.stringify = originalStringify; }
  const originalEncoder = globalThis.TextEncoder;
  globalThis.TextEncoder = class { encode() { throw new Error('encoding failure'); } };
  try { expect(() => validateBundle({})).toThrow('maximum contract size'); }
  finally { globalThis.TextEncoder = originalEncoder; }
});

test('rejects an undefined serialized value', () => {
  const originalStringify = JSON.stringify;
  JSON.stringify = () => undefined;
  try { expect(() => validateBundle({})).toThrow('JSON-compatible'); }
  finally { JSON.stringify = originalStringify; }
});
