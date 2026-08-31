import { validateBundleApiVersion } from './api-version.mjs';
import { validateBundleExpiry } from './expiry.mjs';
import { validateBundleFields } from './fields/index.mjs';
import { validateBundlePorts } from './ports.mjs';
import { validateBundleRoutes } from './routes.mjs';

export function validateBundle(bundle) {
  if (!bundle || typeof bundle !== 'object') throw new TypeError('routing bundle is required');
  validateBundleApiVersion(bundle);
  validateBundleFields(bundle);
  validateBundlePorts(bundle.ports);
  validateBundleExpiry(bundle.expiresAt);
  validateBundleRoutes(bundle);
  return bundle;
}
