import { expect, test } from "@jest/globals";
import { validateBundle } from "../../../src/bundle/validation/index.mjs";
test("rejects missing bundles", () => {
  expect(() => validateBundle()).toThrow("required");
  expect(() =>
    validateBundle({
      get apiVersion() {
        throw new Error("getter failure");
      },
    }),
  ).toThrow("JSON-compatible");
});
test("normalizes unexpected clone failures", () => {
  const originalClone = globalThis.structuredClone;
  globalThis.structuredClone = () => {
    throw new Error("clone failure");
  };
  try {
    expect(() => validateBundle({})).toThrow("cloneable JSON-compatible");
  } finally {
    globalThis.structuredClone = originalClone;
  }
});
test("rejects non-enumerable fields before detachment", () => {
  const bundle = {};
  Object.defineProperty(bundle, "extra", { value: true });
  expect(() => validateBundle(bundle)).toThrow("field is unknown");
});
test("rejects non-JSON values and oversized bundles", () => {
  expect(() => validateBundle({ value: BigInt(1) })).toThrow("JSON-compatible");
  for (const value of [Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]) {
    expect(() => validateBundle({ value })).toThrow("JSON-compatible");
    expect(() => validateBundle({ nested: { value } })).toThrow("JSON-compatible");
  }
  expect(() => validateBundle({ value: "x".repeat(1_048_576) })).toThrow("maximum contract size");
});
test("normalizes serialization and encoding failures", () => {
  const originalStringify = JSON.stringify;
  JSON.stringify = () => {
    throw new Error("serialization failure");
  };
  try {
    expect(() => validateBundle({})).toThrow("JSON-compatible");
  } finally {
    JSON.stringify = originalStringify;
  }
  const originalEncoder = globalThis.TextEncoder;
  globalThis.TextEncoder = class {
    encode() {
      throw new Error("encoding failure");
    }
  };
  try {
    expect(() => validateBundle({})).toThrow("maximum contract size");
  } finally {
    globalThis.TextEncoder = originalEncoder;
  }
  JSON.stringify = () => undefined;
  try {
    expect(() => validateBundle({})).toThrow("JSON-compatible");
  } finally {
    JSON.stringify = originalStringify;
  }
});
