import { isPrivateIpv4Address } from "./ipv4.mjs";

function isPrivateIpv4MappedAddress(hostname) {
  const hexadecimalAddress = /^\[::ffff:([\da-f]{1,4}):([\da-f]{1,4})\]$/i.exec(hostname);
  if (!hexadecimalAddress) return false;
  const high = Number.parseInt(hexadecimalAddress[1], 16);
  const low = Number.parseInt(hexadecimalAddress[2], 16);
  const dotted = [high >> 8, high & 255, low >> 8, low & 255].join(".");
  return isPrivateIpv4Address(dotted);
}

export function isPrivateIpv6Address(hostname) {
  let normalizedHostname = hostname;
  try {
    normalizedHostname = new URL(`http://${hostname}`).hostname.toLowerCase();
  } catch {}
  return (
    normalizedHostname === "[::1]" ||
    /^\[(fc|fd|fe8|fe9|fea|feb)/.test(normalizedHostname) ||
    isPrivateIpv4MappedAddress(normalizedHostname)
  );
}
