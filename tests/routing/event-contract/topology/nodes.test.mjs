import { expect, test } from "@jest/globals";
import { validateTopologyNodes } from "../../../../src/routing/event-contract/topology/nodes.mjs";
test("accepts an empty list and rejects invalid list shapes", () => {
  expect(validateTopologyNodes([])).toEqual([]);
  expect(() => validateTopologyNodes(null)).toThrow("nodes are required");
  expect(() => validateTopologyNodes({})).toThrow("nodes are required");
  expect(() => validateTopologyNodes([null])).toThrow("record");
  expect(() => validateTopologyNodes(Array(1))).toThrow("JSON-compatible");
  const extraProperty = [];
  extraProperty.extra = true;
  expect(() => validateTopologyNodes(extraProperty)).toThrow("JSON-compatible");
});

test("rejects duplicate node identifiers", () => {
  const node = { nodeId: "n", address: "a", sqlPort: 1, state: "ready", draining: false };
  expect(() => validateTopologyNodes([node, { ...node }])).toThrow("duplicate nodeId");
});
