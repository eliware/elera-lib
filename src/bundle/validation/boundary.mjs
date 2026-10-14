import { assertBundleSize } from "./size-limit.mjs";
import { assertBundleFields } from "./fields.mjs";
import { detachBundle } from "./copy.mjs";

export function detachAndLimitBundle(bundle) {
  assertBundleFields(bundle);
  const normalized = detachBundle(bundle);
  assertBundleSize(normalized);
  return normalized;
}
