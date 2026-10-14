import { expect, test } from "@jest/globals";
import { createValidatedTopologyEvent } from "../../../../src/routing/event-contract/topology/result.mjs";

test("returns the event with validated context and topology", () => {
  const event = { type: "routing.topology", context: { old: true }, topology: { old: true } };
  const context = { nodeIdentity: { name: "node-a" } };
  const topology = { nodes: [] };
  expect(createValidatedTopologyEvent(event, context, topology)).toEqual({
    type: "routing.topology",
    context,
    topology,
  });
});
