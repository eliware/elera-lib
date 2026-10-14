import { assertJsonValue } from "../../routing/event-contract/json-value/index.mjs";

export function detachBundle(bundle) {
  assertJsonValue(bundle, "routing bundle");
  let normalized;
  try {
    normalized = structuredClone(bundle);
  } catch {
    throw new TypeError("routing bundle must contain cloneable JSON-compatible values");
  }
  assertJsonValue(normalized);
  return normalized;
}
