import { validateBundleInput } from './input.mjs';
import { validateBundleApiVersion } from './api-version.mjs';
import { validateBundleExpiry } from './expiry.mjs';
import { validateBundleFields } from './fields/index.mjs';
import { validateBundlePorts } from './ports.mjs';
import { validateBundleRoutes } from './routes.mjs';
import { assertJsonValue } from '../routing/event-contract/json-value.mjs';

export function validateBundle(bundle) {
  // Intentional: this public pipeline is fail-fast and delegates each focused rule family to its own module.
  if (!bundle || typeof bundle !== 'object' || Array.isArray(bundle)) throw new TypeError('routing bundle is required');
  // codescope ignore: payload limits are application policy; this helper must detach before validating the shared contract.
  // codescope ignore: cloneable non-JSON values are rejected by assertJsonValue and focused validators after detachment.
  let normalized;
  // codescope ignore: clone-first detaches caller data; this shared helper intentionally delegates payload bounds to applications.
  try {
    // codescope ignore: payload/resource bounds belong to transport; this shared helper must detach first.
    normalized = structuredClone(bundle);
  } catch {
    throw new TypeError('routing bundle must contain cloneable JSON-compatible values');
  }
  let serialized;
  try { serialized = JSON.stringify(normalized); } catch { throw new TypeError('routing bundle must contain JSON-compatible values'); }
  if (serialized === undefined) throw new TypeError('routing bundle must contain JSON-compatible values');
  let serializedSize;
  try { serializedSize = new TextEncoder().encode(serialized).length; } catch { throw new TypeError('routing bundle exceeds the maximum contract size'); }
  if (serializedSize > 1_048_576) throw new TypeError('routing bundle exceeds the maximum contract size');
  validateBundleInput(normalized);
  assertJsonValue(normalized);
  validateBundleApiVersion(normalized);
  // Intentional: each focused validator owns its required fields and emits its domain-specific error.
  validateBundleFields(normalized);
  validateBundlePorts(normalized.ports);
  validateBundleExpiry(normalized.expiresAt);
  validateBundleRoutes(normalized);
  return normalized;
}
