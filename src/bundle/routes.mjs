import { validateRoutingNode, validateRoutingNodes } from '../routing/node-validation.mjs';

export function validateBundleRoutes(bundle) {
  if (!bundle.routes || typeof bundle.routes !== 'object') throw new TypeError('routing bundle routes are required');
  const writer = validateRoutingNode(bundle.writer, 'routing bundle writer');
  const failover = validateRoutingNodes(bundle.failover, 'routing bundle failover');
  if (writer && failover.some((node) => node.host === writer.host && node.port === writer.port)) throw new TypeError('routing bundle failover duplicates writer');
  validateRoutingNodes(bundle.readers, 'routing bundle readers');
  for (const route of ['primary', 'balanced']) {
    if (!Array.isArray(bundle.routes[route])) throw new TypeError(`bundle.routes.${route} must be an array`);
    validateRoutingNodes(bundle.routes[route], `routing bundle ${route}`);
  }
}
