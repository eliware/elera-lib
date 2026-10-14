import { expect, test } from "@jest/globals";
import { detachAndLimitBundle } from "../../../src/bundle/validation/boundary.mjs";

test("returns a detached copy of a JSON object", () => {
  const input = { nested: { value: 1 } };
  const result = detachAndLimitBundle(input);
  expect(result).toEqual(input);
  expect(result).not.toBe(input);
  expect(result.nested).not.toBe(input.nested);
});

test("rejects hidden fields and unsupported values", () => {
  const hidden = {};
  Object.defineProperty(hidden, "secret", { value: true });
  expect(() => detachAndLimitBundle(hidden)).toThrow("field is unknown");
  expect(() => detachAndLimitBundle({ value: undefined })).toThrow("JSON-compatible");
});

test("normalizes clone failures", () => {
  const originalClone = globalThis.structuredClone;
  globalThis.structuredClone = () => {
    throw new Error("clone failure");
  };
  try {
    expect(() => detachAndLimitBundle({ value: 1 })).toThrow("cloneable JSON-compatible");
  } finally {
    globalThis.structuredClone = originalClone;
  }
});
