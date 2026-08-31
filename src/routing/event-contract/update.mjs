import { validateBundle } from '../../bundle.mjs';

export function validateUpdateEvent(event) {
  validateBundle(Object.fromEntries(Object.entries(event).filter(([key]) => !['type', 'version', 'generatedAt'].includes(key))));
  return event;
}
