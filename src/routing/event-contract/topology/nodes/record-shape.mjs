export function assertAvailabilityRecordShape(record) {
  if (!record || typeof record !== 'object' || Array.isArray(record)) throw new TypeError('routing topology availability record is invalid');
}
