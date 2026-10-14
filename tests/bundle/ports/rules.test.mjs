import { expect, test } from "@jest/globals";
import { validatePortValues } from "../../../src/bundle/ports/rules.mjs";

test("accepts required and optional valid ports", () => {
  expect(() => validatePortValues({ sql: 3306, http: 8080, ws: 9000 })).not.toThrow();
});

test("rejects missing ports, invalid names, and invalid values", () => {
  expect(() => validatePortValues({ sql: 3306 })).toThrow("http is required");
  expect(() => validatePortValues({ sql: 3306, http: 8080, " sql": 1 })).toThrow("name is invalid");
  expect(() => validatePortValues({ sql: 0, http: 8080 })).toThrow("port is invalid");
});
