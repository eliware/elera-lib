export const eventTypes = new Set(['routing.update', 'routing.topology', 'routing.drain', 'routing.recovery', 'routing.shutdown']);

export function validateEnvelope(event) {
  // Validation does not clone events; callers retain ownership and validators do not mutate them.
  if (!event || typeof event !== 'object' || !eventTypes.has(event.type)) throw new TypeError('unsupported routing event');
  if (!Number.isInteger(event.version) || event.version < 0) throw new TypeError('routing event version must be a non-negative integer');
  if (typeof event.generatedAt !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(event.generatedAt) || Number.isNaN(Date.parse(event.generatedAt))) throw new TypeError('routing event generatedAt must be UTC');
}
