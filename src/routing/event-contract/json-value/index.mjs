import { JsonValueError, MAX_JSON_DEPTH } from './errors.mjs';
import { validatePrimitive } from './primitives.mjs';
import { validateArray } from './arrays.mjs';
import { validateObject } from './objects.mjs';

export { JsonValueError } from './errors.mjs';

export function assertJsonValue(value, path = 'routing contract', ancestors = new WeakSet(), depth = 0) {
  if (depth > MAX_JSON_DEPTH) throw new JsonValueError(`${path} exceeds the maximum JSON nesting depth`);
  if (validatePrimitive(value, path)) return;
  if (Array.isArray(value)) { validateArray(value, path, ancestors, depth); return; }
  if (typeof value === 'object') { validateObject(value, path, ancestors, depth); return; }
  throw new JsonValueError(`${path} must contain JSON-compatible values`);
}
