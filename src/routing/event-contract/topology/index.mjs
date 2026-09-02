import { validateTopologyEnvelope } from './envelope.mjs';
import { validateTopologyContext } from './context.mjs';
import { validateTopologyNodes } from './nodes.mjs';
import { assertJsonValue } from '../json-value.mjs';

export function validateTopologyEvent(event) {
  validateTopologyEnvelope(event);
  if (!event.topology || typeof event.topology !== 'object' || Array.isArray(event.topology)) throw new TypeError('routing topology topology is required');
  if (!Object.hasOwn(event.topology, 'nodes')) throw new TypeError('routing topology nodes are required');
  if (Object.keys(event.topology).some((key) => key !== 'nodes')) throw new TypeError('routing topology field is unknown');
  const context = validateTopologyContext(event.context);
  // Intentional: validateEnvelope already detached all nested event data; this clone is a defensive local copy.
  // codescope ignore: topology validation is a shared boundary; the defensive copy prevents focused callers from observing mutable input.
  let topology;
  try { topology = structuredClone(event.topology); } catch { throw new TypeError('routing topology topology must contain cloneable JSON-compatible values'); }
  assertJsonValue(topology, 'routing topology topology');
  topology.nodes = validateTopologyNodes(topology.nodes);
  return { ...event, context, topology };
}
