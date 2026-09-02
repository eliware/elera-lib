import { detachAndLimitBundle } from './boundary.mjs';
import { validateBundleRules } from './rules.mjs';

export function validateBundle(bundle) {
  // Intentional: this public pipeline is fail-fast and delegates each focused rule family to its own module.
  if (!bundle || typeof bundle !== 'object' || Array.isArray(bundle)) throw new TypeError('routing bundle is required');
  return validateBundleRules(detachAndLimitBundle(bundle));
}
