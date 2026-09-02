import { validateRoutingNode, validateRoutingNodes } from '../routing/node-validation/index.mjs';

export function validateBundleEndpointConflicts(bundle) {
  const writer = validateRoutingNode(bundle.writer, 'routing bundle writer');
  const failover = validateRoutingNodes(bundle.failover, 'routing bundle failover');
  if (writer && failover.some((node) => node.host === writer.host && node.port === writer.port)) throw new TypeError('routing bundle failover duplicates writer');
  const readers = validateRoutingNodes(bundle.readers, 'routing bundle readers');
  const endpoints = [writer, ...failover, ...readers];
  const endpointKeys = endpoints.map((node) => `${node.host}\u0000${node.port}`);
  if (new Set(endpointKeys).size !== endpointKeys.length) throw new TypeError('routing bundle endpoints contain duplicates');
  bundle.writer = writer;
  bundle.failover = failover;
  bundle.readers = readers;
  return bundle;
}
