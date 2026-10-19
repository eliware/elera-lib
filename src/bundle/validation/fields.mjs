import { bundleFields } from "../input.mjs";

const bundleFieldSet = new Set(bundleFields);

export function assertBundleFields(bundle) {
  if (
    Reflect.ownKeys(bundle).some(
      (key) =>
        typeof key !== "string" ||
        !bundleFieldSet.has(key) ||
        !Object.prototype.propertyIsEnumerable.call(bundle, key),
    )
  )
    throw new TypeError("routing bundle field is unknown");
}
