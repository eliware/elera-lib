import { readEventDescriptors } from './envelope/descriptors.mjs';
import { detachEventPayload } from './envelope/payload.mjs';
import { eventTypes, validateEventRules } from './envelope/rules.mjs';

export { eventTypes };

export function validateEnvelope(event) {
  if (!event || typeof event !== 'object' || Array.isArray(event)) throw new TypeError('unsupported routing event');
  const snapshot = detachEventPayload(readEventDescriptors(event));
  return validateEventRules(snapshot);
}
