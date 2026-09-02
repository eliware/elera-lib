import { validateShutdownEndpoint } from './shutdown/endpoint.mjs';
import { validateShutdownFields } from './shutdown/fields.mjs';

export function validateShutdownEvent(event) {
  validateShutdownFields(event);
  if (event.loadBalancerEndpoint !== undefined) {
    validateShutdownEndpoint(event.loadBalancerEndpoint);
  }
  return event;
}
