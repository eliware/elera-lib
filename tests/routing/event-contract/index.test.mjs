import { expect, test } from "@jest/globals";
import { validateRoutingEvent } from "../../../src/routing/event-contract/index.mjs";
test("dispatches routing event validation", () =>
  expect(() => validateRoutingEvent()).toThrow("unsupported"));

test("rejects unsupported types and unknown update fields at the event boundary", () => {
  expect(() =>
    validateRoutingEvent({
      type: "routing.unknown",
      version: 1,
      generatedAt: "2030-01-01T00:00:00Z",
    }),
  ).toThrow("unsupported");
  expect(() =>
    validateRoutingEvent({
      type: "routing.update",
      version: 1,
      generatedAt: "2030-01-01T00:00:00Z",
      extra: true,
    }),
  ).toThrow("unknown");
});
