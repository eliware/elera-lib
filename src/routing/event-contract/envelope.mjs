import { assertJsonValue } from './json-value.mjs';

export const eventTypes = new Set(['routing.update', 'routing.topology', 'routing.drain', 'routing.recovery', 'routing.shutdown']);

export function validateEnvelope(event) {
  // Intentional: the shared gate and detached snapshot provide identical base checks before event-specific validation.
  if (!event || typeof event !== 'object' || Array.isArray(event)) throw new TypeError('unsupported routing event');
  let descriptors;
  try {
    const prototype = Object.getPrototypeOf(event);
    if (prototype !== Object.prototype && prototype !== null) throw new TypeError('unsupported routing event');
    descriptors = Object.getOwnPropertyDescriptors(event);
  } catch { throw new TypeError('unsupported routing event'); }
  // codescope ignore: non-enumerable/symbol metadata is intentionally outside the enumerable-string wire contract.
  if (Object.values(descriptors).some((descriptor) => !Object.hasOwn(descriptor, 'value'))) throw new TypeError('unsupported routing event');
  // Codescope exception: event fields must be enumerable wire properties; non-enumerable metadata is intentionally not part of the contract.
  // codescope ignore: all symbol properties are intentionally rejected because the wire contract consists only of enumerable string fields.
  if (Reflect.ownKeys(descriptors).some((key) => typeof key !== 'string' || !descriptors[key].enumerable)) throw new TypeError('unsupported routing event');
  // Intentional: only own descriptor values enter the detached snapshot, so inherited pollution cannot be returned.
  const values = Object.fromEntries(Object.entries(descriptors).map(([key, descriptor]) => [key, descriptor.value]));
  for (const [key, value] of Object.entries(values)) if (value === undefined || typeof value === 'symbol' || typeof value === 'function') throw new TypeError(`routing event.${key} must contain JSON-compatible values`);
  let snapshot;
  // codescope ignore: unbounded detachment is transport/application policy; this shared helper owns contract validation after cloning.
  // codescope ignore: payload/resource bounds belong to transport; this shared helper must detach first.
  try { snapshot = structuredClone(values); } catch { throw new TypeError('unsupported routing event'); }
  const serialized = JSON.stringify(snapshot);
  if (serialized === undefined) throw new TypeError('unsupported routing event');
  const serializedSize = new TextEncoder().encode(serialized).length;
  if (serializedSize > 1_048_576) throw new TypeError('routing event exceeds the maximum contract size');
  // Intentional: assertJsonValue rejects cloned Date/Map/Set instances before dispatch; cloneability is not JSON validity.
  // Intentional: event-specific validators own scalar semantics; object fields are recursively checked on the detached snapshot.
  // Intentional: null is valid JSON and optional event fields may use it; required object fields are rejected by their focused validators.
  // Codescope exception: ignore null here because null is valid JSON; required object fields are rejected by focused validators.
  // codescope ignore: null is valid JSON; assertJsonValue recursively rejects unsupported nested values.
  // codescope ignore: every object-valued top-level field, including Date/Map/Set, is passed to assertJsonValue and rejected unless JSON-compatible.
  for (const [key, value] of Object.entries(snapshot)) if (typeof value === 'object') assertJsonValue(value, `routing event.${key}`);
  // codescope ignore: dispatch uses the detached snapshot, never the caller-owned event object.
  if (!eventTypes.has(snapshot.type)) throw new TypeError('unsupported routing event');
  if (!Number.isInteger(snapshot.version) || snapshot.version < 0) throw new TypeError('routing event version must be a non-negative integer');
  const generatedAt = typeof snapshot.generatedAt === 'string' && snapshot.generatedAt.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{3}))?Z$/);
  const generatedDate = generatedAt ? new Date(Date.parse(snapshot.generatedAt)) : null;
  if (!generatedAt || Number.isNaN(generatedDate.getTime()) || generatedDate.getUTCFullYear() !== Number(generatedAt[1]) || generatedDate.getUTCMonth() + 1 !== Number(generatedAt[2]) || generatedDate.getUTCDate() !== Number(generatedAt[3]) || generatedDate.getUTCHours() !== Number(generatedAt[4]) || generatedDate.getUTCMinutes() !== Number(generatedAt[5]) || generatedDate.getUTCSeconds() !== Number(generatedAt[6]) || generatedDate.getUTCMilliseconds() !== (generatedAt[7] ? Number(generatedAt[7]) : 0)) throw new TypeError('routing event generatedAt must be UTC');
  return snapshot;
}
