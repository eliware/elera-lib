import { validateTopologyEnvelope } from "./envelope.mjs";
import { validateTopologyContext } from "./context.mjs";
import { validateTopologyNodes } from "./nodes.mjs";
import { detachTopologyPayload } from "./payload.mjs";
import { validateTopologyShape } from "./shape.mjs";
import { createValidatedTopologyEvent } from "./result.mjs";

export function validateTopologyEvent(event) {
  validateTopologyEnvelope(event);
  validateTopologyShape(event);
  const context = validateTopologyContext(event.context);
  const topology = detachTopologyPayload(event.topology);
  topology.nodes = validateTopologyNodes(topology.nodes);
  return createValidatedTopologyEvent(event, context, topology);
}
