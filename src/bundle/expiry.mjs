export function validateBundleExpiry(expiresAt) {
  if (typeof expiresAt !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(expiresAt) || Number.isNaN(Date.parse(expiresAt))) throw new TypeError('routing bundle expiresAt is required');
  if (Date.parse(expiresAt) <= Date.now()) throw new TypeError('routing bundle expiresAt must be in the future');
}
