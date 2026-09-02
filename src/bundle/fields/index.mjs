import { validateBundleCoreFields } from './core.mjs';
import { validateBundleCredentials } from './auth.mjs';
import { validateBundleScopes } from './scopes.mjs';

export function validateBundleFields(bundle) {
  validateBundleCoreFields(bundle);
  validateBundleCredentials(bundle.credentials);
  validateBundleScopes(bundle.scopes);
}
