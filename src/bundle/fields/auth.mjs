import { requiredText } from './required-text.mjs';

export function validateBundleCredentials(credentials) {
  if (!credentials || typeof credentials !== 'object') throw new TypeError('routing bundle credentials are required');
  if (Object.keys(credentials).some((key) => key !== 'username' && key !== 'password')) throw new TypeError('routing bundle credentials field is unknown');
  requiredText(credentials.username, 'routing bundle credentials.username');
  // Intentional: empty passwords are valid for deployments that authenticate by socket, certificate, or external policy.
  if (typeof credentials.password !== 'string') throw new TypeError('routing bundle credentials.password is required');
}
