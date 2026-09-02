import { validateBundleInput } from '../input.mjs';
import { validateBundleApiVersion } from '../api-version.mjs';
import { validateBundleExpiry } from '../expiry.mjs';
import { validateBundleFields } from '../fields/index.mjs';
import { validateBundlePorts } from '../ports.mjs';
import { validateBundleRoutes } from '../routes.mjs';

export function validateBundleRules(bundle) {
  validateBundleInput(bundle);
  validateBundleApiVersion(bundle);
  validateBundleFields(bundle);
  validateBundlePorts(bundle.ports);
  validateBundleExpiry(bundle.expiresAt);
  if (bundle.refreshAfter !== undefined) validateBundleExpiry(bundle.refreshAfter, 'refreshAfter');
  validateBundleRoutes(bundle);
  return bundle;
}
