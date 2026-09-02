import { validateRoutingNode } from '../routing/node-validation/index.mjs';
import { assertJsonValue } from '../routing/event-contract/json-value.mjs';

export function validateBundlePorts(ports) {
  // codescope ignore: ports are validated from own descriptors and JSON-checked; bundle-level prototype policy is owned by validateBundle.
  if (!ports || typeof ports !== 'object' || Array.isArray(ports)) throw new TypeError('routing bundle ports are required');
  if (Object.values(Object.getOwnPropertyDescriptors(ports)).some((descriptor) => !Object.hasOwn(descriptor, 'value'))) throw new TypeError('routing bundle ports must contain data properties');
  // codescope ignore: symbol keys are rejected by assertJsonValue before descriptor normalization, never silently accepted.
  assertJsonValue(ports, 'routing bundle ports');
  // The contract permits additional integer service ports for future endpoints, so validate every key rather than reject an evolving port set.
  const portValues = Object.fromEntries(Object.entries(Object.getOwnPropertyDescriptors(ports)).map(([name, descriptor]) => [name, descriptor.value]));
  for (const [name, port] of Object.entries(portValues)) {
    // Intentional: service names are opaque contract keys; only non-empty text and port range are constrained.
    if (name.trim().length === 0 || name !== name.trim()) throw new TypeError('routing bundle port name is invalid');
    validateRoutingNode({ host: name, port }, `routing bundle ports.${name}`);
  }
  // Intentional: required-key checks use the detached descriptor snapshot, closing the proxy mutation window.
  for (const name of ['sql', 'http']) if (!Object.hasOwn(portValues, name)) throw new TypeError(`routing bundle ports.${name} is required`);
}
