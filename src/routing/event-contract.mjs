const eventTypes = new Set(['routing.update', 'routing.resync', 'routing.drain', 'routing.recovery', 'routing.shutdown']);

export function validateRoutingEvent(event) {
  if (!event || typeof event !== 'object' || !eventTypes.has(event.type)) throw new TypeError('unsupported routing event');
  if (event.type === 'routing.shutdown') {
    if (event.node !== undefined && typeof event.node !== 'string') throw new TypeError('routing shutdown node must be a string');
    if (event.reconnectDeadlineMs !== undefined && (!Number.isFinite(Number(event.reconnectDeadlineMs)) || Number(event.reconnectDeadlineMs) < 0)) throw new TypeError('routing shutdown deadline must be non-negative');
    if (event.loadBalancerEndpoint !== undefined && typeof event.loadBalancerEndpoint !== 'string') throw new TypeError('routing shutdown endpoint must be a string');
  }
  return event;
}
