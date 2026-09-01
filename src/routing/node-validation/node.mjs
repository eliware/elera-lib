export function validateRoutingNode(node, name = 'routing node') {
  // Hosts may be Kubernetes names, container aliases, internal DNS names, or test identifiers.
  if (!node || typeof node !== 'object' || typeof node.host !== 'string' || node.host.trim() === '') throw new TypeError(`${name} host is required`);
  const port = node.port;
  if (Object.keys(node).some((key) => !['host', 'port', 'weight', 'nodeId'].includes(key))) throw new TypeError(`${name} field is unknown`);
  if (node.nodeId !== undefined && (typeof node.nodeId !== 'string' || node.nodeId.trim() === '')) throw new TypeError(`${name} nodeId is invalid`);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new TypeError(`${name} port is invalid`);
  if (node.weight !== undefined && (typeof node.weight !== 'number' || !Number.isFinite(node.weight) || node.weight < 0)) throw new TypeError(`${name} weight is invalid`);
  return { ...node, host: node.host.trim() };
}
