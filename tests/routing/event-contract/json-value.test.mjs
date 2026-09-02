import { assertJsonValue } from '../../../src/routing/event-contract/json-value.mjs';

test('accepts JSON values and rejects non-JSON objects', () => {
  expect(() => assertJsonValue({ nested: [true, 1, 'ok', null] })).not.toThrow();
  expect(() => assertJsonValue(new Date())).toThrow('JSON-compatible');
  expect(() => assertJsonValue(Number.NaN)).toThrow('JSON-compatible');
  const symbolValue = {}; symbolValue[Symbol('secret')] = 'hidden';
  expect(() => assertJsonValue(symbolValue)).toThrow('JSON-compatible');
  expect(() => assertJsonValue({ get value() { throw new Error('getter failure'); } })).toThrow('JSON-compatible');
  expect(() => assertJsonValue(new Proxy({}, { ownKeys() { throw new Error('proxy failure'); } }))).toThrow('JSON-compatible');
  const cyclic = {}; cyclic.self = cyclic;
  expect(() => assertJsonValue(cyclic)).toThrow('cyclic');
  const cyclicArray = []; cyclicArray.push(cyclicArray);
  expect(() => assertJsonValue(cyclicArray)).toThrow('JSON-compatible');
  expect(() => assertJsonValue(new Array(1))).toThrow('JSON-compatible');
  let deep = {};
  for (let index = 0; index < 101; index += 1) deep = { nested: deep };
  expect(() => assertJsonValue(deep)).toThrow('nesting depth');
});
