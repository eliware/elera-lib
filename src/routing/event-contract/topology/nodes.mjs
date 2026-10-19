import { assertAvailabilityRecordShape } from "./nodes/record/shape.mjs";
import { validateAvailabilityRecord } from "./nodes/record/values.mjs";
import { detachAvailabilityRecord } from "./nodes/record/copy.mjs";
import { assertUniqueAvailabilityNodes } from "./nodes/duplicates.mjs";
import { assertAvailabilityRecordFields } from "./nodes/record/fields.mjs";
import { getArrayValueDescriptors } from "../json-value/array-shape.mjs";

export function validateTopologyNodes(nodes) {
  if (!Array.isArray(nodes)) throw new TypeError("routing topology nodes are required");
  const { descriptors, length } = getArrayValueDescriptors(nodes, "routing topology nodes");
  const snapshots = [];
  for (let index = 0; index < length; index += 1) {
    const record = descriptors[index].value;
    assertAvailabilityRecordShape(record);
    const snapshot = detachAvailabilityRecord(record);
    assertAvailabilityRecordFields(snapshot);
    validateAvailabilityRecord(snapshot);
    snapshots.push(snapshot);
  }
  assertUniqueAvailabilityNodes(snapshots);
  return snapshots;
}
