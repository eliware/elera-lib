import { validateBundleApplicationFields } from './application.mjs';
import { validateBundleDatabaseFields } from './database.mjs';
import { validateBundleIdentityFields } from './identity.mjs';
import { validateBundleVersion } from './version.mjs';

export function validateBundleCoreFields(bundle) {
  validateBundleApplicationFields(bundle);
  validateBundleDatabaseFields(bundle);
  validateBundleIdentityFields(bundle);
  validateBundleVersion(bundle);
}
