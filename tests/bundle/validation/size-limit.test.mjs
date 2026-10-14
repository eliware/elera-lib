import { expect, test } from "@jest/globals";
import { assertBundleSize } from "../../../src/bundle/validation/size-limit.mjs";

test("accepts bundles within the byte limit", () => {
  expect(assertBundleSize({ value: "ok" })).toBeUndefined();
});

test("rejects unserializable and oversized bundles", () => {
  const originalStringify = JSON.stringify;
  JSON.stringify = () => {
    throw new Error("serialization failure");
  };
  try {
    expect(() => assertBundleSize({})).toThrow("JSON-compatible");
  } finally {
    JSON.stringify = originalStringify;
  }
  JSON.stringify = () => undefined;
  try {
    expect(() => assertBundleSize({})).toThrow("JSON-compatible");
  } finally {
    JSON.stringify = originalStringify;
  }
  expect(() => assertBundleSize({ value: "x".repeat(1_048_576) })).toThrow("maximum contract size");
});

test("normalizes byte encoding failures", () => {
  const originalEncoder = globalThis.TextEncoder;
  globalThis.TextEncoder = class {
    encode() {
      throw new Error("encoding failure");
    }
  };
  try {
    expect(() => assertBundleSize({ value: 1 })).toThrow("maximum contract size");
  } finally {
    globalThis.TextEncoder = originalEncoder;
  }
});
