import { assertJsonValue } from '../json-value.mjs';

export function detachEventPayload(values) {
  for (const [key, value] of Object.entries(values)) if (value === undefined || typeof value === 'symbol' || typeof value === 'function') throw new TypeError(`routing event.${key} must contain JSON-compatible values`);
  assertJsonValue(values, 'routing event');
  let snapshot;
  try { snapshot = structuredClone(values); } catch { throw new TypeError('unsupported routing event'); }
  assertJsonValue(snapshot);
  let serialized;
  try { serialized = JSON.stringify(snapshot); } catch { throw new TypeError('unsupported routing event'); }
  if (serialized === undefined) throw new TypeError('unsupported routing event');
  let size;
  try { size = new TextEncoder().encode(serialized).length; } catch { throw new TypeError('routing event exceeds the maximum contract size'); }
  if (size > 1_048_576) throw new TypeError('routing event exceeds the maximum contract size');
  return snapshot;
}
