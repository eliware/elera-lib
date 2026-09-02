import { assertJsonValue } from '../json-value.mjs';

export function validateTopologyNodes(nodes) {
  if (!Array.isArray(nodes)) throw new TypeError('routing topology nodes are required');
  // Intentional: topology size limits belong to the transport/consumer policy, not this pure schema validator.
  const snapshots = [];
  for (const record of nodes) {
    if (!record || typeof record !== 'object' || Array.isArray(record)) throw new TypeError('routing topology availability record is invalid');
    assertJsonValue(record, 'routing topology availability record');
    let snapshot;
    try { snapshot = structuredClone(record); } catch { throw new TypeError('routing topology availability record must contain cloneable JSON-compatible values'); }
    snapshots.push(snapshot);
    if (typeof snapshot.nodeId !== 'string' || !snapshot.nodeId.trim() || typeof snapshot.address !== 'string' || !snapshot.address.trim() || !Number.isInteger(snapshot.sqlPort) || typeof snapshot.state !== 'string' || !snapshot.state.trim() || typeof snapshot.draining !== 'boolean') throw new TypeError('routing topology availability record is invalid');
    if (snapshot.sqlPort < 1 || snapshot.sqlPort > 65535) throw new TypeError('routing topology availability port is invalid');
    for (const key of Object.keys(snapshot)) if (!['nodeId', 'address', 'sqlPort', 'state', 'draining'].includes(key)) throw new TypeError('routing topology availability field is unknown');
  }
  // Intentional: duplicate detection uses the same detached records that passed field validation.
  if (new Set(snapshots.map((record) => record.nodeId)).size !== snapshots.length) throw new TypeError('routing topology availability nodes contain duplicate nodeId');
  return snapshots;
}
