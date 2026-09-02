export function validateAvailabilityRecord(record) {
  if (typeof record.nodeId !== 'string' || !record.nodeId.trim() || typeof record.address !== 'string' || !record.address.trim() || !Number.isInteger(record.sqlPort) || typeof record.state !== 'string' || !record.state.trim() || typeof record.draining !== 'boolean') throw new TypeError('routing topology availability record is invalid');
  if (record.sqlPort < 1 || record.sqlPort > 65535) throw new TypeError('routing topology availability port is invalid');
  for (const key of Object.keys(record)) if (!['nodeId', 'address', 'sqlPort', 'state', 'draining'].includes(key)) throw new TypeError('routing topology availability field is unknown');
}
