import { expect, test } from "@jest/globals";
import { validateRoutingEvent } from "../../../../src/routing/event-contract/index.mjs";
import { validateShutdownEvent } from "../../../../src/routing/event-contract/lifecycle/shutdown.mjs";

const event = {
  type: "routing.shutdown",
  version: 1,
  generatedAt: "2030-01-01T00:00:00Z",
  node: "node-a",
  reason: "maintenance",
  reconnectDeadlineMs: 1000,
};

test("dispatches valid shutdown events", () => {
  expect(validateRoutingEvent(event)).toMatchObject({ node: "node-a" });
  expect(validateShutdownEvent(event)).toBe(event);
  expect(() =>
    validateShutdownEvent({ ...event, loadBalancerEndpoint: "http://127.0.0.1" }),
  ).toThrow("plain HTTP");
});

test("rejects invalid shutdown fields", () => {
  expect(() => validateRoutingEvent({ ...event, node: undefined })).toThrow("node");
  expect(() => validateRoutingEvent({ ...event, reason: "" })).toThrow("cause");
  expect(() => validateRoutingEvent({ ...event, reconnectDeadlineMs: -1 })).toThrow("deadline");
  expect(() => validateRoutingEvent({ ...event, reconnectDeadlineMs: 1.5 })).toThrow("deadline");
  expect(() => validateRoutingEvent({ ...event, extra: true })).toThrow("unknown");
});
