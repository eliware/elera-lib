import { isIP } from "node:net";

export function isBlockedShutdownAddress(hostname) {
  const privateIpv4 = /^(10|127)\.|^169\.254\.|^192\.168\.|^172\.(1[6-9]|2\d|3[0-1])\./.test(
    hostname,
  );
  const privateIpv6 =
    hostname === "[::1]" ||
    /^\[(fc|fd|fe8|fe9|fea|feb)/.test(hostname) ||
    /^\[::ffff:(10|127|169\.254|192\.168|172\.(1[6-9]|2\d|3[0-1]))(?:\.|\])/.test(hostname);
  const unspecifiedAddress = hostname === "0.0.0.0" || hostname === "[::]";
  const alternateIpLiteral =
    /^(?:0x[0-9a-f]+|0[0-7]+|\d+)$/.test(hostname) || /^\[::ffff:/i.test(hostname);
  return (
    hostname === "localhost" ||
    hostname === "localhost." ||
    hostname.endsWith(".local") ||
    unspecifiedAddress ||
    alternateIpLiteral ||
    (isIP(hostname) && privateIpv4) ||
    privateIpv6
  );
}

export function assertShutdownAddressAllowed(hostname) {
  if (isBlockedShutdownAddress(hostname))
    throw new TypeError("routing shutdown endpoint must be a plain HTTP URL");
}
