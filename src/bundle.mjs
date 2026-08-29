import { validateRoutingNode, validateRoutingNodes } from './routing/node-validation.mjs';
const routes = ['primary', 'balanced'];
const requiredText = (value, name) => { if (typeof value !== 'string' || value.length === 0) throw new TypeError(`${name} is required`); };
const validatePorts = (ports) => {
  if (!ports || typeof ports !== 'object') throw new TypeError('routing bundle ports are required');
  for (const name of ['sql', 'http']) validateRoutingNode({ host: name, port: ports[name] }, `routing bundle ports.${name}`);
};

export function validateBundle(bundle) {
  if (!bundle || typeof bundle !== 'object') throw new TypeError('routing bundle is required');
  if (bundle.apiVersion !== 'v1') throw new TypeError('routing bundle apiVersion must be v1');
  requiredText(bundle.application, 'routing bundle application');
  requiredText(bundle.database, 'routing bundle database');
  requiredText(bundle.identity, 'routing bundle identity');
  requiredText(bundle.nodeIdentity, 'routing bundle nodeIdentity');
  if (!bundle.credentials || typeof bundle.credentials !== 'object') throw new TypeError('routing bundle credentials are required');
  requiredText(bundle.credentials.username, 'routing bundle credentials.username');
  if (typeof bundle.credentials.password !== 'string') throw new TypeError('routing bundle credentials.password is required');
  if (bundle.bundleVersion === undefined || !['string', 'number'].includes(typeof bundle.bundleVersion)) throw new TypeError('routing bundle bundleVersion is required');
  validatePorts(bundle.ports);
  if (!bundle.expiresAt || Number.isNaN(Date.parse(bundle.expiresAt))) throw new TypeError('routing bundle expiresAt is required');
  const writer = validateRoutingNode(bundle.writer, 'routing bundle writer');
  const failover = validateRoutingNodes(bundle.failover, 'routing bundle failover');
  if (writer && failover.some((node) => node.host === writer.host && node.port === writer.port)) throw new TypeError('routing bundle failover duplicates writer');
  validateRoutingNodes(bundle.readers, 'routing bundle readers');
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
