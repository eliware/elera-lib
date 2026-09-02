import { validateRoutingNode } from './node.mjs';

export function validateRoutingNodes(nodes, name = 'routing nodes') {
  if (!Array.isArray(nodes)) throw new TypeError(`${name} must be an array`);
  const validated = [];
  const endpoints = new Set();
  for (const node of nodes) {
    const normalized = validateRoutingNode(node, name);
    const endpoint = JSON.stringify([normalized.host, normalized.port]);
    if (endpoints.has(endpoint)) throw new TypeError(`${name} contains duplicate nodes`);
    endpoints.add(endpoint);
    validated.push(normalized);
  }
  return validated;
}
