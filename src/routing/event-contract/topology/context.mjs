import { assertJsonValue } from '../json-value.mjs';

export function validateTopologyContext(context) {
  if (!context || typeof context !== 'object' || Array.isArray(context)) throw new TypeError('routing topology context is required');
  assertJsonValue(context, 'routing topology context');
  // Intentional: nodeIdentity is an opaque JSON metadata object; only its required name is interpreted here.
  // Unknown nested fields are preserved because deployments may add correlation metadata without changing this contract.
  if (!context.nodeIdentity || typeof context.nodeIdentity !== 'object' || Array.isArray(context.nodeIdentity) || typeof context.nodeIdentity.name !== 'string' || context.nodeIdentity.name.trim() === '') throw new TypeError('routing topology nodeIdentity is required');
  for (const key of Object.keys(context)) if (!['nodeIdentity', 'ports', 'clusterCondition', 'refreshAfter'].includes(key)) throw new TypeError('routing topology context field is unknown');
  if (!context.ports || typeof context.ports !== 'object' || Array.isArray(context.ports)) throw new TypeError('routing topology ports are required');
  for (const [name, port] of Object.entries(context.ports)) if (name.trim().length === 0 || !Number.isInteger(port) || port < 1 || port > 65535) throw new TypeError(`routing topology ports.${name} is invalid`);
  if (Object.keys(context.ports).some((name) => !['sql', 'http', 'ws'].includes(name))) throw new TypeError('routing topology ports field is unknown');
  for (const name of ['sql', 'http']) if (!Object.hasOwn(context.ports, name)) throw new TypeError(`routing topology ports.${name} is required`);
  if (typeof context.clusterCondition !== 'string' || context.clusterCondition.trim().length === 0) throw new TypeError('routing topology clusterCondition is required');
  if (context.refreshAfter !== undefined && (typeof context.refreshAfter !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(context.refreshAfter) || Number.isNaN(Date.parse(context.refreshAfter)))) throw new TypeError('routing topology refreshAfter is invalid');
}
