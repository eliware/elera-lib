import { validateRoutingNode, validateRoutingNodes } from '../routing/node-validation.mjs';

export function validateBundleEndpointConflicts(bundle) {
  const writer = validateRoutingNode(bundle.writer, 'routing bundle writer');
  const failover = validateRoutingNodes(bundle.failover, 'routing bundle failover');
  if (writer && failover.some((node) => node.host === writer.host && node.port === writer.port)) throw new TypeError('routing bundle failover duplicates writer');
  validateRoutingNodes(bundle.readers, 'routing bundle readers');
}
