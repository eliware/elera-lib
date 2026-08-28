export function writerAssignment(bundle) {
  if (!bundle?.writer?.host) throw new TypeError('routing bundle writer is required');
  return { host: bundle.writer.host, port: Number(bundle.writer.port ?? 3306) };
}

export function failoverNodes(bundle) {
  if (!Array.isArray(bundle?.failover)) throw new TypeError('routing bundle failover is required');
  return bundle.failover.map(({ host, port = 3306 }) => ({ host, port: Number(port) }));
}
