export function assertBundleObject(bundle) {
  if (!bundle || typeof bundle !== "object") throw new TypeError("routing bundle is required");
  if (Array.isArray(bundle)) throw new TypeError("routing bundle must be an object");
}
