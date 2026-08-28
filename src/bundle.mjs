import { validateRoutingNode, validateRoutingNodes } from './routing/node-validation.mjs';
const routes = ['primary', 'balanced'];

export function validateBundle(bundle) {
  if (!bundle || typeof bundle !== 'object') throw new TypeError('routing bundle is required');
  if (!bundle.expiresAt || Number.isNaN(Date.parse(bundle.expiresAt))) throw new TypeError('routing bundle expiresAt is required');
  const writer = bundle.writer !== undefined ? validateRoutingNode(bundle.writer, 'routing bundle writer') : undefined;
  const failover = bundle.failover !== undefined ? validateRoutingNodes(bundle.failover, 'routing bundle failover') : [];
  if (writer && failover.some((node) => node.host === writer.host && node.port === writer.port)) throw new TypeError('routing bundle failover duplicates writer');
  if (bundle.readers !== undefined) validateRoutingNodes(bundle.readers, 'routing bundle readers');
  for (const route of routes) {
    if (bundle.routes?.[route] !== undefined && !Array.isArray(bundle.routes[route])) throw new TypeError(`bundle.routes.${route} must be an array`);
    for (const node of bundle.routes?.[route] ?? []) {
      validateRoutingNode(node, `routing bundle ${route} node`);
    }
  }
  return bundle;
}

export function bundleExpired(bundle, now = Date.now()) { return Date.parse(bundle.expiresAt) <= now; }
export function bundleNeedsRefresh(bundle, now = Date.now()) { return bundle.refreshAfter ? Date.parse(bundle.refreshAfter) <= now : bundleExpired(bundle, now); }
