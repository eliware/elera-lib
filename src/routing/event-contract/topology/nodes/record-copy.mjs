import { assertJsonValue } from '../../json-value.mjs';

export function detachAvailabilityRecord(record) {
  assertJsonValue(record, 'routing topology availability record');
  try { return structuredClone(record); }
  catch { throw new TypeError('routing topology availability record must contain cloneable JSON-compatible values'); }
}
