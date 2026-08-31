import { validateEnvelope } from './envelope.mjs';
import { validateUpdateEvent } from './update.mjs';
import { validateContextEvent, validateShutdownEvent } from './lifecycle.mjs';
import { validateTopologyEvent } from './topology.mjs';

export function validateRoutingEvent(event) {
  validateEnvelope(event);
  if (event.type === 'routing.topology') return validateTopologyEvent(event);
  if (event.type === 'routing.update') return validateUpdateEvent(event);
  if (event.type === 'routing.drain' || event.type === 'routing.recovery') return validateContextEvent(event);
  return validateShutdownEvent(event);
}
