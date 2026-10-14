import { expect, test } from "@jest/globals";
import { validateUpdateEvent } from "../../../src/routing/event-contract/update.mjs";

const envelope = { version: 1, generatedAt: "2030-01-01T00:00:00Z" };

test("validates update bundles", () => {
  const bundle = {
    apiVersion: "v1",
    application: "a",
    database: "logical-d",
    physicalDatabase: "elera_db_1",
    identity: "i",
    credentials: { username: "u", password: "p" },
    writer: { host: "w", port: 3306 },
    readers: [],
    failover: [],
    bundleVersion: 1,
    expiresAt: "2099-01-01T00:00:00Z",
    nodeIdentity: "w",
    ports: { sql: 3306, http: 8080 },
    routes: { primary: [], balanced: [] },
  };
  expect(validateUpdateEvent({ ...envelope, type: "routing.update", ...bundle })).toMatchObject(
    bundle,
  );
  expect(() =>
    validateUpdateEvent({ ...envelope, type: "routing.update", application: "a" }),
  ).toThrow();
  expect(() =>
    validateUpdateEvent({ ...envelope, type: "routing.update", version: 0, ...bundle }),
  ).toThrow("version");
});
