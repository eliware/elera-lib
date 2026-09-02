import { assertJsonValue } from '../../json-value.mjs';

export function validateTopologyPorts(ports) {
  if (!ports || typeof ports !== 'object' || Array.isArray(ports)) throw new TypeError('routing topology ports are required');
  assertJsonValue(ports, 'routing topology ports');
  if (Object.keys(ports).some((name) => !['sql', 'http', 'ws'].includes(name))) throw new TypeError('routing topology ports field is unknown');
  for (const [name, port] of Object.entries(ports)) if (name !== name.trim() || name.length === 0 || !Number.isInteger(port) || port < 1 || port > 65535) throw new TypeError(`routing topology ports.${name} is invalid`);
  for (const name of ['sql', 'http']) if (!Object.hasOwn(ports, name)) throw new TypeError(`routing topology ports.${name} is required`);
}
