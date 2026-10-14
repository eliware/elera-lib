import { assertPlainBundle } from "./prototype.mjs";
import { assertBundleFields, bundleFields } from "./fields.mjs";
import { assertBundleObject } from "./shape.mjs";

export { bundleFields };

export function validateBundleInput(bundle) {
  // codescope ignore: bounded detachment is transport/application policy; this shared helper only validates the detached contract shape.
  assertBundleObject(bundle);
  assertPlainBundle(bundle);
  assertBundleFields(bundle);
}
