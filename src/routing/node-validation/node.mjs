import { readNodeValues } from './node/descriptors.mjs';
import { validateNodeValues, normalizeNodeValues } from './node/rules.mjs';

export function validateRoutingNode(node, name = 'routing node') {
  if (!node || typeof node !== 'object' || Array.isArray(node)) throw new TypeError(`${name} host is required`);
  const values = readNodeValues(node, name);
  validateNodeValues(values, name);
  return normalizeNodeValues(values);
}
