import { expect, test } from "@jest/globals";
import { validateTopologyRefreshAfter } from "../../../../../src/routing/event-contract/topology/context/timestamp.mjs";

test("accepts an optional valid UTC refresh timestamp", () => {
  expect(validateTopologyRefreshAfter(undefined)).toBeUndefined();
  expect(validateTopologyRefreshAfter("2099-01-01T00:00:00Z")).toBeUndefined();
  expect(validateTopologyRefreshAfter("2099-01-01T00:00:00.123Z")).toBeUndefined();
});

test("rejects invalid refresh timestamps", () => {
  for (const value of [null, "bad", "2099-01-01T00:00:00+00:00", "2099-02-30T00:00:00Z"])
    expect(() => validateTopologyRefreshAfter(value)).toThrow("refreshAfter is invalid");
});
