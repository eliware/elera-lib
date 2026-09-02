export function validateShutdownFields(event) {
  if (Object.keys(event).some((key) => !['type', 'version', 'generatedAt', 'node', 'reason', 'reconnectDeadlineMs', 'loadBalancerEndpoint'].includes(key))) throw new TypeError('routing shutdown field is unknown');
  if (typeof event.node !== 'string' || event.node.trim().length === 0) throw new TypeError('routing shutdown node is required');
  if (typeof event.reason !== 'string' || event.reason.trim().length === 0) throw new TypeError('routing shutdown reason is required');
  if (!Number.isInteger(event.reconnectDeadlineMs) || event.reconnectDeadlineMs < 0) throw new TypeError('routing shutdown deadline must be a non-negative integer');
}
