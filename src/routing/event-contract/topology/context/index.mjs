import { assertJsonValue } from '../../json-value.mjs';
import { validateTopologyIdentity } from './identity.mjs';
import { validateTopologyPorts } from './ports.mjs';
import { validateTopologyRefreshAfter } from './timestamp.mjs';

export function validateTopologyContext(context) {
  if (!context || typeof context !== 'object' || Array.isArray(context)) throw new TypeError('routing topology context is required');
  assertJsonValue(context, 'routing topology context');
  let snapshot;
  try { snapshot = structuredClone(context); } catch { throw new TypeError('routing topology context must contain cloneable JSON-compatible values'); }
  assertJsonValue(snapshot, 'routing topology context');
  validateTopologyIdentity(snapshot.nodeIdentity);
  for (const key of Object.keys(snapshot)) if (!['nodeIdentity', 'ports', 'clusterCondition', 'refreshAfter'].includes(key)) throw new TypeError('routing topology context field is unknown');
  validateTopologyPorts(snapshot.ports);
  if (typeof snapshot.clusterCondition !== 'string' || snapshot.clusterCondition.trim().length === 0) throw new TypeError('routing topology clusterCondition is required');
  validateTopologyRefreshAfter(snapshot.refreshAfter);
  return snapshot;
}
