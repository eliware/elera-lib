import { expect, test } from "@jest/globals";
import {
  assertShutdownAddressAllowed,
  isBlockedShutdownAddress,
} from "../../../../../src/routing/event-contract/lifecycle/shutdown/address-policy.mjs";

test("blocks local, private, and unspecified addresses", () => {
  for (const hostname of [
    "localhost",
    "localhost.",
    "service.local",
    "10.0.0.1",
    "127.0.0.1",
    "169.254.1.1",
    "192.168.1.1",
    "172.16.0.1",
    "[::1]",
    "[fc00::1]",
    "[fe80::1]",
    "[::ffff:10.0.0.1]",
    "0.0.0.0",
    "[::]",
    "0x7f000001",
    "0177",
    "2130706433",
    "[::ffff:8.8.8.8]",
  ])
    expect(isBlockedShutdownAddress(hostname)).toBe(true);
});

test("allows public addresses", () => {
  expect(isBlockedShutdownAddress("example.com")).toBe(false);
  expect(isBlockedShutdownAddress("8.8.8.8")).toBe(false);
  expect(() => assertShutdownAddressAllowed("example.com")).not.toThrow();
  expect(() => assertShutdownAddressAllowed("127.0.0.1")).toThrow("plain HTTP");
});
