import { expect, test } from "@jest/globals";
import { getObjectValueDescriptors } from "../../../../src/routing/event-contract/json-value/object-shape.mjs";

test("returns descriptors for plain and null-prototype objects", () => {
  expect(getObjectValueDescriptors({ count: 1 }, "value").count.value).toBe(1);
  expect(
    getObjectValueDescriptors(Object.assign(Object.create(null), { count: 1 }), "value").count
      .value,
  ).toBe(1);
});

test("rejects symbols, accessors, and custom prototypes", () => {
  const symbol = { count: 1 };
  symbol[Symbol("field")] = true;
  expect(() => getObjectValueDescriptors(symbol, "value")).toThrow("JSON-compatible");
  expect(() =>
    getObjectValueDescriptors(
      {
        get count() {
          return 1;
        },
      },
      "value",
    ),
  ).toThrow("JSON-compatible");
  expect(() => getObjectValueDescriptors(new Date("2000-01-01T00:00:00Z"), "value")).toThrow(
    "JSON-compatible",
  );
});
