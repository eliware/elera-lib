import { isIP } from "node:net";

export function isPrivateIpv4Address(hostname) {
  return (
    isIP(hostname) === 4 &&
    /^(10|127)\.|^169\.254\.|^192\.168\.|^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname)
  );
}
