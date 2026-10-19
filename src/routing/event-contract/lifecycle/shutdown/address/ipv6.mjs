import { isPrivateIpv4Address } from "./ipv4.mjs";

function isPrivateIpv4MappedAddress(hostname) {
  const dottedAddress = /^\[::ffff:(\d{1,3}(?:\.\d{1,3}){3})\]$/i.exec(hostname);
  if (dottedAddress) return isPrivateIpv4Address(dottedAddress[1]);
  const hexadecimalAddress = /^\[::ffff:([\da-f]{1,4}):([\da-f]{1,4})\]$/i.exec(hostname);
  if (!hexadecimalAddress) return false;
  const high = Number.parseInt(hexadecimalAddress[1], 16);
  const low = Number.parseInt(hexadecimalAddress[2], 16);
  const dotted = [high >> 8, high & 255, low >> 8, low & 255].join(".");
  return isPrivateIpv4Address(dotted);
}

export function isPrivateIpv6Address(hostname) {
  return (
    hostname === "[::1]" ||
    /^\[(fc|fd|fe8|fe9|fea|feb)/.test(hostname) ||
    isPrivateIpv4MappedAddress(hostname)
  );
}
