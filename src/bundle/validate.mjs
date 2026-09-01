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
  // Intentional: Node.js 26 is the supported runtime, so structuredClone is guaranteed and avoids mutating caller-owned data.
  try {
    normalized = structuredClone(bundle);
  } catch {
    throw new TypeError('routing bundle must contain cloneable JSON-compatible values');
  }
  validateBundleApiVersion(normalized);
  validateBundleFields(normalized);
  validateBundlePorts(normalized.ports);
  validateBundleExpiry(normalized.expiresAt);
  validateBundleRoutes(normalized);
  return normalized;
}
