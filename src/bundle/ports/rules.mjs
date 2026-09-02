import { validateRoutingNode } from '../../routing/node-validation/index.mjs';

export function validatePortValues(values) {
  for (const [name, port] of Object.entries(values)) {
    if (name.trim().length === 0 || name !== name.trim()) throw new TypeError('routing bundle port name is invalid');
    validateRoutingNode({ host: name, port }, `routing bundle ports.${name}`);
  }
  for (const name of ['sql', 'http']) if (!Object.hasOwn(values, name)) throw new TypeError(`routing bundle ports.${name} is required`);
}
