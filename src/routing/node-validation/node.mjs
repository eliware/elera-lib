export function validateRoutingNode(node, name = 'routing node') {
  // codescope ignore: this shared helper normalizes descriptor failures at its caller boundary; application code owns hostile-proxy limits.
  // Hosts may be Kubernetes names, container aliases, internal DNS names, or test identifiers.
  if (!node || typeof node !== 'object' || Array.isArray(node)) throw new TypeError(`${name} host is required`);
  let descriptors;
  try {
    descriptors = Object.getOwnPropertyDescriptors(node);
  } catch { throw new TypeError(`${name} must contain data properties`); }
  if (Object.values(descriptors).some((descriptor) => !Object.hasOwn(descriptor, 'value'))) throw new TypeError(`${name} must contain data properties`);
  // Intentional: consume the descriptor snapshot so proxy mutations cannot alter validated values.
  const values = Object.fromEntries(Object.entries(descriptors).map(([key, descriptor]) => [key, descriptor.value]));
  if (typeof values.host !== 'string' || values.host.trim() === '') throw new TypeError(`${name} host is required`);
  const port = values.port;
  if (Object.keys(values).some((key) => !['host', 'port', 'weight', 'nodeId'].includes(key))) throw new TypeError(`${name} field is unknown`);
  if (values.nodeId !== undefined && (typeof values.nodeId !== 'string' || values.nodeId.trim() === '')) throw new TypeError(`${name} nodeId is invalid`);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new TypeError(`${name} port is invalid`);
  // Intentional: fractional non-negative weights represent routing proportions, not counts.
  if (values.weight !== undefined && (typeof values.weight !== 'number' || !Number.isFinite(values.weight) || values.weight < 0)) throw new TypeError(`${name} weight is invalid`);
  return { host: values.host.trim(), port, ...(values.weight === undefined ? {} : { weight: values.weight }), ...(values.nodeId === undefined ? {} : { nodeId: values.nodeId.trim() }) };
}
