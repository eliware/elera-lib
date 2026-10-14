import { expect, test } from "@jest/globals";
import { validateArray } from "../../../../src/routing/event-contract/json-value/arrays.mjs";

test("rejects cycles in nested arrays", () => {
  const cycle = [];
  cycle.push(cycle);
  expect(() => validateArray(cycle, "value", new WeakSet(), 0)).toThrow("cyclic");
});
