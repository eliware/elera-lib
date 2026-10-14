import { expect, test } from "@jest/globals";
import { validatePrimitive } from "../../../../src/routing/event-contract/json-value/primitives.mjs";

test("accepts JSON primitive values", () => {
  for (const value of [null, "text", true, false, 0, 1.5])
    expect(validatePrimitive(value, "value")).toBe(true);
});

test("rejects non-finite numbers and marks non-primitives", () => {
  expect(() => validatePrimitive(Number.NaN, "value")).toThrow("JSON-compatible");
  expect(validatePrimitive({}, "value")).toBe(false);
  expect(validatePrimitive(undefined, "value")).toBe(false);
});
