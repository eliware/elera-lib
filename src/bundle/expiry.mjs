export function validateBundleExpiry(expiresAt) {
  if (!expiresAt || Number.isNaN(Date.parse(expiresAt))) throw new TypeError('routing bundle expiresAt is required');
  if (Date.parse(expiresAt) <= Date.now()) throw new TypeError('routing bundle expiresAt must be in the future');
}
