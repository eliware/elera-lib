import { log as defaultLog } from '@eliware/common';
import * as mysql from 'mysql2/promise';
import { validateProfile, redactedProfile } from '../config.mjs';
import { asSqlError } from '../errors.mjs';
import { resolveCredentials, credentialContext } from '../credential-provider.mjs';
import { validateBundle, bundleExpired, bundleNeedsRefresh } from '../bundle.mjs';
import { createRouteFactory } from './route-factory.mjs';
import { classifyQuery, routeFor } from '../routing.mjs';
import { compareBundleVersions } from '../routing/bundle-version.mjs';
import { clientDrainTimeout } from '../lifecycle/drain-policy.mjs';

const olderVersion = (candidate, current) => compareBundleVersions(candidate, current) < 0;

export async function createDb({ primary, balanced, bundle, credentialProvider, mysqlLib = mysql, log = defaultLog, routing = 'auto', identity, quarantineMs = 5000, drainTimeoutMs = 45000, now = () => Date.now() } = {}) {
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
  const makeRoute = (route, fallback) => createRouteFactory({ bundle: activeBundle, now, mysqlLib, log, quarantineMs })(route, fallback);
  let primaryPool = makeRoute('primary', primaryConfig);
  let balancedPool = balancedConfig || activeBundle?.routes?.balanced ? makeRoute('balanced', balancedConfig ?? primaryConfig) : null;
  const choose = (sql, options = {}) => options.connection ?? (routeFor(sql, options.route ?? routing) === 'balanced' && balancedPool ? balancedPool : primaryPool);
  const client = {
    async query(sql, values, options) { const selected = choose(sql, options); try { return await selected.query(sql, values); } catch (error) { const requestedRoute = options?.route ?? routing; if (error.retryable && balancedPool && routeFor(sql, requestedRoute) === 'balanced' && classifyQuery(sql) === 'balanced') return balancedPool.query(sql, values); throw error; } },
    async execute(sql, values, options) { return choose(sql, options).execute(sql, values); },
    async transaction(callback) { const node = primaryPool.choose(); const connection = await node.getConnection(); try { await connection.beginTransaction(); const tx = { query: (sql, values) => connection.query(sql, values), execute: (sql, values) => connection.execute(sql, values) }; const result = await callback(tx); await connection.commit(); return result; } catch (error) { await connection.rollback().catch(() => {}); throw asSqlError(error); } finally { connection.release(); } },
    async health(route = 'primary') { const started = now(); const selected = route === 'balanced' && balancedPool ? balancedPool : primaryPool; const nodes = await selected.health(); return { ok: nodes.some((node) => node.ok), route: selected === balancedPool ? 'balanced' : 'primary', nodes, latencyMs: now() - started }; },
    async refresh(nextBundle) { const candidate = validateBundle(nextBundle); if (bundleExpired(candidate, now())) throw new Error('routing bundle is expired'); if (olderVersion(candidate.bundleVersion, activeBundle?.bundleVersion)) return { bundleVersion: activeBundle?.bundleVersion, refreshRequired: bundleNeedsRefresh(activeBundle, now()) }; const previous = [primaryPool, balancedPool]; const credentials = candidate.credentials ?? { username: primaryConfig.user, password: primaryConfig.password }; const writer = candidate.writer ?? candidate.routes.primary?.[0]; const reader = candidate.readers?.[0] ?? candidate.routes.balanced?.[0]; primaryConfig = validateProfile({ ...primaryConfig, host: writer?.host, port: writer?.port, user: credentials.username, password: credentials.password, database: candidate.database }, 'primary'); balancedConfig = reader ? validateProfile({ ...primaryConfig, host: reader.host, port: reader.port }, 'balanced') : undefined; activeBundle = candidate; primaryPool = makeRoute('primary', primaryConfig); balancedPool = balancedConfig ? makeRoute('balanced', balancedConfig) : null; await Promise.all(previous.filter(Boolean).map((pool) => pool.close())); return { bundleVersion: activeBundle.bundleVersion ?? null, refreshRequired: bundleNeedsRefresh(activeBundle, now()) }; },
    async attachRoutingStream(stream) { if (!stream?.connect) throw new TypeError('routing stream is required'); stream.setOnUpdate?.(async (event) => { const update = event.type === 'routing.update' ? event : event.type === 'routing.resync' ? event.bundle : undefined; if (update && (update.writer || update.routes?.primary?.length)) await client.refresh({ ...activeBundle, ...update, database: update.database ?? activeBundle?.database ?? primaryConfig.database, credentials: update.credentials ?? activeBundle?.credentials, routes: update.routes ?? activeBundle?.routes, bundleVersion: update.bundleVersion ?? update.version ?? activeBundle?.bundleVersion, expiresAt: update.expiresAt ?? activeBundle?.expiresAt ?? new Date(now() + 60000).toISOString() }); if (event.type === 'routing.drain' || event.type === 'routing.recovery') for (const pool of [primaryPool, balancedPool].filter(Boolean)) (event.type === 'routing.drain' ? pool.drain : pool.recover)(event.node, drainTimeoutMs); }); await stream.connect(); return () => stream.close?.(); },
    drain(host, timeoutMs = drainTimeoutMs) { const effectiveTimeout = clientDrainTimeout(timeoutMs); const pools = [primaryPool, balancedPool].filter(Boolean); pools.forEach((pool) => pool.drain(host, effectiveTimeout)); return { host, timeoutMs: effectiveTimeout, wait: () => Promise.all(pools.map((pool) => pool.waitForIdle(effectiveTimeout))), forceClose: () => Promise.all(pools.map((pool) => pool.forceClose(host))) }; },
    nodeStates() { return [primaryPool, balancedPool].filter(Boolean).flatMap((pool) => pool.nodes.map((node) => ({ host: node.host, port: node.port, route: pool === primaryPool ? 'primary' : 'balanced', state: node.state, active: node.active, available: node.available }))); },
    setNodeAvailability(route, host, available) { const pool = route === 'balanced' ? balancedPool : primaryPool; pool?.setAvailability(host, available); },
    bundle: () => activeBundle,
    async close() { await Promise.all([primaryPool.close(), balancedPool?.close()]); },
    classify: classifyQuery,
    config: { primary: redactedProfile(primaryConfig), balanced: balancedConfig && redactedProfile(balancedConfig) }
  };
  log.debug?.('SQL client created', { balanced: Boolean(balancedPool), routing });
  return client;
}
