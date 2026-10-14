import { expect, test } from "@jest/globals";
import { validateAvailabilityRecord } from "../../../../../src/routing/event-contract/topology/nodes/record-values.mjs";

const valid = {
  nodeId: "node-a",
  address: "10.0.0.1",
  sqlPort: 3306,
  state: "ready",
  draining: false,
};

test("accepts valid availability record values", () => {
  expect(validateAvailabilityRecord(valid)).toBeUndefined();
});

test("rejects invalid values and ports", () => {
  for (const record of [
    { ...valid, nodeId: " " },
    { ...valid, address: "" },
    { ...valid, sqlPort: "3306" },
    { ...valid, state: " " },
    { ...valid, draining: 0 },
  ])
    expect(() => validateAvailabilityRecord(record)).toThrow("record is invalid");
  for (const sqlPort of [0, 65536])
    expect(() => validateAvailabilityRecord({ ...valid, sqlPort })).toThrow("port is invalid");
});
