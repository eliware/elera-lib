import { expect, test } from "@jest/globals";
import { assertAvailabilityRecordFields } from "../../../../../../src/routing/event-contract/topology/nodes/record/fields.mjs";

test("accepts the declared availability fields", () => {
  expect(
    assertAvailabilityRecordFields({
      nodeId: "node-a",
      address: "10.0.0.1",
      sqlPort: 3306,
      state: "ready",
      draining: false,
    }),
  ).toBeUndefined();
});

test("rejects undeclared availability fields", () => {
  expect(() => assertAvailabilityRecordFields({ extra: true })).toThrow("field is unknown");
});
