import { expect, test } from "@jest/globals";
import {
  assertShutdownAddressAllowed,
  isBlockedShutdownAddress,
} from "../../../../../src/routing/event-contract/lifecycle/shutdown/address-policy.mjs";

test("blocks local and unspecified names and alternate IP literals", () => {
  for (const hostname of [
    "localhost",
    "localhost.",
    "service.local",
    "0.0.0.0",
    "[::]",
    "0x7f000001",
    "0177",
    "2130706433",
    "[::ffff:8.8.8.8]",
  ])
    expect(isBlockedShutdownAddress(hostname)).toBe(true);
});

test("allows public addresses and rejects blocked addresses", () => {
  expect(isBlockedShutdownAddress("example.com")).toBe(false);
  expect(isBlockedShutdownAddress("8.8.8.8")).toBe(false);
  expect(() => assertShutdownAddressAllowed("example.com")).not.toThrow();
  expect(() => assertShutdownAddressAllowed("127.0.0.1")).toThrow("plain HTTP");
});
