import { JsonValueError } from "./errors.mjs";
import { assertJsonValue } from "./index.mjs";
import { getObjectValueDescriptors } from "./object-shape.mjs";

export function validateObject(value, path, ancestors, depth) {
  try {
    if (ancestors.has(value)) throw new JsonValueError(`${path} must not contain cyclic values`);
    ancestors.add(value);
    const descriptors = getObjectValueDescriptors(value, path);
    for (const [key, descriptor] of Object.entries(descriptors)) {
      assertJsonValue(descriptor.value, `${path}.${key}`, ancestors, depth + 1);
    }
  } catch (error) {
    if (error instanceof JsonValueError) throw error;
    throw new TypeError(`${path} must contain JSON-compatible values`);
  } finally {
    ancestors.delete(value);
  }
}
