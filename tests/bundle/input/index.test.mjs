import { expect, test } from "@jest/globals";
import { validateBundleInput } from "../../../src/bundle/input/index.mjs";

test("validates a plain bundle with declared fields", () => {
  expect(validateBundleInput({ apiVersion: "v1", application: "app" })).toBeUndefined();
  expect(() => validateBundleInput({ unexpected: true })).toThrow("unknown");
});

test("normalizes proxy field failures in the bundle workflow", () => {
  const proxy = new Proxy(
    {},
    {
      ownKeys() {
        throw new Error("proxy failure");
      },
    },
  );
  expect(() => validateBundleInput(proxy)).toThrow("plain");
});
