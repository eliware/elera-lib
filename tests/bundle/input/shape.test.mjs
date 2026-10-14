import { expect, test } from "@jest/globals";
import { assertBundleObject } from "../../../src/bundle/input/shape.mjs";

test("accepts object bundles", () => {
  expect(assertBundleObject({})).toBeUndefined();
});

test("rejects missing and non-object bundles", () => {
  expect(() => assertBundleObject()).toThrow("required");
  expect(() => assertBundleObject(null)).toThrow("required");
  expect(() => assertBundleObject([])).toThrow("object");
  expect(() => assertBundleObject("bundle")).toThrow("required");
});
