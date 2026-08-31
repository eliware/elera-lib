export function validateTopologyNodes(nodes) {
  if (!Array.isArray(nodes)) throw new TypeError('routing topology nodes are required');
  for (const record of nodes) {
    if (!record || typeof record !== 'object' || typeof record.nodeId !== 'string' || typeof record.address !== 'string' || !Number.isInteger(record.sqlPort) || typeof record.state !== 'string' || typeof record.draining !== 'boolean') throw new TypeError('routing topology availability record is invalid');
    if (record.sqlPort < 1 || record.sqlPort > 65535) throw new TypeError('routing topology availability port is invalid');
    for (const key of Object.keys(record)) if (!['nodeId', 'address', 'sqlPort', 'state', 'draining'].includes(key)) throw new TypeError('routing topology availability field is unknown');
  }
}
