import { assertAvailabilityRecordShape } from './record-shape.mjs';
import { validateAvailabilityRecord } from './record-values.mjs';
import { detachAvailabilityRecord } from './record-copy.mjs';
import { assertUniqueAvailabilityNodes } from './duplicates.mjs';

export function validateTopologyNodes(nodes) {
  if (!Array.isArray(nodes)) throw new TypeError('routing topology nodes are required');
  const snapshots = [];
  for (const record of nodes) {
    assertAvailabilityRecordShape(record);
    const snapshot = detachAvailabilityRecord(record);
    validateAvailabilityRecord(snapshot);
    snapshots.push(snapshot);
  }
  assertUniqueAvailabilityNodes(snapshots);
  return snapshots;
}
