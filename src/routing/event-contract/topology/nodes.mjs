import { assertAvailabilityRecordShape } from "./nodes/record/shape.mjs";
import { validateAvailabilityRecord } from "./nodes/record/values.mjs";
import { detachAvailabilityRecord } from "./nodes/record/copy.mjs";
import { assertUniqueAvailabilityNodes } from "./nodes/duplicates.mjs";
import { assertAvailabilityRecordFields } from "./nodes/record/fields.mjs";

export function validateTopologyNodes(nodes) {
  if (!Array.isArray(nodes)) throw new TypeError("routing topology nodes are required");
  const snapshots = [];
  for (const record of nodes) {
    assertAvailabilityRecordShape(record);
    const snapshot = detachAvailabilityRecord(record);
    assertAvailabilityRecordFields(snapshot);
    validateAvailabilityRecord(snapshot);
    snapshots.push(snapshot);
  }
  assertUniqueAvailabilityNodes(snapshots);
  return snapshots;
}
