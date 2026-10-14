import { expect, test } from "@jest/globals";
import { assertUniqueAvailabilityNodes } from "../../../../../src/routing/event-contract/topology/nodes/duplicates.mjs";

test("accepts unique availability node IDs", () => {
  expect(assertUniqueAvailabilityNodes([{ nodeId: "a" }, { nodeId: "b" }])).toBeUndefined();
});

test("rejects duplicate availability node IDs", () => {
  expect(() => assertUniqueAvailabilityNodes([{ nodeId: "a" }, { nodeId: "a" }])).toThrow(
    "duplicate nodeId",
  );
});
