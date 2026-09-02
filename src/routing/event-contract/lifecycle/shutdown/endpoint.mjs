import { isIP } from 'node:net';

export function validateShutdownEndpoint(value) {
  if (typeof value !== 'string' || value.length === 0) throw new TypeError('routing shutdown endpoint must be a plain HTTP URL');
  let url;
  try { url = new URL(value); } catch { throw new TypeError('routing shutdown endpoint must be an HTTP URL'); }
  const hostname = url.hostname.toLowerCase();
  if (url.port && (!/^\d+$/.test(url.port) || Number(url.port) < 1 || Number(url.port) > 65535)) throw new TypeError('routing shutdown endpoint must be a plain HTTP URL');
  const privateIpv4 = /^(10|127)\.|^169\.254\.|^192\.168\.|^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname);
  const privateIpv6 = hostname === '[::1]' || /^\[(fc|fd|fe8|fe9|fea|feb)/.test(hostname) || /^\[::ffff:(10|127|169\.254|192\.168|172\.(1[6-9]|2\d|3[0-1]))(?:\.|\])/.test(hostname);
  const unspecifiedAddress = hostname === '0.0.0.0' || hostname === '[::]';
  const alternateIpLiteral = /^(?:0x[0-9a-f]+|0[0-7]+|\d+)$/.test(hostname) || /^\[::ffff:/i.test(hostname);
  // codescope ignore: DNS rebinding and final private-address checks require the consumer's live connection boundary.
  if (!['http:', 'https:'].includes(url.protocol) || !hostname || url.username || url.password || url.search || url.hash || hostname === 'localhost' || hostname === 'localhost.' || hostname.endsWith('.local') || unspecifiedAddress || alternateIpLiteral || (isIP(hostname) && privateIpv4) || privateIpv6) throw new TypeError('routing shutdown endpoint must be a plain HTTP URL');
  return value;
}
