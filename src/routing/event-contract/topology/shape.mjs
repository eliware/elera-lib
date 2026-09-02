export function validateTopologyShape(event) {
  if (!event.topology || typeof event.topology !== 'object' || Array.isArray(event.topology)) throw new TypeError('routing topology topology is required');
  if (!Object.hasOwn(event.topology, 'nodes')) throw new TypeError('routing topology nodes are required');
  if (Object.keys(event.topology).some((key) => key !== 'nodes')) throw new TypeError('routing topology field is unknown');
}
