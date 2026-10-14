import { expect, test } from "@jest/globals";
import { assertBundleFields } from "../../../src/bundle/validation/fields.mjs";

test("accepts enumerable string fields", () => {
  expect(() => assertBundleFields({ apiVersion: "1" })).not.toThrow();
});

test("rejects hidden fields and symbol keys", () => {
  const hidden = {};
  Object.defineProperty(hidden, "secret", { value: true });
  expect(() => assertBundleFields(hidden)).toThrow("field is unknown");
  expect(() => assertBundleFields({ [Symbol("secret")]: true })).toThrow("field is unknown");
});
