import { assertJsonValue } from '../json-value.mjs';

export function validateContextEvent(event) {
  // Lifecycle context is intentionally extensible across supervisor/client versions.
  const type = event.type;
  const label = type.slice(8);
  if (Object.keys(event).some((key) => !['type', 'version', 'generatedAt', 'node', 'context'].includes(key))) throw new TypeError(`routing ${label} field is unknown`);
  if (!Object.hasOwn(event, 'node') || typeof event.node !== 'string' || event.node.trim().length === 0) throw new TypeError(`routing ${label} node is required`);
  if (!Object.hasOwn(event, 'context') || !event.context || typeof event.context !== 'object' || Array.isArray(event.context)) throw new TypeError(`routing ${label} context is required`);
  assertJsonValue(event.context, `routing ${label} context`);
  return event;
}
