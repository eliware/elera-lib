export function validateTopologyContext(context) {
  if (!context || typeof context !== 'object' || Array.isArray(context)) throw new TypeError('routing topology context is required');
  if (!context.nodeIdentity || typeof context.nodeIdentity !== 'object') throw new TypeError('routing topology nodeIdentity is required');
  for (const key of Object.keys(context)) if (!['nodeIdentity', 'ports', 'clusterCondition', 'refreshAfter'].includes(key)) throw new TypeError('routing topology context field is unknown');
  if (!context.ports || typeof context.ports !== 'object') throw new TypeError('routing topology ports are required');
  for (const [name, port] of Object.entries(context.ports)) if (!Number.isInteger(port) || port < 1 || port > 65535) throw new TypeError(`routing topology ports.${name} is invalid`);
  if (typeof context.clusterCondition !== 'string' || context.clusterCondition.length === 0) throw new TypeError('routing topology clusterCondition is required');
  if (context.refreshAfter !== undefined && Number.isNaN(Date.parse(context.refreshAfter))) throw new TypeError('routing topology refreshAfter is invalid');
}
