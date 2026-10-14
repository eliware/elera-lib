import { expect, test } from "@jest/globals";
import { getArrayValueDescriptors } from "../../../../src/routing/event-contract/json-value/array-shape.mjs";

test("returns descriptors for dense arrays", () => {
  expect(getArrayValueDescriptors(["a", "b"], "value").length).toBe(2);
});

test("rejects sparse, accessor, and extended arrays", () => {
  expect(() => getArrayValueDescriptors(Array(1), "value")).toThrow("JSON-compatible");
  const accessor = Object.defineProperty([], "0", { get: () => 1, enumerable: true });
  accessor.length = 1;
  expect(() => getArrayValueDescriptors(accessor, "value")).toThrow("JSON-compatible");
  const extra = [1];
  extra.note = true;
  expect(() => getArrayValueDescriptors(extra, "value")).toThrow("JSON-compatible");
});
