export function createValidatedTopologyEvent(event, context, topology) {
  return { ...event, context, topology };
}
