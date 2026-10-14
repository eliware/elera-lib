import { assertShutdownAddressAllowed } from "./address-policy.mjs";

export function validateShutdownEndpoint(value) {
  if (typeof value !== "string" || value.length === 0)
    throw new TypeError("routing shutdown endpoint must be a plain HTTP URL");
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new TypeError("routing shutdown endpoint must be an HTTP URL");
  }
  const hostname = url.hostname.toLowerCase();
  assertShutdownAddressAllowed(hostname);
  if (url.port && (!/^\d+$/.test(url.port) || Number(url.port) < 1 || Number(url.port) > 65535))
    throw new TypeError("routing shutdown endpoint must be a plain HTTP URL");
  // codescope ignore: DNS rebinding and final private-address checks require the consumer's live connection boundary.
  if (
    !["http:", "https:"].includes(url.protocol) ||
    !hostname ||
    url.username ||
    url.password ||
    url.search ||
    url.hash
  )
    throw new TypeError("routing shutdown endpoint must be a plain HTTP URL");
  return value;
}
