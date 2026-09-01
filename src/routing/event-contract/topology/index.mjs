import { validateTopologyEnvelope } from './envelope.mjs';
import { validateTopologyContext } from './context.mjs';
import { validateTopologyNodes } from './nodes.mjs';

export function validateTopologyEvent(event) {
  validateTopologyEnvelope(event);
  if (!event.topology || typeof event.topology !== 'object' || Array.isArray(event.topology)) throw new TypeError('routing topology topology is required');
  if (Object.keys(event.topology).some((key) => key !== 'nodes')) throw new TypeError('routing topology field is unknown');
  validateTopologyContext(event.context);
  validateTopologyNodes(event.topology?.nodes);
  return event;
}
