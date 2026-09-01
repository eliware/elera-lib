import { validateBundleInput } from './input.mjs';
import { validateBundleApiVersion } from './api-version.mjs';
import { validateBundleExpiry } from './expiry.mjs';
import { validateBundleFields } from './fields/index.mjs';
import { validateBundlePorts } from './ports.mjs';
import { validateBundleRoutes } from './routes.mjs';
import { assertJsonValue } from '../routing/event-contract/json-value.mjs';

export function validateBundle(bundle) {
  validateBundleInput(bundle);
  // Intentional: the public API accepts parsed JSON contracts, so direct callers using Date/Map/etc. are rejected too.
  assertJsonValue(bundle);
  let normalized;
  // Intentional: clone only after the explicit JSON-value check so validators never mutate caller-owned data.
  normalized = structuredClone(bundle);
  validateBundleApiVersion(normalized);
  validateBundleFields(normalized);
  validateBundlePorts(normalized.ports);
  validateBundleExpiry(normalized.expiresAt);
  validateBundleRoutes(normalized);
  return normalized;
}
