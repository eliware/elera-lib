import { JsonValueError } from "./errors.mjs";

export function getArrayValueDescriptors(value, path) {
  try {
    const descriptors = Object.getOwnPropertyDescriptors(value);
    const length = descriptors.length.value;
    for (const key of Reflect.ownKeys(value)) {
      if (
        key === "length" ||
        (typeof key === "string" && /^(0|[1-9]\d*)$/.test(key) && Number(key) < length)
      )
        continue;
      throw new JsonValueError(`${path} must contain JSON-compatible values`);
    }
    for (let index = 0; index < length; index += 1) {
      const descriptor = descriptors[index];
      if (!descriptor || !Object.hasOwn(descriptor, "value"))
        throw new JsonValueError(`${path}[${index}] must contain JSON-compatible values`);
    }
    return { descriptors, length };
  } catch (error) {
    if (error instanceof JsonValueError) throw error;
    throw new TypeError(`${path} must contain JSON-compatible values`);
  }
}
