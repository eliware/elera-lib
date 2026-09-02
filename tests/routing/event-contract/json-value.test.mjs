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

test('rejects unsupported primitives and malformed arrays', () => {
  expect(() => assertJsonValue(undefined)).toThrow('JSON-compatible');
  expect(() => assertJsonValue(Symbol('x'))).toThrow('JSON-compatible');
  expect(() => assertJsonValue(() => {})).toThrow('JSON-compatible');
  const array = [1];
  Object.defineProperty(array, 'extra', { value: 1, enumerable: false });
  expect(() => assertJsonValue(array)).toThrow('JSON-compatible');
  const accessor = [];
  Object.defineProperty(accessor, '0', { get() { throw new Error('getter'); }, enumerable: true });
  expect(() => assertJsonValue(accessor)).toThrow('JSON-compatible');
});

test('covers array descriptor and object prototype failures', () => {
  const array = [1];
  Object.defineProperty(array, '0', { get() { return 1; }, enumerable: true });
  expect(() => assertJsonValue(array)).toThrow('JSON-compatible');
  expect(() => assertJsonValue(Object.create({ inherited: true }))).toThrow('JSON-compatible');
  const extra = [1]; extra.foo = 1;
  expect(() => assertJsonValue(extra)).toThrow('JSON-compatible');
  expect(() => assertJsonValue(new Proxy([], { ownKeys() { throw new Error('descriptor failure'); } }))).toThrow('JSON-compatible');
});
