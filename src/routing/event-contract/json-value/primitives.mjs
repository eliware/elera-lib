import { JsonValueError } from './errors.mjs';

export function validatePrimitive(value, path) {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return true;
  if (typeof value === 'number') {
    if (Number.isFinite(value)) return true;
    throw new JsonValueError(`${path} must contain JSON-compatible values`);
  }
  return false;
}
