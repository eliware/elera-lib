import { expect, test } from "@jest/globals";
import { readNodeValues } from "../../../../src/routing/node-validation/node/descriptors.mjs";

test("reads own data properties", () => {
  expect(readNodeValues({ host: "node-a", port: 3306 }, "node")).toEqual({
    host: "node-a",
    port: 3306,
  });
});

test("rejects accessors and proxy descriptor errors", () => {
  expect(() =>
    readNodeValues(
      {
        get host() {
          return "node-a";
        },
      },
      "node",
    ),
  ).toThrow("data properties");
  const proxy = new Proxy(
    {},
    {
      ownKeys() {
        throw new Error("proxy failure");
      },
    },
  );
  expect(() => readNodeValues(proxy, "node")).toThrow("data properties");
});
