import { isPrivateIpv4Address } from "./address/ipv4.mjs";
import { isPrivateIpv6Address } from "./address/ipv6.mjs";

export function isBlockedShutdownAddress(hostname) {
  const unspecifiedAddress =
    hostname === "0.0.0.0" || hostname === "255.255.255.255" || hostname === "[::]";
  const alternateIpLiteral =
    /^(?:0x[0-9a-f]+|0[0-7]+|\d+)$/.test(hostname) || /^\[::ffff:/i.test(hostname);
  return (
    hostname === "localhost" ||
    hostname === "localhost." ||
    hostname.endsWith(".local") ||
    unspecifiedAddress ||
    alternateIpLiteral ||
    isPrivateIpv4Address(hostname) ||
    isPrivateIpv6Address(hostname)
  );
}

export function assertShutdownAddressAllowed(hostname) {
  if (isBlockedShutdownAddress(hostname))
    throw new TypeError("routing shutdown endpoint must be a plain HTTP URL");
}
