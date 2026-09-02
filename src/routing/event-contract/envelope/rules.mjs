export const eventTypes = new Set(['routing.update', 'routing.topology', 'routing.drain', 'routing.recovery', 'routing.shutdown']);

export function validateEventRules(snapshot) {
  if (!eventTypes.has(snapshot.type)) throw new TypeError('unsupported routing event');
  if (!Number.isInteger(snapshot.version) || snapshot.version < 0) throw new TypeError('routing event version must be a non-negative integer');
  const match = typeof snapshot.generatedAt === 'string' && snapshot.generatedAt.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{3}))?Z$/);
  const date = match ? new Date(Date.parse(snapshot.generatedAt)) : null;
  if (!match || Number.isNaN(date.getTime()) || date.getUTCFullYear() !== Number(match[1]) || date.getUTCMonth() + 1 !== Number(match[2]) || date.getUTCDate() !== Number(match[3]) || date.getUTCHours() !== Number(match[4]) || date.getUTCMinutes() !== Number(match[5]) || date.getUTCSeconds() !== Number(match[6]) || date.getUTCMilliseconds() !== (match[7] ? Number(match[7]) : 0)) throw new TypeError('routing event generatedAt must be UTC');
  return snapshot;
}
