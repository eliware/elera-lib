export function validateBundleExpiry(expiresAt) {
  // Intentional: expiry is checked against the process clock; callers needing replay control should validate at their boundary.
  const match = typeof expiresAt === 'string' && expiresAt.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{3}))?Z$/);
  const parsed = match && Date.parse(expiresAt);
  if (!match || Number.isNaN(parsed)) throw new TypeError('routing bundle expiresAt is required');
  const date = new Date(parsed);
  if (date.getUTCFullYear() !== Number(match[1]) || date.getUTCMonth() + 1 !== Number(match[2]) || date.getUTCDate() !== Number(match[3]) || date.getUTCHours() !== Number(match[4]) || date.getUTCMinutes() !== Number(match[5]) || date.getUTCSeconds() !== Number(match[6]) || date.getUTCMilliseconds() !== (match[7] ? Number(match[7]) : 0)) throw new TypeError('routing bundle expiresAt is required');
  if (Date.parse(expiresAt) <= Date.now()) throw new TypeError('routing bundle expiresAt must be in the future');
}
