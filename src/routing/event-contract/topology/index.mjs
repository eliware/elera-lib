import { validateTopologyEnvelope } from './envelope.mjs';
import { validateTopologyContext } from './context.mjs';
import { validateTopologyNodes } from './nodes.mjs';

export function validateTopologyEvent(event) {
  validateTopologyEnvelope(event);
  validateTopologyContext(event.context);
  validateTopologyNodes(event.topology?.nodes);
  return event;
}
