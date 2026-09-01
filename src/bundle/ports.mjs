import { validateRoutingNode } from '../routing/node-validation/index.mjs';

export function validateBundlePorts(ports) {
  if (!ports || typeof ports !== 'object' || Array.isArray(ports)) throw new TypeError('routing bundle ports are required');
  // The contract permits additional integer service ports for future endpoints, so validate every key rather than reject an evolving port set.
  for (const [name, port] of Object.entries(ports)) validateRoutingNode({ host: name, port }, `routing bundle ports.${name}`);
  for (const name of ['sql', 'http']) if (!Object.hasOwn(ports, name)) throw new TypeError(`routing bundle ports.${name} is required`);
}
