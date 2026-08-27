import { asSqlError } from '../errors.mjs';
const connectionFailure = (error) => asSqlError(error).retryable;
export function createNodePool({ profile, mysqlLib, log, now = () => Date.now(), quarantineMs = 5000 }) {
  const { acquireTimeout: _acquireTimeout, ...driverOptions } = profile.options ?? {};
  const pool = mysqlLib.createPool({ host: profile.host, port: profile.port, user: profile.user, password: profile.password, database: profile.database, waitForConnections: true, ...driverOptions });
  const sessionStatements = profile.options?.sessionStatements ?? [];
  const withConnection = async (operation, sql, values) => { const connection = await pool.getConnection(); try { for (const statement of sessionStatements) await connection.query(statement); return operation(connection, sql, values); } finally { connection.release(); } };
  let failures = 0; let unavailableUntil = 0;
  return { host: profile.host, port: profile.port, weight: Number(profile.weight ?? 100), get available() { return now() >= unavailableUntil; }, get failures() { return failures; },
    async query(sql, values) { try { const result = sessionStatements.length ? await withConnection((connection, statement, params) => connection.query(statement, params), sql, values) : await pool.query(sql, values); failures = 0; return result; } catch (error) { if (connectionFailure(error)) { failures += 1; unavailableUntil = now() + quarantineMs; log?.warn?.('SQL node quarantined', { host: profile.host, port: profile.port, error: error.message }); } throw asSqlError(error); } },
    async execute(sql, values) { try { const result = sessionStatements.length ? await withConnection((connection, statement, params) => connection.execute(statement, params), sql, values) : await pool.execute(sql, values); failures = 0; return result; } catch (error) { if (connectionFailure(error)) { failures += 1; unavailableUntil = now() + quarantineMs; } throw asSqlError(error); } },
    async getConnection() { try { return await pool.getConnection(); } catch (error) { if (connectionFailure(error)) unavailableUntil = now() + quarantineMs; throw asSqlError(error); } },
    async health() { try { await pool.query('SELECT 1'); failures = 0; unavailableUntil = 0; return { ok: true, host: profile.host, port: profile.port }; } catch (error) { if (connectionFailure(error)) { failures += 1; unavailableUntil = now() + quarantineMs; } throw asSqlError(error); } },
    async close() { await pool.end(); } };
}
