export function validateTopologyEnvelope(event) {
  // Codescope exception: this focused gate checks shape only; validateRoutingEvent supplies the detached snapshot and context semantics.
  if (!event || typeof event !== 'object' || Array.isArray(event)) throw new TypeError('routing topology field is required');
  if (event.type !== 'routing.topology') throw new TypeError('routing topology type is invalid');
  for (const key of ['type', 'version', 'generatedAt', 'node', 'context', 'topology']) if (!Object.hasOwn(event, key)) throw new TypeError('routing topology field is required');
  for (const key of Object.keys(event)) if (!['type', 'version', 'generatedAt', 'node', 'context', 'topology'].includes(key)) throw new TypeError('routing topology field is unknown');
  if (!Number.isInteger(event.version) || event.version < 1) throw new TypeError('routing topology version must be positive');
  const generatedAt = typeof event.generatedAt === 'string' && event.generatedAt.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{3}))?Z$/);
  const date = generatedAt ? new Date(Date.parse(event.generatedAt)) : null;
  if (!generatedAt || Number.isNaN(date.getTime()) || date.getUTCFullYear() !== Number(generatedAt[1]) || date.getUTCMonth() + 1 !== Number(generatedAt[2]) || date.getUTCDate() !== Number(generatedAt[3]) || date.getUTCHours() !== Number(generatedAt[4]) || date.getUTCMinutes() !== Number(generatedAt[5]) || date.getUTCSeconds() !== Number(generatedAt[6]) || date.getUTCMilliseconds() !== (generatedAt[7] ? Number(generatedAt[7]) : 0)) throw new TypeError('routing topology generatedAt must be UTC');
  if (typeof event.node !== 'string' || event.node.trim().length === 0) throw new TypeError('routing topology node is required');
}
