import { validateBundle as validate } from "./validation/index.mjs";

export function validateBundle(input, options) {
  return validate(input, options);
}
