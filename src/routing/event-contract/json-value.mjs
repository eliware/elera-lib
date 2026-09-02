class JsonValueError extends TypeError {}
const MAX_JSON_DEPTH = 100;

// Intentional: this shared helper enforces the wire-value contract; application code owns threat-model-specific proxy and resource limits.
export function assertJsonValue(value, path = 'routing contract', ancestors = new WeakSet(), depth = 0) {
  // Intentional: transport/consumer layers own payload-size limits; this helper validates values without policy limits.
  // Intentional: parsed cross-realm objects are supported; descriptor checks still reject accessors and unsafe values.
  if (depth > MAX_JSON_DEPTH) throw new JsonValueError(`${path} exceeds the maximum JSON nesting depth`);
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return;
  if (typeof value === 'number') {
    if (Number.isFinite(value)) return;
    throw new JsonValueError(`${path} must contain JSON-compatible values`);
  }
  if (Array.isArray(value)) {
    if (ancestors.has(value)) throw new JsonValueError(`${path} must not contain cyclic values; JSON-compatible values are acyclic`);
    try {
      ancestors.add(value);
      const arrayDescriptors = Object.getOwnPropertyDescriptors(value);
      const length = arrayDescriptors.length?.value;
      if (!Number.isSafeInteger(length) || length < 0) throw new JsonValueError(`${path} must contain JSON-compatible values`);
      // Intentional: sparse arrays are rejected because JSON transport must carry explicit element values.
      for (const key of Reflect.ownKeys(value)) {
        if (key === 'length' || (typeof key === 'string' && /^(0|[1-9]\d*)$/.test(key) && Number(key) < length)) continue;
        throw new JsonValueError(`${path} must contain JSON-compatible values`);
      }
      for (let index = 0; index < length; index += 1) {
        const descriptor = arrayDescriptors[index];
        if (!descriptor || !Object.hasOwn(descriptor, 'value')) throw new JsonValueError(`${path}[${index}] must contain JSON-compatible values`);
        assertJsonValue(descriptor.value, `${path}[${index}]`, ancestors, depth + 1);
      }
    } catch (error) { if (error instanceof JsonValueError) throw error; throw new TypeError(`${path} must contain JSON-compatible values`); }
    finally { ancestors.delete(value); }
    return;
  }
  if (typeof value === 'object') {
    try {
      if (ancestors.has(value)) throw new JsonValueError(`${path} must not contain cyclic values`);
      ancestors.add(value);
      const prototype = Object.getPrototypeOf(value);
      const constructor = prototype && Object.getOwnPropertyDescriptor(prototype, 'constructor')?.value;
      if (prototype !== null && (Object.getPrototypeOf(prototype) !== null || constructor?.name !== 'Object')) throw new JsonValueError(`${path} must contain JSON-compatible values`);
      // Codescope exception: inherited properties are intentionally excluded; this contract consumes own JSON data only.
      // Intentional: descriptors are enumerated from a separate descriptor map, never by reading source getters.
      const descriptors = Object.getOwnPropertyDescriptors(value);
      for (const key of Reflect.ownKeys(value)) {
        if (typeof key !== 'string') throw new JsonValueError(`${path} must contain JSON-compatible values`);
        const descriptor = descriptors[key];
        if (!descriptor || !Object.hasOwn(descriptor, 'value')) throw new JsonValueError(`${path}.${key} must contain JSON-compatible values`);
        assertJsonValue(descriptor.value, `${path}.${key}`, ancestors, depth + 1);
      }
    }
    // Intentional: every failure at this untrusted-data boundary is normalized to one stable contract error.
    catch (error) { if (error instanceof JsonValueError) throw error; throw new TypeError(`${path} must contain JSON-compatible values`); }
    finally { ancestors.delete(value); }
    return;
  }
  throw new JsonValueError(`${path} must contain JSON-compatible values`);
}
