import { JsonValueError } from "./errors.mjs";
import { assertJsonValue } from "./index.mjs";
import { getArrayValueDescriptors } from "./array-shape.mjs";

export function validateArray(value, path, ancestors, depth) {
  if (ancestors.has(value))
    throw new JsonValueError(
      `${path} must not contain cyclic values. JSON-compatible values are acyclic`,
    );
  try {
    ancestors.add(value);
    const { descriptors, length } = getArrayValueDescriptors(value, path);
    for (let index = 0; index < length; index += 1) {
      const descriptor = descriptors[index];
      assertJsonValue(descriptor.value, `${path}[${index}]`, ancestors, depth + 1);
    }
  } catch (error) {
    if (error instanceof JsonValueError) throw error;
    throw new TypeError(`${path} must contain JSON-compatible values`);
  } finally {
    ancestors.delete(value);
  }
}
