export function requiredText(value, name) {
  if (typeof value !== 'string' || value.trim().length === 0) throw new TypeError(`${name} is required`);
}
