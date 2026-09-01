export function assertJsonValue(value, path = 'routing contract') {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return;
  if (typeof value === 'number') {
    if (Number.isFinite(value)) return;
    throw new TypeError(`${path} must contain JSON-compatible values`);
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertJsonValue(item, `${path}[${index}]`));
    return;
  }
  if (typeof value === 'object' && (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null)) {
    try { for (const [key, item] of Object.entries(value)) assertJsonValue(item, `${path}.${key}`); }
    catch (error) { if (error instanceof TypeError) throw error; throw new TypeError(`${path} must contain JSON-compatible values`); }
    return;
  }
  throw new TypeError(`${path} must contain JSON-compatible values`);
}
