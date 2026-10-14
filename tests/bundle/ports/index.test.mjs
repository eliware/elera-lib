import { expect, test } from "@jest/globals";
import { validateBundlePorts } from "../../../src/bundle/ports/index.mjs";

test("validates bundle ports", () => {
  expect(() => validateBundlePorts({ sql: 3306, http: 8080 })).not.toThrow();
  expect(() => validateBundlePorts({ sql: 0, http: 8080 })).toThrow();
  expect(() => validateBundlePorts({ sql: 3306, http: 8080, extra: true })).toThrow();
});
