const recordFields = new Set(["nodeId", "address", "sqlPort", "state", "draining"]);

export function assertAvailabilityRecordFields(record) {
  if (Object.keys(record).some((key) => !recordFields.has(key)))
    throw new TypeError("routing topology availability field is unknown");
}
