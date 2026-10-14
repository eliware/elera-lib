import { expect, test } from "@jest/globals";
import { detachBundle } from "../../../src/bundle/validation/copy.mjs";

test("returns a detached JSON copy", () => {
  const input = { nested: { value: 1 } };
  const result = detachBundle(input);
  expect(result).toEqual(input);
  expect(result).not.toBe(input);
  expect(result.nested).not.toBe(input.nested);
});

test("rejects non-JSON values and clone failures", () => {
  expect(() => detachBundle({ value: undefined })).toThrow("JSON-compatible");
  const original = globalThis.structuredClone;
  globalThis.structuredClone = () => {
    throw new Error("clone failure");
  };
  try {
    expect(() => detachBundle({ value: 1 })).toThrow("cloneable JSON-compatible");
  } finally {
    globalThis.structuredClone = original;
  }
});
