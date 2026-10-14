import { expect, test } from "@jest/globals";
import { validateObject } from "../../../../src/routing/event-contract/json-value/objects.mjs";

test("rejects cycles in nested objects", () => {
  const cycle = {};
  cycle.self = cycle;
  expect(() => validateObject(cycle, "value", new WeakSet(), 0)).toThrow("cyclic");
});
