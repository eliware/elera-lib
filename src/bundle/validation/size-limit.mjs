export function assertBundleSize(bundle) {
  let serialized;
  try {
    serialized = JSON.stringify(bundle);
  } catch {
    throw new TypeError("routing bundle must contain JSON-compatible values");
  }
  if (serialized === undefined)
    throw new TypeError("routing bundle must contain JSON-compatible values");
  let size;
  try {
    size = new TextEncoder().encode(serialized).length;
  } catch {
    throw new TypeError("routing bundle exceeds the maximum contract byte count");
  }
  if (size > 1_048_576)
    throw new TypeError("routing bundle exceeds the maximum contract byte count");
}
