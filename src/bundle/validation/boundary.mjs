import { assertJsonValue } from '../../routing/event-contract/json-value.mjs';

export function detachAndLimitBundle(bundle) {
  if (Reflect.ownKeys(bundle).some((key) => typeof key !== 'string' || !Object.prototype.propertyIsEnumerable.call(bundle, key))) throw new TypeError('routing bundle field is unknown');
  assertJsonValue(bundle, 'routing bundle');
  let normalized;
  try { normalized = structuredClone(bundle); }
  catch { throw new TypeError('routing bundle must contain cloneable JSON-compatible values'); }
  assertJsonValue(normalized);
  let serialized;
  try { serialized = JSON.stringify(normalized); }
  catch { throw new TypeError('routing bundle must contain JSON-compatible values'); }
  if (serialized === undefined) throw new TypeError('routing bundle must contain JSON-compatible values');
  let serializedSize;
  try { serializedSize = new TextEncoder().encode(serialized).length; }
  catch { throw new TypeError('routing bundle exceeds the maximum contract size'); }
  if (serializedSize > 1_048_576) throw new TypeError('routing bundle exceeds the maximum contract size');
  return normalized;
}
