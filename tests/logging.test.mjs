import { expect, test } from "@jest/globals";
import { validateBundle, validateRoutingEvent } from "../src/index.mjs";

function makeLogger() {
  const records = [];
  const logger = {};
  for (const level of ["error", "warn", "info", "http", "verbose", "debug", "silly"])
    logger[level] = (message, metadata) => records.push({ level, message, metadata });
  return { logger, records };
}

const bundle = {
  apiVersion: "v1",
  application: "billing",
  database: "billing",
  physicalDatabase: "elera_billing",
  identity: "billing-runtime",
  credentials: { username: "billing_runtime", password: "fixture-value" },
  writer: { host: "elera-0", port: 3306 },
  readers: [],
  failover: [],
  bundleVersion: 7,
  expiresAt: "2099-01-01T00:00:00Z",
  nodeIdentity: "elera-0",
  ports: { sql: 3306, http: 8080 },
  routes: { primary: [], balanced: [] },
};

test("logs safe bundle validation records through an injected logger", () => {
  const { logger, records } = makeLogger();
  expect(validateBundle(bundle, { logger }).bundleVersion).toBe(7);
  expect(records.map(({ level }) => level)).toEqual(["debug", "info"]);
  expect(records[1].metadata).toEqual({ operation: "validateBundle", bundleVersion: 7 });
  expect(JSON.stringify(records)).not.toContain("fixture-value");
});

test("logs safe event context and validation failures", () => {
  const { logger, records } = makeLogger();
  const event = {
    type: "routing.unknown",
    version: 1,
    generatedAt: "2099-01-01T00:00:00Z",
    node: "node-a",
    context: { marker: "fixture-value" },
  };
  expect(() => validateRoutingEvent(event, { logger })).toThrow();
  expect(records.map(({ level }) => level)).toEqual(["debug", "error"]);
  expect(records[1].metadata).toEqual({ operation: "validateRoutingEvent" });
  expect(JSON.stringify(records)).not.toContain("fixture-value");
});

test("logs the validated event type", () => {
  const { logger, records } = makeLogger();
  const event = {
    type: "routing.drain",
    version: 1,
    generatedAt: "2099-01-01T00:00:00Z",
    node: "node-a",
    context: {},
  };
  expect(validateRoutingEvent(event, { logger })).toMatchObject({ type: event.type });
  expect(records[1].metadata).toEqual({
    operation: "validateRoutingEvent",
    eventType: "routing.drain",
  });
});

test("does not let logger failures change validation", () => {
  const logger = {
    debug() {
      throw new Error("logger failure");
    },
  };
  expect(() => validateRoutingEvent(undefined, { logger })).toThrow("unsupported");
});
