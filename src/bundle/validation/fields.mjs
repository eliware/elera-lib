export function assertBundleFields(bundle) {
  if (
    Reflect.ownKeys(bundle).some(
      (key) => typeof key !== "string" || !Object.prototype.propertyIsEnumerable.call(bundle, key),
    )
  )
    throw new TypeError("routing bundle field is unknown");
}
