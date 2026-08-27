import { log as defaultLog } from '@eliware/common';
import * as mysql from 'mysql2/promise';
import { validateProfile, redactedProfile } from './config.mjs';
import { asSqlError } from './errors.mjs';
import { resolveCredentials, credentialContext } from './credentials.mjs';
import { validateBundle, bundleExpired, bundleNeedsRefresh } from './bundle.mjs';
import { createNodePool, createRoutePool } from './pools.mjs';
import { classifyQuery, routeFor } from './routing.mjs';

function bundleProfiles(bundle, route, base) { return (bundle.routes?.[route] ?? []).map((node) => ({ ...base, host: node.host, port: node.port, weight: node.weight })); }

export async function createDb({ primary, balanced, bundle, credentialProvider, mysqlLib = mysql, log = defaultLog, routing = 'auto', identity, quarantineMs = 5000, now = () => Date.now() } = {}) {
  if (!primary || typeof primary !== 'object') throw new TypeError('primary connection profile is required');
  const credentials = await resolveCredentials(credentialProvider, credentialContext(primary, { identity }));
  let primaryConfig = validateProfile({ ...primary, ...credentials }, 'primary');
  if (!primaryConfig.user || typeof primaryConfig.password !== 'string') throw new TypeError('primary.user and primary.password are required');
  let balancedConfig = balanced ? validateProfile({ ...primaryConfig, ...balanced, ...credentials }, 'balanced') : undefined;
  if (credentials.user || credentials.password) {
    primaryConfig = validateProfile({ ...primaryConfig, ...credentials }, 'primary');
    if (balancedConfig) balancedConfig = validateProfile({ ...balancedConfig, ...credentials }, 'balanced');
  }
  let activeBundle = bundle ? validateBundle(bundle) : undefined;
  const makeRoute = (route, fallback) => {
    const profiles = activeBundle && !bundleExpired(activeBundle, now()) ? bundleProfiles(activeBundle, route, fallback) : [];
    const configs = profiles.length ? profiles : [fallback];
    return createRoutePool(configs.map((profile) => createNodePool({ profile, mysqlLib, log, now, quarantineMs })));
  };
  let primaryPool = makeRoute('primary', primaryConfig);
  let balancedPool = balancedConfig || activeBundle?.routes?.balanced ? makeRoute('balanced', balancedConfig ?? primaryConfig) : null;
  const choose = (sql, options = {}) => options.connection ?? (routeFor(sql, options.route ?? routing) === 'balanced' && balancedPool ? balancedPool : primaryPool);
  const client = {
    async query(sql, values, options) { return choose(sql, options).query(sql, values); },
    async execute(sql, values, options) { return choose(sql, options).execute(sql, values); },
    async transaction(callback) { const node = primaryPool.choose(); const connection = await node.getConnection(); try { await connection.beginTransaction(); const tx = { query: (sql, values) => connection.query(sql, values), execute: (sql, values) => connection.execute(sql, values) }; const result = await callback(tx); await connection.commit(); return result; } catch (error) { await connection.rollback().catch(() => {}); throw asSqlError(error); } finally { connection.release(); } },
    async health(route = 'primary') { const started = now(); await choose('SELECT 1', { route }).query('SELECT 1'); return { ok: true, route: route === 'balanced' && balancedPool ? 'balanced' : 'primary', latencyMs: now() - started }; },
    async refresh(nextBundle) { const candidate = validateBundle(nextBundle); if (bundleExpired(candidate, now())) throw new Error('routing bundle is expired'); const previous = [primaryPool, balancedPool]; activeBundle = candidate; primaryPool = makeRoute('primary', primaryConfig); balancedPool = balancedConfig || candidate.routes?.balanced ? makeRoute('balanced', balancedConfig ?? primaryConfig) : null; await Promise.all(previous.filter(Boolean).map((pool) => pool.close())); return { bundleVersion: activeBundle.bundleVersion ?? null, refreshRequired: bundleNeedsRefresh(activeBundle, now()) }; },
    bundle: () => activeBundle,
    async close() { await Promise.all([primaryPool.close(), balancedPool?.close()]); },
    classify: classifyQuery,
    pools: { primary: primaryPool, balanced: balancedPool },
    config: { primary: redactedProfile(primaryConfig), balanced: balancedConfig && redactedProfile(balancedConfig) }
  };
  log.debug?.('SQL client created', { balanced: Boolean(balancedPool), routing });
  return client;
}

export async function createDbFromEnvironment({ env = process.env, ...options } = {}) {
  const primary = { host: env.MYSQL_PRIMARY_HOST ?? env.MYSQL_HOST, port: env.MYSQL_PRIMARY_PORT ?? env.MYSQL_PORT, user: env.MYSQL_USER, password: env.MYSQL_PASSWORD, database: env.MYSQL_DATABASE, options: { connectTimeout: env.MYSQL_CONNECT_TIMEOUT, acquireTimeout: env.MYSQL_ACQUIRE_TIMEOUT, connectionLimit: env.MYSQL_CONNECTION_LIMIT, queueLimit: env.MYSQL_QUEUE_LIMIT, ssl: env.MYSQL_SSL } };
  const balanced = env.MYSQL_BALANCED_PORT ? { host: env.MYSQL_BALANCED_HOST ?? primary.host, port: env.MYSQL_BALANCED_PORT } : undefined;
  return createDb({ ...options, primary, balanced });
}

export { classifyQuery, routeFor } from './routing.mjs';
export { validateProfile, redactedProfile } from './config.mjs';
export { SqlClientError, classifyError, asSqlError } from './errors.mjs';
export { validateBundle, bundleExpired, bundleNeedsRefresh } from './bundle.mjs';
