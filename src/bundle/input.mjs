import { validateBundleInput as validate } from "./input/index.mjs";
import { bundleFields } from "./input/index.mjs";

export { bundleFields };

export function validateBundleInput(input) {
  return validate(input);
}
