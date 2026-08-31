export function validateContextEvent(event) {
  if (typeof event.node !== 'string' || event.node.length === 0) throw new TypeError(`routing ${event.type.slice(8)} node is required`);
  if (!event.context || typeof event.context !== 'object' || Array.isArray(event.context)) throw new TypeError(`routing ${event.type.slice(8)} context is required`);
  return event;
}

export function validateShutdownEvent(event) {
  if (typeof event.node !== 'string' || event.node.length === 0) throw new TypeError('routing shutdown node is required');
  if (typeof event.reason !== 'string' || event.reason.length === 0) throw new TypeError('routing shutdown reason is required');
  if (!Number.isFinite(event.reconnectDeadlineMs) || event.reconnectDeadlineMs < 0) throw new TypeError('routing shutdown deadline must be non-negative');
  if (event.loadBalancerEndpoint !== undefined) {
    let url;
    try { url = new URL(event.loadBalancerEndpoint); } catch { throw new TypeError('routing shutdown endpoint must be an HTTP URL'); }
    if (!['http:', 'https:'].includes(url.protocol)) throw new TypeError('routing shutdown endpoint must be an HTTP URL');
  }
  return event;
}
