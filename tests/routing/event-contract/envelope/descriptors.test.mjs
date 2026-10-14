import { expect, test } from "@jest/globals";
import { readEventDescriptors } from "../../../../src/routing/event-contract/envelope/descriptors.mjs";

test("copies enumerable data properties", () => {
  expect(readEventDescriptors({ type: "routing.drain", version: 1 })).toEqual({
    type: "routing.drain",
    version: 1,
  });
  expect(
    readEventDescriptors(Object.assign(Object.create(null), { type: "routing.drain" })),
  ).toEqual({
    type: "routing.drain",
  });
});

test("rejects unsupported prototypes and descriptors", () => {
  const accessor = Object.defineProperty({}, "type", {
    get: () => "routing.drain",
    enumerable: true,
  });
  expect(() => readEventDescriptors(new Date())).toThrow("unsupported");
  expect(() => readEventDescriptors(accessor)).toThrow("unsupported");
  expect(() => readEventDescriptors(Object.defineProperty({}, "hidden", { value: 1 }))).toThrow(
    "unsupported",
  );
  const symbol = { type: "routing.drain" };
  symbol[Symbol("field")] = true;
  expect(() => readEventDescriptors(symbol)).toThrow("unsupported");
});

test("normalizes proxy failures", () => {
  const proxy = new Proxy(
    {},
    {
      getPrototypeOf() {
        throw new Error("failed");
      },
    },
  );
  expect(() => readEventDescriptors(proxy)).toThrow("unsupported");
});
