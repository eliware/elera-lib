import { expect, test } from "@jest/globals";
import { validateUtcTimestamp } from "../../../src/routing/event-contract/timestamp.mjs";

test("accepts UTC timestamps with optional milliseconds", () => {
  expect(validateUtcTimestamp("2099-01-01T00:00:00Z", "event date")).toBeUndefined();
  expect(validateUtcTimestamp("2099-01-01T00:00:00.123Z", "event date")).toBeUndefined();
});

test("rejects non-UTC and invalid calendar timestamps", () => {
  for (const value of [
    null,
    "bad",
    "2099-01-01T00:00:00+00:00",
    "2099-02-30T00:00:00Z",
    "2099-01-01T24:00:00Z",
    "2099-01-01T00:60:00Z",
  ])
    expect(() => validateUtcTimestamp(value, "event date")).toThrow("event date must be UTC");
});
