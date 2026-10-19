import { expect, test } from "@jest/globals";
import { isPrivateIpv4Address } from "../../../../../../src/routing/event-contract/lifecycle/shutdown/address/ipv4.mjs";

test("classifies private IPv4 ranges", () => {
  for (const hostname of [
    "10.0.0.1",
    "127.0.0.1",
    "169.254.1.1",
    "192.168.1.1",
    "172.16.0.1",
    "172.31.0.1",
  ])
    expect(isPrivateIpv4Address(hostname)).toBe(true);
});

test("allows public and non-IPv4 hostnames", () => {
  for (const hostname of ["8.8.8.8", "example.com", "[::1]"])
    expect(isPrivateIpv4Address(hostname)).toBe(false);
});
