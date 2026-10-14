import { expect, test } from "@jest/globals";
import { assertAvailabilityRecordShape } from "../../../../../src/routing/event-contract/topology/nodes/record-shape.mjs";

test("accepts an object availability record", () => {
  expect(() => assertAvailabilityRecordShape({ nodeId: "node-a" })).not.toThrow();
});

test.each([null, undefined, "node-a", 1, [], () => {}])("rejects a non-record value", (value) => {
  expect(() => assertAvailabilityRecordShape(value)).toThrow("availability record is invalid");
});
