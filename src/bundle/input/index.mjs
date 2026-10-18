import { assertPlainBundle } from "./prototype.mjs";
import { assertBundleFields, bundleFields } from "./fields.mjs";
import { assertBundleObject } from "./shape.mjs";

export { bundleFields };

export function validateBundleInput(bundle) {
  // codescope ignore: bounded detachment belongs to transport policy. This helper checks the detached contract shape.
  assertBundleObject(bundle);
  assertPlainBundle(bundle);
  assertBundleFields(bundle);
}
