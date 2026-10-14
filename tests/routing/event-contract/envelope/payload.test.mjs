import { expect, test } from "@jest/globals";
import { detachEventPayload } from "../../../../src/routing/event-contract/envelope/payload.mjs";

test("returns a detached event payload", () => {
  const input = { context: { enabled: true } };
  const result = detachEventPayload(input);
  expect(result).toEqual(input);
  expect(result.context).not.toBe(input.context);
});

test("rejects non-JSON fields and clone failures", () => {
  expect(() => detachEventPayload({ value: undefined })).toThrow("JSON-compatible");
  expect(() => detachEventPayload({ value: () => {} })).toThrow("JSON-compatible");
  expect(() => detachEventPayload({ value: { nested: undefined } })).toThrow("JSON-compatible");
  const originalClone = globalThis.structuredClone;
  globalThis.structuredClone = () => {
    throw new Error("clone failure");
  };
  try {
    expect(() => detachEventPayload({ value: 1 })).toThrow("unsupported");
  } finally {
    globalThis.structuredClone = originalClone;
  }
});

test("rejects symbol fields", () => {
  const input = { value: 1 };
  input[Symbol("metadata")] = true;
  expect(() => detachEventPayload(input)).toThrow("JSON-compatible");
});

test("rejects oversized and unmeasurable event payloads", () => {
  expect(() => detachEventPayload({ value: "x".repeat(1_048_576) })).toThrow(
    "maximum contract size",
  );
  const originalEncoder = globalThis.TextEncoder;
  globalThis.TextEncoder = class {
    encode() {
      throw new Error("encoding failure");
    }
  };
  try {
    expect(() => detachEventPayload({ value: 1 })).toThrow("maximum contract size");
  } finally {
    globalThis.TextEncoder = originalEncoder;
  }
});

test("rejects serialization failures and undefined serialization results", () => {
  const originalStringify = JSON.stringify;
  JSON.stringify = () => {
    throw new Error("serialization failure");
  };
  try {
    expect(() => detachEventPayload({ value: 1 })).toThrow("unsupported");
  } finally {
    JSON.stringify = originalStringify;
  }
  JSON.stringify = () => undefined;
  try {
    expect(() => detachEventPayload({ value: 1 })).toThrow("unsupported");
  } finally {
    JSON.stringify = originalStringify;
  }
});
