const requiredText = (value, name) => { if (typeof value !== 'string' || value.trim().length === 0) throw new TypeError(`${name} is required`); };

export function validateBundleCredentials(credentials) {
  if (!credentials || typeof credentials !== 'object') throw new TypeError('routing bundle credentials are required');
  requiredText(credentials.username, 'routing bundle credentials.username');
  // Intentional: empty passwords are valid for deployments that authenticate by socket, certificate, or external policy.
  if (typeof credentials.password !== 'string') throw new TypeError('routing bundle credentials.password is required');
}
