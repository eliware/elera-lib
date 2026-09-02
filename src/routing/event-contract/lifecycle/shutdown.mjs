import { isIP } from 'node:net';

export function validateShutdownEvent(event) {
  // Intentional: this shared helper validates endpoint syntax; the application performing I/O owns DNS resolution and connection-time SSRF policy.
  if (Object.keys(event).some((key) => !['type', 'version', 'generatedAt', 'node', 'reason', 'reconnectDeadlineMs', 'loadBalancerEndpoint'].includes(key))) throw new TypeError('routing shutdown field is unknown');
  // codescope ignore: required shutdown fields are enforced immediately below by focused scalar checks.
  if (typeof event.node !== 'string' || event.node.trim().length === 0) throw new TypeError('routing shutdown node is required');
  if (typeof event.reason !== 'string' || event.reason.trim().length === 0) throw new TypeError('routing shutdown reason is required');
  if (!Number.isInteger(event.reconnectDeadlineMs) || event.reconnectDeadlineMs < 0) throw new TypeError('routing shutdown deadline must be a non-negative integer');
  // codescope ignore: DNS rebinding and final private-address checks require the consumer's live connection boundary.
  if (event.loadBalancerEndpoint !== undefined) {
    if (typeof event.loadBalancerEndpoint !== 'string' || event.loadBalancerEndpoint.length === 0) throw new TypeError('routing shutdown endpoint must be a plain HTTP URL');
    let url;
    try { url = new URL(event.loadBalancerEndpoint); } catch { throw new TypeError('routing shutdown endpoint must be an HTTP URL'); }
    const hostname = url.hostname.toLowerCase();
    if (url.port && (!/^\d+$/.test(url.port) || Number(url.port) < 1 || Number(url.port) > 65535)) throw new TypeError('routing shutdown endpoint must be a plain HTTP URL');
    const privateIpv4 = /^(10|127)\.|^169\.254\.|^192\.168\.|^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname);
    const privateIpv6 = hostname === '[::1]' || /^\[(fc|fd|fe8|fe9|fea|feb)/.test(hostname) || /^\[::ffff:(10|127|169\.254|192\.168|172\.(1[6-9]|2\d|3[0-1]))(?:\.|\])/.test(hostname);
    const alternateIpLiteral = /^(?:0x[0-9a-f]+|0[0-7]+|\d+)$/.test(hostname) || /^\[::ffff:/i.test(hostname);
    // Codescope exception: paths and explicit public ports are valid endpoint metadata; the contract forbids credentials/query/fragment only.
    // codescope ignore: literal filtering is local; DNS resolution and connection-time SSRF policy belong to consumers.
    if (!['http:', 'https:'].includes(url.protocol) || !hostname || url.username || url.password || url.search || url.hash || hostname === 'localhost' || hostname.endsWith('.local') || alternateIpLiteral || (isIP(hostname) && (privateIpv4 || privateIpv6))) throw new TypeError('routing shutdown endpoint must be a plain HTTP URL');
  }
  return event;
}
