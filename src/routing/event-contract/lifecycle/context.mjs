import { assertJsonValue } from '../json-value.mjs';

export function validateContextEvent(event) {
  // Lifecycle context is intentionally extensible across supervisor/client versions.
  if (Object.keys(event).some((key) => !['type', 'version', 'generatedAt', 'node', 'context'].includes(key))) throw new TypeError(`routing ${event.type.slice(8)} field is unknown`);
  if (typeof event.node !== 'string' || event.node.trim().length === 0) throw new TypeError(`routing ${event.type.slice(8)} node is required`);
  if (!event.context || typeof event.context !== 'object' || Array.isArray(event.context)) throw new TypeError(`routing ${event.type.slice(8)} context is required`);
  assertJsonValue(event.context, `routing ${event.type.slice(8)} context`);
  return event;
}
