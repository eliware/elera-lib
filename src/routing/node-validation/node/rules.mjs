export function validateNodeValues(values, name) {
  if (typeof values.host !== 'string' || values.host.trim() === '') throw new TypeError(`${name} host is required`);
  if (Object.keys(values).some((key) => !['host', 'port', 'weight', 'nodeId'].includes(key))) throw new TypeError(`${name} field is unknown`);
  if (values.nodeId !== undefined && (typeof values.nodeId !== 'string' || values.nodeId.trim() === '')) throw new TypeError(`${name} nodeId is invalid`);
  if (!Number.isInteger(values.port) || values.port < 1 || values.port > 65535) throw new TypeError(`${name} port is invalid`);
  if (values.weight !== undefined && (typeof values.weight !== 'number' || !Number.isFinite(values.weight) || values.weight < 0)) throw new TypeError(`${name} weight is invalid`);
}

export function normalizeNodeValues(values) {
  return { host: values.host.trim(), port: values.port, ...(values.weight === undefined ? {} : { weight: values.weight }), ...(values.nodeId === undefined ? {} : { nodeId: values.nodeId.trim() }) };
}
