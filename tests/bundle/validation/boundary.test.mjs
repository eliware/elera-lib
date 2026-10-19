import { expect, test } from "@jest/globals";
import { detachAndLimitBundle } from "../../../src/bundle/validation/boundary.mjs";

test("returns a detached copy of a JSON object", () => {
  const input = { scopes: [{ value: 1 }] };
  const result = detachAndLimitBundle(input);
  expect(result).toEqual(input);
  expect(result).not.toBe(input);
  expect(result.scopes).not.toBe(input.scopes);
});

test("rejects hidden fields and unsupported values", () => {
  const hidden = {};
  Object.defineProperty(hidden, "application", { value: "app" });
  expect(() => detachAndLimitBundle(hidden)).toThrow("field is unknown");
  expect(() => detachAndLimitBundle({ scopes: undefined })).toThrow("JSON-compatible");
});

test("normalizes clone failures", () => {
  const originalClone = globalThis.structuredClone;
  globalThis.structuredClone = () => {
    throw new Error("clone failure");
  };
  try {
    expect(() => detachAndLimitBundle({ scopes: [] })).toThrow("cloneable JSON-compatible");
  } finally {
    globalThis.structuredClone = originalClone;
  }
});
