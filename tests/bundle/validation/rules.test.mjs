import { expect, test } from "@jest/globals";
import { validateBundleRules } from "../../../src/bundle/validation/rules.mjs";

const bundle = {
  apiVersion: "v1",
  application: "app",
  database: "db",
  physicalDatabase: "physical_db",
  identity: "runtime",
  credentials: { username: "user", password: "" },
  writer: { host: "node-a", port: 3306 },
  readers: [],
  failover: [],
  bundleVersion: 1,
  expiresAt: "2099-01-01T00:00:00Z",
  nodeIdentity: "node-a",
  ports: { sql: 3306, http: 8080 },
  routes: { primary: [], balanced: [] },
};

test("validates and returns a complete bundle", () => {
  expect(validateBundleRules({ ...bundle })).toMatchObject(bundle);
});

test("validates optional refresh timestamps and rejects invalid rules", () => {
  expect(validateBundleRules({ ...bundle, refreshAfter: "2099-01-01T00:01:00Z" })).toBeDefined();
  expect(() => validateBundleRules({ ...bundle, apiVersion: "v2" })).toThrow();
  expect(() => validateBundleRules({ ...bundle, expiresAt: "bad" })).toThrow("expiresAt");
});
