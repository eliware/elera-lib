import { expect, test } from "@jest/globals";
import {
  JsonValueError,
  MAX_JSON_DEPTH,
} from "../../../../src/routing/event-contract/json-value/errors.mjs";

test("exposes the JSON error type and depth limit", () => {
  expect(new JsonValueError("bad value")).toBeInstanceOf(TypeError);
  expect(MAX_JSON_DEPTH).toBe(100);
});
