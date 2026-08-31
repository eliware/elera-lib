export const eventTypes = new Set(['routing.update', 'routing.topology', 'routing.drain', 'routing.recovery', 'routing.shutdown']);

export function validateEnvelope(event) {
  if (!event || typeof event !== 'object' || !eventTypes.has(event.type)) throw new TypeError('unsupported routing event');
  if (!Number.isInteger(event.version) || event.version < 0) throw new TypeError('routing event version must be a non-negative integer');
  if (typeof event.generatedAt !== 'string' || Number.isNaN(Date.parse(event.generatedAt))) throw new TypeError('routing event generatedAt is required');
}
