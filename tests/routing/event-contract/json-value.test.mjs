import { assertJsonValue } from '../../../src/routing/event-contract/json-value.mjs';

test('accepts JSON values and rejects non-JSON objects', () => {
  expect(() => assertJsonValue({ nested: [true, 1, 'ok', null] })).not.toThrow();
  expect(() => assertJsonValue(new Date())).toThrow('JSON-compatible');
  expect(() => assertJsonValue(Number.NaN)).toThrow('JSON-compatible');
  expect(() => assertJsonValue({ get value() { throw new Error('getter failure'); } })).toThrow('JSON-compatible');
});
