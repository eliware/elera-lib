import { expect, test } from "@jest/globals";
import { assertBundleFields, bundleFields } from "../../../src/bundle/input/fields.mjs";

test("accepts declared bundle fields", () => {
  expect(bundleFields).toContain("apiVersion");
  expect(() => assertBundleFields({ apiVersion: "v1", application: "app" })).not.toThrow();
});

test("rejects unknown, hidden, and symbol fields", () => {
  expect(() => assertBundleFields({ extra: true })).toThrow("field is unknown");
  const hidden = {};
  Object.defineProperty(hidden, "application", { value: "app" });
  expect(() => assertBundleFields(hidden)).toThrow("field is unknown");
  const symbol = { application: "app" };
  symbol[Symbol("field")] = true;
  expect(() => assertBundleFields(symbol)).toThrow("field is unknown");
});

test("normalizes descriptor inspection failures", () => {
  expect(() =>
    assertBundleFields(
      new Proxy(
        {},
        {
          ownKeys() {
            throw new Error("failed");
          },
        },
      ),
    ),
  ).toThrow("plain object");
});
