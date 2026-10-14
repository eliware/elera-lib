import { expect, test } from "@jest/globals";
import { validateTopologyShape } from "../../../../src/routing/event-contract/topology/shape.mjs";

test("accepts a topology with only its nodes field", () => {
  expect(() => validateTopologyShape({ topology: { nodes: [] } })).not.toThrow();
});

test("requires an object topology and its nodes field", () => {
  for (const topology of [null, undefined, [], "invalid"])
    expect(() => validateTopologyShape({ topology })).toThrow("topology is required");
  expect(() => validateTopologyShape({ topology: {} })).toThrow("nodes are required");
});

test("rejects unknown topology fields", () => {
  expect(() => validateTopologyShape({ topology: { nodes: [], extra: true } })).toThrow(
    "field is unknown",
  );
});
