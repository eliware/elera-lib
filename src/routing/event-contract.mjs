import { validateBundle } from '../bundle.mjs';

const eventTypes = new Set(['routing.update', 'routing.topology', 'routing.drain', 'routing.recovery', 'routing.shutdown']);

export function validateRoutingEvent(event) {
  if (!event || typeof event !== 'object' || !eventTypes.has(event.type)) throw new TypeError('unsupported routing event');
  if (!Number.isInteger(event.version) || event.version < 0) throw new TypeError('routing event version must be a non-negative integer');
  if (typeof event.generatedAt !== 'string' || Number.isNaN(Date.parse(event.generatedAt))) throw new TypeError('routing event generatedAt is required');
  if (event.type === 'routing.topology') return validateTopologyEvent(event);
  if (event.type === 'routing.update') validateBundle(Object.fromEntries(Object.entries(event).filter(([key]) => !['type', 'version', 'generatedAt'].includes(key))));
  if (event.type === 'routing.drain' || event.type === 'routing.recovery') validateContextEvent(event);
  if (event.type === 'routing.shutdown') {
    if (typeof event.node !== 'string' || event.node.length === 0) throw new TypeError('routing shutdown node is required');
    if (typeof event.reason !== 'string' || event.reason.length === 0) throw new TypeError('routing shutdown reason is required');
    if (!Number.isFinite(event.reconnectDeadlineMs) || event.reconnectDeadlineMs < 0) throw new TypeError('routing shutdown deadline must be non-negative');
    if (event.loadBalancerEndpoint !== undefined) {
      let url; try { url = new URL(event.loadBalancerEndpoint); } catch { throw new TypeError('routing shutdown endpoint must be an HTTP URL'); }
      if (!['http:', 'https:'].includes(url.protocol)) throw new TypeError('routing shutdown endpoint must be an HTTP URL');
    }
  }
  return event;
}

function validateTopologyEvent(event) {
  for (const key of ['type', 'version', 'generatedAt', 'node', 'context', 'topology']) if (!(key in event)) throw new TypeError('routing topology field is required');
  for (const key of Object.keys(event)) if (!['type', 'version', 'generatedAt', 'node', 'context', 'topology'].includes(key)) throw new TypeError('routing topology field is unknown');
  if (event.version < 1) throw new TypeError('routing topology version must be positive');
  if (!event.generatedAt.endsWith('Z')) throw new TypeError('routing topology generatedAt must be UTC');
  if (typeof event.node !== 'string' || event.node.length === 0) throw new TypeError('routing topology node is required');
  const context = event.context;
  if (!context || typeof context !== 'object' || Array.isArray(context)) throw new TypeError('routing topology context is required');
  if (!context.nodeIdentity || typeof context.nodeIdentity !== 'object') throw new TypeError('routing topology nodeIdentity is required');
  for (const key of Object.keys(context)) if (!['nodeIdentity', 'ports', 'clusterCondition', 'refreshAfter'].includes(key)) throw new TypeError('routing topology context field is unknown');
  if (!context.ports || typeof context.ports !== 'object') throw new TypeError('routing topology ports are required');
  for (const [name, port] of Object.entries(context.ports)) if (!Number.isInteger(port) || port < 1 || port > 65535) throw new TypeError(`routing topology ports.${name} is invalid`);
  if (typeof context.clusterCondition !== 'string' || context.clusterCondition.length === 0) throw new TypeError('routing topology clusterCondition is required');
  if (context.refreshAfter !== undefined && Number.isNaN(Date.parse(context.refreshAfter))) throw new TypeError('routing topology refreshAfter is invalid');
  if (!event.topology || !Array.isArray(event.topology.nodes)) throw new TypeError('routing topology nodes are required');
  for (const record of event.topology.nodes) {
    if (!record || typeof record !== 'object' || typeof record.nodeId !== 'string' || typeof record.address !== 'string' || !Number.isInteger(record.sqlPort) || typeof record.state !== 'string' || typeof record.draining !== 'boolean') throw new TypeError('routing topology availability record is invalid');
    if (record.sqlPort < 1 || record.sqlPort > 65535) throw new TypeError('routing topology availability port is invalid');
    for (const key of Object.keys(record)) if (!['nodeId', 'address', 'sqlPort', 'state', 'draining'].includes(key)) throw new TypeError('routing topology availability field is unknown');
  }
  return event;
}

function validateContextEvent(event) {
  if (typeof event.node !== 'string' || event.node.length === 0) throw new TypeError(`routing ${event.type.slice(8)} node is required`);
  if (!event.context || typeof event.context !== 'object' || Array.isArray(event.context)) throw new TypeError(`routing ${event.type.slice(8)} context is required`);
}
