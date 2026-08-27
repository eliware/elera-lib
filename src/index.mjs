import { log as defaultLog } from '@eliware/common';
import * as mysql from 'mysql2/promise';
import { classifyQuery, routeFor } from './routing.mjs';

const required = (value, name) => { if (!value) throw new Error(`${name} is required`); return value; };
const poolOptions = (profile, defaults = {}) => ({
  host: required(profile.host, 'database host'), port: Number(profile.port ?? 3306),
  user: required(profile.user, 'database user'), password: required(profile.password, 'database password'),
  database: required(profile.database, 'database name'), waitForConnections: true,
  ...defaults, ...profile.options
});

export async function createDb({ primary, balanced, mysqlLib = mysql, log = defaultLog, routing = 'auto' } = {}) {
  const primaryPool = mysqlLib.createPool(poolOptions(required(primary, 'primary connection'), { connectionLimit: 10 }));
  let balancedPool;
  try { balancedPool = balanced ? mysqlLib.createPool(poolOptions({ ...primary, ...balanced })) : null; }
  catch (error) { await primaryPool.end(); throw error; }
  const choose = (sql, options = {}) => options.connection ? options.connection : (routeFor(sql, options.route ?? routing) === 'balanced' && balancedPool ? balancedPool : primaryPool);
  const client = {
    async query(sql, values, options) { return choose(sql, options).query(sql, values); },
    async execute(sql, values, options) { return choose(sql, options).execute(sql, values); },
    async transaction(callback) {
      const connection = await primaryPool.getConnection();
      try { await connection.beginTransaction(); const tx = { query: (sql, values) => connection.query(sql, values), execute: (sql, values) => connection.execute(sql, values) }; const result = await callback(tx); await connection.commit(); return result; }
      catch (error) { await connection.rollback(); throw error; } finally { connection.release(); }
    },
    async health(route = 'primary') { const pool = route === 'balanced' && balancedPool ? balancedPool : primaryPool; const started = Date.now(); await pool.query('SELECT 1'); return { ok: true, route: pool === balancedPool ? 'balanced' : 'primary', latencyMs: Date.now() - started }; },
    async close() { await Promise.all([primaryPool.end(), balancedPool?.end()]); },
    classify: classifyQuery,
    pools: { primary: primaryPool, balanced: balancedPool }
  };
  log.debug?.('SQL client created', { balanced: Boolean(balancedPool), routing });
  return client;
}

export async function createDbFromEnvironment({ env = process.env, ...options } = {}) {
  const primary = { host: env.MYSQL_PRIMARY_HOST ?? env.MYSQL_HOST, port: env.MYSQL_PRIMARY_PORT ?? env.MYSQL_PORT, user: env.MYSQL_USER, password: env.MYSQL_PASSWORD, database: env.MYSQL_DATABASE };
  const balanced = env.MYSQL_BALANCED_PORT ? { host: env.MYSQL_BALANCED_HOST ?? primary.host, port: env.MYSQL_BALANCED_PORT } : undefined;
  return createDb({ ...options, primary, balanced });
}

export { classifyQuery, routeFor };
