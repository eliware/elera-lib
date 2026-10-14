import { expect, test } from "@jest/globals";
import { validateEventVersion } from "../../../../src/routing/event-contract/envelope/version.mjs";

test("accepts event versions at or above the minimum", () => {
  expect(validateEventVersion(0)).toBeUndefined();
  expect(validateEventVersion(1, "routing topology", 1)).toBeUndefined();
});

test("rejects invalid event versions", () => {
  expect(() => validateEventVersion(-1)).toThrow("non-negative");
  expect(() => validateEventVersion(0, "routing topology", 1)).toThrow("positive");
  expect(() => validateEventVersion(1.5)).toThrow("non-negative");
  expect(() => validateEventVersion("1")).toThrow("non-negative");
});
