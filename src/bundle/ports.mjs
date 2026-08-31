import { validateRoutingNode } from '../routing/node-validation.mjs';

export function validateBundlePorts(ports) {
  if (!ports || typeof ports !== 'object') throw new TypeError('routing bundle ports are required');
  for (const name of ['sql', 'http']) validateRoutingNode({ host: name, port: ports[name] }, `routing bundle ports.${name}`);
}
