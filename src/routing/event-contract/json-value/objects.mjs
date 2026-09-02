import { JsonValueError } from './errors.mjs';
import { assertJsonValue } from './index.mjs';

export function validateObject(value, path, ancestors, depth) {
  try {
    if (ancestors.has(value)) throw new JsonValueError(`${path} must not contain cyclic values`);
    ancestors.add(value);
    const prototype = Object.getPrototypeOf(value);
    const constructor = prototype && Object.getOwnPropertyDescriptor(prototype, 'constructor')?.value;
    if (prototype !== null && (Object.getPrototypeOf(prototype) !== null || constructor?.name !== 'Object')) throw new JsonValueError(`${path} must contain JSON-compatible values`);
    const descriptors = Object.getOwnPropertyDescriptors(value);
    for (const key of Reflect.ownKeys(value)) {
      if (typeof key !== 'string') throw new JsonValueError(`${path} must contain JSON-compatible values`);
      const descriptor = descriptors[key];
      if (!descriptor || !Object.hasOwn(descriptor, 'value')) throw new JsonValueError(`${path}.${key} must contain JSON-compatible values`);
      assertJsonValue(descriptor.value, `${path}.${key}`, ancestors, depth + 1);
    }
  } catch (error) {
    if (error instanceof JsonValueError) throw error;
    throw new TypeError(`${path} must contain JSON-compatible values`);
  } finally { ancestors.delete(value); }
}
