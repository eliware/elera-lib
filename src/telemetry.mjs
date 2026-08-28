export function createTelemetry({ application = 'default', intervalMs = 1000, now = () => Date.now(), setIntervalImpl = setInterval, clearIntervalImpl = clearInterval } = {}) {
  const stats = { queries: 0, failures: 0, retries: 0, reconnects: 0, failoverCount: 0, inflight: 0, totalLatencyMs: 0, maxLatencyMs: 0 };
  let timer;
  const begin = () => { stats.inflight += 1; return now(); };
  const record = ({ latencyMs = 0, failed = false, retry = false, reconnect = false, failover = false } = {}) => { stats.queries += 1; stats.inflight = Math.max(0, stats.inflight - 1); stats.totalLatencyMs += latencyMs; stats.maxLatencyMs = Math.max(stats.maxLatencyMs, latencyMs); if (failed) stats.failures += 1; if (retry) stats.retries += 1; if (reconnect) stats.reconnects += 1; if (failover) stats.failoverCount += 1; };
  const snapshot = () => ({ type: 'client.telemetry', application, ...stats, avgLatencyMs: stats.queries ? stats.totalLatencyMs / stats.queries : 0, sentAt: new Date(now()).toISOString() });
  return { begin, record, snapshot, start(stream) { if (timer) return; timer = setIntervalImpl(() => stream.sendTelemetry?.(snapshot()), intervalMs); timer.unref?.(); }, stop() { if (timer) clearIntervalImpl(timer); timer = undefined; } };
}
