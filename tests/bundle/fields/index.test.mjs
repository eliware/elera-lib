import { expect, test } from "@jest/globals";
import { validateBundleFields } from "../../../src/bundle/fields/index.mjs";

const valid = {
  application: "app",
  database: "logical-db",
  physicalDatabase: "elera_db_123",
  identity: "runtime",
  nodeIdentity: "node-a",
  bundleVersion: 1,
  credentials: { username: "user", password: "secret" },
};

test("validates the combined bundle fields", () => {
  expect(() => validateBundleFields({ ...valid, scopes: ["database:read"] })).not.toThrow();
  expect(() => validateBundleFields({ ...valid, scopes: "database:read" })).toThrow(
    "scopes must be an array",
  );
});
