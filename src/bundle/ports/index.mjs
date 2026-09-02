import { assertJsonValue } from '../../routing/event-contract/json-value.mjs';
import { readPortValues } from './descriptors.mjs';
import { validatePortValues } from './rules.mjs';

export function validateBundlePorts(ports) {
  if (!ports || typeof ports !== 'object' || Array.isArray(ports)) throw new TypeError('routing bundle ports are required');
  const values = readPortValues(ports);
  assertJsonValue(ports, 'routing bundle ports');
  validatePortValues(values);
}
