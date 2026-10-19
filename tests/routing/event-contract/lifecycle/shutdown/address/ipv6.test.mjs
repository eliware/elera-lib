import { expect, test } from "@jest/globals";
import { isPrivateIpv6Address } from "../../../../../../src/routing/event-contract/lifecycle/shutdown/address/ipv6.mjs";

test("classifies private IPv6 ranges", () => {
  for (const hostname of ["[::1]", "[fc00::1]", "[fd00::1]", "[fe80::1]"])
    expect(isPrivateIpv6Address(hostname)).toBe(true);
  for (const hostname of ["[::ffff:10.0.0.1]", "[::ffff:172.16.0.1]"])
    expect(isPrivateIpv6Address(hostname)).toBe(true);
});

test("allows public IPv6 addresses", () => {
  expect(isPrivateIpv6Address("[2001:4860:4860::8888]")).toBe(false);
  expect(isPrivateIpv6Address("[::ffff:8.8.8.8]")).toBe(false);
});
