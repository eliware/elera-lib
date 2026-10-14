import { expect, test } from "@jest/globals";
import {
  eventTypes,
  validateEventRules,
} from "../../../../src/routing/event-contract/envelope/rules.mjs";

test("accepts each supported event type", () => {
  for (const type of [
    "routing.update",
    "routing.topology",
    "routing.drain",
    "routing.recovery",
    "routing.shutdown",
  ]) {
    expect(eventTypes.has(type)).toBe(true);
    const event = { type, version: 0, generatedAt: "2030-01-01T00:00:00Z" };
    expect(validateEventRules(event)).toBe(event);
  }
});

test("rejects unsupported event types", () => {
  expect(() => validateEventRules({ type: "routing.unknown" })).toThrow("unsupported");
});
