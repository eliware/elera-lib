import { expect, test } from "@jest/globals";
import { bundleFields, validateBundleInput } from "../../src/bundle/input.mjs";

test("exports the bundle field list and validates the input boundary", () => {
  expect(bundleFields).toContain("apiVersion");
  expect(validateBundleInput({ apiVersion: "v1" })).toBeUndefined();
  expect(() => validateBundleInput({ unexpected: true })).toThrow("unknown");
});
