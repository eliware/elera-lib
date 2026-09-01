export function validateShutdownEvent(event) {
  if (Object.keys(event).some((key) => !['type', 'version', 'generatedAt', 'node', 'reason', 'reconnectDeadlineMs', 'loadBalancerEndpoint'].includes(key))) throw new TypeError('routing shutdown field is unknown');
  if (typeof event.node !== 'string' || event.node.trim().length === 0) throw new TypeError('routing shutdown node is required');
  if (typeof event.reason !== 'string' || event.reason.trim().length === 0) throw new TypeError('routing shutdown reason is required');
  if (!Number.isInteger(event.reconnectDeadlineMs) || event.reconnectDeadlineMs < 0) throw new TypeError('routing shutdown deadline must be a non-negative integer');
  if (event.loadBalancerEndpoint !== undefined) {
    let url;
    try { url = new URL(event.loadBalancerEndpoint); } catch { throw new TypeError('routing shutdown endpoint must be an HTTP URL'); }
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash) throw new TypeError('routing shutdown endpoint must be a plain HTTP URL');
  }
  return event;
}
