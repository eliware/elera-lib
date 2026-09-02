export function assertUniqueAvailabilityNodes(records) {
  if (new Set(records.map((record) => record.nodeId)).size !== records.length) throw new TypeError('routing topology availability nodes contain duplicate nodeId');
}
