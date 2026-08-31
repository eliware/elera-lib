import { validateRoutingNode, validateRoutingNodes } from './routing/node-validation.mjs';
const routes = ['primary', 'balanced'];
const requiredText = (value, name) => { if (typeof value !== 'string' || value.length === 0) throw new TypeError(`${name} is required`); };
const optionalText = (value, name) => { if (value !== undefined) requiredText(value, name); };
const optionalScopes = (scopes) => {
  if (scopes === undefined) return;
  if (!Array.isArray(scopes) || scopes.some((scope) => typeof scope !== 'string' || scope.length === 0)) throw new TypeError('routing bundle scopes must be an array of non-empty strings');
};
const validatePorts = (ports) => {
  if (!ports || typeof ports !== 'object') throw new TypeError('routing bundle ports are required');
  for (const name of ['sql', 'http']) validateRoutingNode({ host: name, port: ports[name] }, `routing bundle ports.${name}`);
};

export function validateBundle(bundle) {
  if (!bundle || typeof bundle !== 'object') throw new TypeError('routing bundle is required');
  if (bundle.apiVersion !== 'v1') throw new TypeError('routing bundle apiVersion must be v1');
  requiredText(bundle.application, 'routing bundle application');
  optionalText(bundle.applicationId, 'routing bundle applicationId');
  requiredText(bundle.database, 'routing bundle database');
  optionalText(bundle.databaseId, 'routing bundle databaseId');
  requiredText(bundle.identity, 'routing bundle identity');
  optionalText(bundle.identityId, 'routing bundle identityId');
  optionalText(bundle.credentialName, 'routing bundle credentialName');
  optionalScopes(bundle.scopes);
  requiredText(bundle.nodeIdentity, 'routing bundle nodeIdentity');
  if (!bundle.routes || typeof bundle.routes !== 'object') throw new TypeError('routing bundle routes are required');
  if (!bundle.credentials || typeof bundle.credentials !== 'object') throw new TypeError('routing bundle credentials are required');
  requiredText(bundle.credentials.username, 'routing bundle credentials.username');
  if (typeof bundle.credentials.password !== 'string') throw new TypeError('routing bundle credentials.password is required');
  if (bundle.bundleVersion === undefined || !['string', 'number'].includes(typeof bundle.bundleVersion)) throw new TypeError('routing bundle bundleVersion is required');
  validatePorts(bundle.ports);
  if (!bundle.expiresAt || Number.isNaN(Date.parse(bundle.expiresAt))) throw new TypeError('routing bundle expiresAt is required');
  if (Date.parse(bundle.expiresAt) <= Date.now()) throw new TypeError('routing bundle expiresAt must be in the future');
  const writer = validateRoutingNode(bundle.writer, 'routing bundle writer');
  const failover = validateRoutingNodes(bundle.failover, 'routing bundle failover');
  if (writer && failover.some((node) => node.host === writer.host && node.port === writer.port)) throw new TypeError('routing bundle failover duplicates writer');
  validateRoutingNodes(bundle.readers, 'routing bundle readers');
  for (const route of routes) {
    if (!Array.isArray(bundle.routes[route])) throw new TypeError(`bundle.routes.${route} must be an array`);
    validateRoutingNodes(bundle.routes[route], `routing bundle ${route}`);
  }
  return bundle;
}
