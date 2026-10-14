import { expect, test } from "@jest/globals";
import { readPortValues } from "../../../src/bundle/ports/descriptors.mjs";

test("reads data properties", () => {
  expect(readPortValues({ sql: 3306, http: 8080 })).toEqual({ sql: 3306, http: 8080 });
});

test("rejects accessor properties", () => {
  const ports = Object.defineProperty({}, "sql", { get: () => 3306, enumerable: true });
  expect(() => readPortValues(ports)).toThrow("data properties");
});
