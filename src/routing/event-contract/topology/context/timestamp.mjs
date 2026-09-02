export function validateTopologyRefreshAfter(value) {
  if (value === undefined) return;
  const match = typeof value === 'string' && value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{3}))?Z$/);
  const parsed = match && Date.parse(value);
  const date = match ? new Date(parsed) : null;
  if (!match || Number.isNaN(parsed) || date.getUTCFullYear() !== Number(match[1]) || date.getUTCMonth() + 1 !== Number(match[2]) || date.getUTCDate() !== Number(match[3]) || date.getUTCHours() !== Number(match[4]) || date.getUTCMinutes() !== Number(match[5]) || date.getUTCSeconds() !== Number(match[6]) || date.getUTCMilliseconds() !== (match[7] ? Number(match[7]) : 0)) throw new TypeError('routing topology refreshAfter is invalid');
}
