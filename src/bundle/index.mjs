import { validateBundleFields } from './fields.mjs';
import { validateBundlePorts } from './ports.mjs';
import { validateBundleRoutes } from './routes.mjs';

export function validateBundle(bundle) {
  if (!bundle || typeof bundle !== 'object') throw new TypeError('routing bundle is required');
  if (bundle.apiVersion !== 'v1') throw new TypeError('routing bundle apiVersion must be v1');
  validateBundleFields(bundle);
  validateBundlePorts(bundle.ports);
  if (!bundle.expiresAt || Number.isNaN(Date.parse(bundle.expiresAt))) throw new TypeError('routing bundle expiresAt is required');
  if (Date.parse(bundle.expiresAt) <= Date.now()) throw new TypeError('routing bundle expiresAt must be in the future');
  validateBundleRoutes(bundle);
  return bundle;
}
