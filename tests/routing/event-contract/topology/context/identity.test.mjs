import { expect, test } from "@jest/globals";
import { validateTopologyIdentity } from "../../../../../src/routing/event-contract/topology/context/identity.mjs";

test("accepts one non-empty identity name", () => {
  expect(validateTopologyIdentity({ name: "node-a" })).toBeUndefined();
});

test("rejects invalid identity shapes and fields", () => {
  for (const identity of [null, [], {}, { name: " " }, { name: 1 }])
    expect(() => validateTopologyIdentity(identity)).toThrow("nodeIdentity is required");
  expect(() => validateTopologyIdentity({ name: "node-a", extra: true })).toThrow(
    "field is unknown",
  );
});
