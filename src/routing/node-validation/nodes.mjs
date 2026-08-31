import { validateRoutingNode } from './node.mjs';

export function validateRoutingNodes(nodes, name) {
  if (!Array.isArray(nodes)) throw new TypeError(`${name} must be an array`);
  const validated = nodes.map((node) => validateRoutingNode(node, name));
  if (new Set(validated.map(({ host, port }) => `${host}:${port}`)).size !== validated.length) throw new TypeError(`${name} contains duplicate nodes`);
  return validated;
}
