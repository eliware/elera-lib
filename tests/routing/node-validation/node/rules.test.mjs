import { expect, test } from "@jest/globals";
import {
  normalizeNodeValues,
  validateNodeValues,
} from "../../../../src/routing/node-validation/node/rules.mjs";

test("validates and normalizes node values", () => {
  const values = { host: " node-a ", port: 3306, weight: 0, nodeId: " node-1 " };
  expect(() => validateNodeValues(values, "node")).not.toThrow();
  expect(normalizeNodeValues(values)).toEqual({
    host: "node-a",
    port: 3306,
    weight: 0,
    nodeId: "node-1",
  });
});

test("requires a host and a valid port", () => {
  expect(() => validateNodeValues({ port: 3306 }, "node")).toThrow("host is required");
  expect(() => validateNodeValues({ host: "node-a", port: 0 }, "node")).toThrow(
    "endpoint number is invalid",
  );
});

test("rejects unknown fields and invalid optional values", () => {
  expect(() => validateNodeValues({ host: "node-a", port: 3306, extra: true }, "node")).toThrow(
    "field is unknown",
  );
  expect(() => validateNodeValues({ host: "node-a", port: 3306, weight: -1 }, "node")).toThrow(
    "weight is invalid",
  );
  expect(() => validateNodeValues({ host: "node-a", port: 3306, nodeId: " " }, "node")).toThrow(
    "nodeId is invalid",
  );
});
