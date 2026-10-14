import { expect, test } from "@jest/globals";
import { detachTopologyPayload } from "../../../../src/routing/event-contract/topology/payload.mjs";

test("returns a detached JSON topology", () => {
  const payload = { nodes: [{ host: "node-a" }] };
  const result = detachTopologyPayload(payload);
  expect(result).toEqual(payload);
  expect(result).not.toBe(payload);
  expect(result.nodes).not.toBe(payload.nodes);
});

test("rejects non-JSON values and clone failures", () => {
  expect(() => detachTopologyPayload({ value: undefined })).toThrow("JSON-compatible");
  const original = globalThis.structuredClone;
  globalThis.structuredClone = () => {
    throw new Error("clone failure");
  };
  try {
    expect(() => detachTopologyPayload({ nodes: [] })).toThrow("cloneable JSON-compatible");
  } finally {
    globalThis.structuredClone = original;
  }
});
