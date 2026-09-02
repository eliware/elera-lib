import { assertJsonValue } from '../json-value.mjs';

export function validateTopologyContext(context) {
  // Intentional: this boundary coordinates the topology context's independent identity, port, and timing rules.
  if (!context || typeof context !== 'object' || Array.isArray(context)) throw new TypeError('routing topology context is required');
  let snapshot;
  try { snapshot = structuredClone(context); } catch { throw new TypeError('routing topology context must contain cloneable JSON-compatible values'); }
  assertJsonValue(snapshot, 'routing topology context');
  // Intentional: nodeIdentity is an opaque JSON metadata object; only its required name is interpreted here.
  // Unknown nested fields are preserved because deployments may add correlation metadata without changing this contract.
  if (!snapshot.nodeIdentity || typeof snapshot.nodeIdentity !== 'object' || Array.isArray(snapshot.nodeIdentity) || !Object.hasOwn(snapshot.nodeIdentity, 'name') || typeof snapshot.nodeIdentity.name !== 'string' || snapshot.nodeIdentity.name.trim() === '') throw new TypeError('routing topology nodeIdentity is required');
  for (const key of Object.keys(snapshot)) if (!['nodeIdentity', 'ports', 'clusterCondition', 'refreshAfter'].includes(key)) throw new TypeError('routing topology context field is unknown');
  if (!snapshot.ports || typeof snapshot.ports !== 'object' || Array.isArray(snapshot.ports)) throw new TypeError('routing topology ports are required');
  assertJsonValue(snapshot.ports, 'routing topology ports');
  // codescope ignore: topology ports are detached and validated for safe names/ranges before the closed sql/http/ws allowlist; ws is optional.
  if (Object.keys(snapshot.ports).some((name) => !['sql', 'http', 'ws'].includes(name))) throw new TypeError('routing topology ports field is unknown');
  for (const [name, port] of Object.entries(snapshot.ports)) if (name !== name.trim() || name.length === 0 || !Number.isInteger(port) || port < 1 || port > 65535) throw new TypeError(`routing topology ports.${name} is invalid`);
  for (const name of ['sql', 'http']) if (!Object.hasOwn(snapshot.ports, name)) throw new TypeError(`routing topology ports.${name} is required`);
  if (typeof snapshot.clusterCondition !== 'string' || snapshot.clusterCondition.trim().length === 0) throw new TypeError('routing topology clusterCondition is required');
  if (snapshot.refreshAfter !== undefined) {
    // Intentional: refreshAfter is a timestamp format contract; scheduling policy decides whether it is stale.
    const match = typeof snapshot.refreshAfter === 'string' && snapshot.refreshAfter.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{3}))?Z$/);
    const parsed = match && Date.parse(snapshot.refreshAfter);
    const date = match ? new Date(parsed) : null;
    if (!match || Number.isNaN(parsed) || date.getUTCFullYear() !== Number(match[1]) || date.getUTCMonth() + 1 !== Number(match[2]) || date.getUTCDate() !== Number(match[3]) || date.getUTCHours() !== Number(match[4]) || date.getUTCMinutes() !== Number(match[5]) || date.getUTCSeconds() !== Number(match[6]) || date.getUTCMilliseconds() !== (match[7] ? Number(match[7]) : 0)) throw new TypeError('routing topology refreshAfter is invalid');
  }
  return snapshot;
}
