import { expect, test } from "@jest/globals";
import { validateShutdownFields } from "../../../../../src/routing/event-contract/lifecycle/shutdown/fields.mjs";

const event = {
  type: "routing.shutdown",
  version: 1,
  generatedAt: "2030-01-01T00:00:00Z",
  node: "n",
  reason: "maintenance",
  reconnectDeadlineMs: 0,
};

test("accepts valid shutdown fields", () => {
  expect(validateShutdownFields(event)).toBeUndefined();
  expect(
    validateShutdownFields({ ...event, loadBalancerEndpoint: "https://example.com" }),
  ).toBeUndefined();
});

test("rejects unknown and invalid shutdown fields", () => {
  expect(() => validateShutdownFields({ ...event, extra: true })).toThrow("field is unknown");
  expect(() => validateShutdownFields({ ...event, node: " " })).toThrow("node is required");
  expect(() => validateShutdownFields({ ...event, reason: "" })).toThrow("cause is required");
  expect(() => validateShutdownFields({ ...event, reconnectDeadlineMs: -1 })).toThrow("deadline");
  expect(() => validateShutdownFields({ ...event, reconnectDeadlineMs: 1.5 })).toThrow("deadline");
});
