import { expect, test } from "@jest/globals";
import { validateTopologyPorts } from "../../../../../src/routing/event-contract/topology/context/ports.mjs";

test("accepts required and optional topology ports", () => {
  expect(validateTopologyPorts({ sql: 3306, http: 8080, ws: 9000 })).toBeUndefined();
});

test("rejects missing, unknown, and invalid ports", () => {
  expect(() => validateTopologyPorts({})).toThrow("ports.sql is required");
  expect(() => validateTopologyPorts({ sql: 3306 })).toThrow("ports.http is required");
  expect(() => validateTopologyPorts({ sql: 3306, http: 8080, extra: 1 })).toThrow(
    "field is unknown",
  );
  expect(() => validateTopologyPorts({ sql: 0, http: 8080 })).toThrow("ports.sql is invalid");
  expect(() => validateTopologyPorts({ sql: 3306, http: 8080, ws: 65536 })).toThrow(
    "ports.ws is invalid",
  );
});
