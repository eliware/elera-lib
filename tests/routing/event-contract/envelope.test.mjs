import { expect, test } from "@jest/globals";
import { validateRoutingEvent } from "../../../src/routing/event-contract/index.mjs";
import { validateEnvelope } from "../../../src/routing/event-contract/envelope.mjs";

test("rejects unsupported event types and malformed event values", () => {
  expect(() => validateRoutingEvent()).toThrow("unsupported");
  expect(() => validateRoutingEvent({ type: "other" })).toThrow("unsupported");
  expect(() => validateRoutingEvent({ type: "routing.resync" })).toThrow("unsupported");
  expect(() => validateEnvelope(null)).toThrow("unsupported");
  expect(() => validateEnvelope([])).toThrow("unsupported");
});

test("accepts both supported timestamp precisions", () => {
  for (const generatedAt of ["2030-01-01T00:00:00Z", "2030-01-01T00:00:00.000Z"])
    expect(validateEnvelope({ type: "routing.drain", version: 1, generatedAt })).toMatchObject({
      type: "routing.drain",
    });
});

test("rejects malformed envelope descriptors and values", () => {
  const hidden = { type: "routing.drain", version: 1, generatedAt: "2030-01-01T00:00:00Z" };
  Object.defineProperty(hidden, "hidden", { value: true, enumerable: false });
  expect(() => validateEnvelope(hidden)).toThrow("unsupported");
  expect(() => validateEnvelope(Object.create(null))).toThrow("unsupported");
  expect(() => validateEnvelope(Object.create({ inherited: true }))).toThrow("unsupported");
  expect(() =>
    validateEnvelope({ type: undefined, version: 1, generatedAt: "2030-01-01T00:00:00Z" }),
  ).toThrow("JSON-compatible");
  expect(() =>
    validateEnvelope({ type: "routing.drain", version: -1, generatedAt: "2030-01-01T00:00:00Z" }),
  ).toThrow("version");
  expect(() =>
    validateEnvelope({ type: "routing.drain", version: 1, generatedAt: "2030-02-30T00:00:00Z" }),
  ).toThrow("generatedAt");
});
