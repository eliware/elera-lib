import { expect, test } from "@jest/globals";
import { assertPlainBundle } from "../../../src/bundle/input/prototype.mjs";

test("accepts ordinary and null-prototype bundles", () => {
  expect(assertPlainBundle({})).toBeUndefined();
  expect(assertPlainBundle(Object.create(null))).toBeUndefined();
});

test("rejects custom and inaccessible prototypes", () => {
  class Bundle {}
  expect(() => assertPlainBundle(new Bundle())).toThrow("plain object");
  expect(() =>
    assertPlainBundle(
      new Proxy(
        {},
        {
          getPrototypeOf() {
            throw new Error("failed");
          },
        },
      ),
    ),
  ).toThrow("plain object");
});
