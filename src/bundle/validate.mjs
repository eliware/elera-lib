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
  // codescope ignore: payload limits are application policy; this shared helper must detach before validating the contract.
  // codescope ignore: cloneable non-JSON values are rejected by assertJsonValue and focused validators after detachment.
  let normalized;
  // codescope ignore: clone-first detaches caller data; this generic contract library cannot safely inspect or bound hostile object graphs before cloning, so callers/transports own pre-allocation resource limits.
  // codescope ignore: this public helper intentionally accepts only already-materialized JavaScript values; request-size limits must be enforced before invocation by the transport/application boundary.
  try {
    // codescope ignore: payload/resource bounds belong to transport; this shared helper must detach first.
    normalized = structuredClone(bundle);
  } catch {
    throw new TypeError('routing bundle must contain cloneable JSON-compatible values');
  }
  // Validate before serialization so NaN and Infinity cannot be normalized to JSON null.
  assertJsonValue(normalized);
  let serialized;
  try { serialized = JSON.stringify(normalized); } catch { throw new TypeError('routing bundle must contain JSON-compatible values'); }
  if (serialized === undefined) throw new TypeError('routing bundle must contain JSON-compatible values');
  let serializedSize;
  try { serializedSize = new TextEncoder().encode(serialized).length; } catch { throw new TypeError('routing bundle exceeds the maximum contract size'); }
  if (serializedSize > 1_048_576) throw new TypeError('routing bundle exceeds the maximum contract size');
  validateBundleInput(normalized);
  validateBundleApiVersion(normalized);
  // Intentional: each focused validator owns its required fields and emits its domain-specific error.
  validateBundleFields(normalized);
  validateBundlePorts(normalized.ports);
  validateBundleExpiry(normalized.expiresAt);
  if (normalized.refreshAfter !== undefined) validateBundleExpiry(normalized.refreshAfter, 'refreshAfter');
  validateBundleRoutes(normalized);
  return normalized;
}
