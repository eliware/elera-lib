import { validateBundlePorts as validate } from "./ports/index.mjs";

export function validateBundlePorts(input) {
  return validate(input);
}
