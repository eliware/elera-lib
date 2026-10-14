import { expect, test } from "@jest/globals";
import { detachAvailabilityRecord } from "../../../../../src/routing/event-contract/topology/nodes/record-copy.mjs";

test("returns a detached availability record", () => {
  const record = { nodeId: "a", metadata: { ready: true } };
  const result = detachAvailabilityRecord(record);
  expect(result).toEqual(record);
  expect(result).not.toBe(record);
  expect(result.metadata).not.toBe(record.metadata);
});

test("rejects cyclic and uncloneable records", () => {
  const cycle = {};
  cycle.self = cycle;
  expect(() => detachAvailabilityRecord(cycle)).toThrow("cyclic");
  const originalClone = globalThis.structuredClone;
  globalThis.structuredClone = () => {
    throw new Error("clone failure");
  };
  try {
    expect(() => detachAvailabilityRecord({ nodeId: "a" })).toThrow("cloneable");
  } finally {
    globalThis.structuredClone = originalClone;
  }
});
