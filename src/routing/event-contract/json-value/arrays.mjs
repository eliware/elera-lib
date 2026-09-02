import { JsonValueError } from './errors.mjs';
import { assertJsonValue } from './index.mjs';

export function validateArray(value, path, ancestors, depth) {
  if (ancestors.has(value)) throw new JsonValueError(`${path} must not contain cyclic values; JSON-compatible values are acyclic`);
  try {
    ancestors.add(value);
    const descriptors = Object.getOwnPropertyDescriptors(value);
    const length = descriptors.length.value;
    for (const key of Reflect.ownKeys(value)) {
      if (key === 'length' || (typeof key === 'string' && /^(0|[1-9]\d*)$/.test(key) && Number(key) < length)) continue;
      throw new JsonValueError(`${path} must contain JSON-compatible values`);
    }
    for (let index = 0; index < length; index += 1) {
      const descriptor = descriptors[index];
      if (!descriptor || !Object.hasOwn(descriptor, 'value')) throw new JsonValueError(`${path}[${index}] must contain JSON-compatible values`);
      assertJsonValue(descriptor.value, `${path}[${index}]`, ancestors, depth + 1);
    }
  } catch (error) {
    if (error instanceof JsonValueError) throw error;
    throw new TypeError(`${path} must contain JSON-compatible values`);
  } finally { ancestors.delete(value); }
}
