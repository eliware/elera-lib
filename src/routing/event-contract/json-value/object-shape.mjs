import { JsonValueError } from "./errors.mjs";

export function getObjectValueDescriptors(value, path) {
  try {
    const prototype = Object.getPrototypeOf(value);
    const constructor =
      prototype && Object.getOwnPropertyDescriptor(prototype, "constructor")?.value;
    if (
      prototype !== null &&
      (Object.getPrototypeOf(prototype) !== null || constructor?.name !== "Object")
    )
      throw new JsonValueError(`${path} must contain JSON-compatible values`);
    const descriptors = Object.getOwnPropertyDescriptors(value);
    for (const key of Reflect.ownKeys(value)) {
      const descriptor = descriptors[key];
      if (typeof key !== "string" || !descriptor || !Object.hasOwn(descriptor, "value"))
        throw new JsonValueError(`${path} must contain JSON-compatible values`);
    }
    return descriptors;
  } catch (error) {
    if (error instanceof JsonValueError) throw error;
    throw new TypeError(`${path} must contain JSON-compatible values`);
  }
}
