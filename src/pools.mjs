import { asSqlError } from './errors.mjs';

const connectionFailure = (error) => asSqlError(error).retryable;

export function createNodePool({ profile, mysqlLib, log, now = () => Date.now(), quarantineMs = 5000 }) {
  const { acquireTimeout: _acquireTimeout, ...driverOptions } = profile.options ?? {};
  const pool = mysqlLib.createPool({ host: profile.host, port: profile.port, user: profile.user, password: profile.password, database: profile.database, waitForConnections: true, ...driverOptions });
  let failures = 0; let unavailableUntil = 0;
  return {
    host: profile.host,
    port: profile.port,
    weight: Number(profile.weight ?? 100),
    get available() { return now() >= unavailableUntil; },
    get failures() { return failures; },
    async query(sql, values) { try { const result = await pool.query(sql, values); failures = 0; return result; } catch (error) { if (connectionFailure(error)) { failures += 1; unavailableUntil = now() + quarantineMs; log?.warn?.('SQL node quarantined', { host: profile.host, port: profile.port, error: error.message }); } throw asSqlError(error); } },
    async execute(sql, values) { try { const result = await pool.execute(sql, values); failures = 0; return result; } catch (error) { if (connectionFailure(error)) { failures += 1; unavailableUntil = now() + quarantineMs; } throw asSqlError(error); } },
    async getConnection() { try { return await pool.getConnection(); } catch (error) { if (connectionFailure(error)) unavailableUntil = now() + quarantineMs; throw asSqlError(error); } },
    async close() { await pool.end(); }
  };
}

export function createRoutePool(nodes) {
  let cursor = 0;
  const candidates = () => nodes.filter((node) => node.available);
  const choose = () => {
    const available = candidates();
    if (!available.length) throw new Error('no eligible SQL nodes available');
    const total = available.reduce((sum, node) => sum + Math.max(0, node.weight), 0);
    if (!total) return available[cursor++ % available.length];
    let target = (cursor++ % total); for (const node of available) { target -= Math.max(0, node.weight); if (target < 0) return node; }
    return available[available.length - 1];
  };
  return { nodes, choose, async query(sql, values) { return choose().query(sql, values); }, async execute(sql, values) { return choose().execute(sql, values); }, async close() { await Promise.all(nodes.map((node) => node.close())); } };
}
