import { validateTopologyContext } from './context.mjs';
import { validateTopologyNodes } from './nodes.mjs';

export function validateTopologyEvent(event) {
  for (const key of ['type', 'version', 'generatedAt', 'node', 'context', 'topology']) if (!(key in event)) throw new TypeError('routing topology field is required');
  for (const key of Object.keys(event)) if (!['type', 'version', 'generatedAt', 'node', 'context', 'topology'].includes(key)) throw new TypeError('routing topology field is unknown');
  if (event.version < 1) throw new TypeError('routing topology version must be positive');
  if (!event.generatedAt.endsWith('Z')) throw new TypeError('routing topology generatedAt must be UTC');
  if (typeof event.node !== 'string' || event.node.length === 0) throw new TypeError('routing topology node is required');
  validateTopologyContext(event.context);
  validateTopologyNodes(event.topology?.nodes);
  return event;
}
