import { bundleFields } from '../../bundle/input.mjs';
import { validateBundle } from '../../bundle/index.mjs';

export function validateUpdateEvent(event) {
  const allowed = ['type', 'version', 'generatedAt', ...bundleFields];
  if (Object.keys(event).some((key) => !allowed.includes(key))) throw new TypeError('routing update field is unknown');
  if (!Number.isInteger(event.version) || event.version < 1) throw new TypeError('routing update version must be positive');
  const bundle = validateBundle(Object.fromEntries(Object.entries(event).filter(([key]) => !['type', 'version', 'generatedAt'].includes(key))));
  const normalized = Object.fromEntries(bundleFields.filter((key) => Object.hasOwn(bundle, key)).map((key) => [key, bundle[key]]));
  // Intentional: preserve the event envelope while replacing only validated bundle fields with normalized copies.
  return { ...event, ...normalized };
}
