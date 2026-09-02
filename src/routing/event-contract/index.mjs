import { validateEnvelope } from './envelope.mjs';
import { validateUpdateEvent } from './update.mjs';
import { validateContextEvent, validateShutdownEvent } from './lifecycle/index.mjs';
import { validateTopologyEvent } from './topology/index.mjs';

export function validateRoutingEvent(event) {
  const normalizedEvent = validateEnvelope(event);
  const type = normalizedEvent.type;
  if (type === 'routing.topology') return validateTopologyEvent(normalizedEvent);
  if (type === 'routing.update') return validateUpdateEvent(normalizedEvent);
  if (type === 'routing.drain' || type === 'routing.recovery') return validateContextEvent(normalizedEvent);
  return validateShutdownEvent(normalizedEvent);
}
