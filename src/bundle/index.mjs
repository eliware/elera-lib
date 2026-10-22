import { validateBundle as validate } from "./validation/index.mjs";
import { validateWithLogging } from "../logging.mjs";

export function validateBundle(input, options = {}) {
  return validateWithLogging(
    options.logger,
    "validateBundle",
    () => validate(input),
    (bundle) => ({ bundleVersion: bundle.bundleVersion }),
  );
}
