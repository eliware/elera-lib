import { expect, test, jest } from '@jest/globals';
import { createDb } from '../src/client/create-db.mjs';

const profile = { host: 'db', port: 3306, user: 'u', password: 'p', database: 'app' };
const bundle = { bundleVersion: 'v1', database: 'app', credentials: { username: 'u', password: 'p' }, routes: { primary: [{ host: 'db', port: 3306 }], balanced: [{ host: 'read', port: 3306, weight: 10 }, { host: 'read2', port: 3306, weight: 10 }] }, expiresAt: new Date(Date.now() + 60000).toISOString() };
const connection = () => ({ query: jest.fn(async (sql) => [[sql]]), execute: jest.fn(async (sql) => [[sql]]), beginTransaction: jest.fn(async () => {}), commit: jest.fn(async () => {}), rollback: jest.fn(async () => {}), release: jest.fn() });
const driver = (behavior = {}) => ({ createPool: jest.fn(() => ({ query: behavior.query ?? jest.fn(async (sql) => [[sql]]), execute: behavior.execute ?? jest.fn(async (sql) => [[sql]]), getConnection: behavior.getConnection ?? jest.fn(async () => connection()), end: jest.fn(async () => {}) })) });

test('creates a client and routes reads, writes, transactions, health, and close', async () => {
  let now = Date.now();
  const log = { debug: jest.fn() };
  const client = await createDb({ primary: profile, balanced: { host: 'read', port: 3306 }, mysqlLib: driver(), log, now: () => now });
  await client.query('SELECT 1');
  await client.query('SELECT 1', [], { route: 'balanced' });
  await client.execute('UPDATE app SET x=1');
  await client.transaction(async (tx) => { await tx.query('SELECT 1'); await tx.execute('UPDATE app SET x=1'); return true; });
  await expect(client.health()).resolves.toMatchObject({ ok: true, route: 'primary' });
  await expect(client.health('balanced')).resolves.toMatchObject({ ok: true, route: 'balanced' });
  expect(client.classify('SELECT 1')).toBe('balanced');
  expect(client.config.primary.password).toBeUndefined();
  expect(log.debug).toHaveBeenCalled();
  now += 1;
  await client.close();
});
test('collects telemetry and starts it with the routing stream', async () => { const client = await createDb({ primary: profile, mysqlLib: driver(), telemetry: true }); const stream = { connect: jest.fn(async () => {}), setOnUpdate: jest.fn(), sendTelemetry: jest.fn() }; await client.attachRoutingStream(stream); await client.query('SELECT 1'); expect(client.telemetry.snapshot().queries).toBe(1); await client.close(); });
test('supports an injected telemetry sink', async () => { const telemetry = { begin: jest.fn(), record: jest.fn(), start: jest.fn(), stop: jest.fn() }; const client = await createDb({ primary: profile, mysqlLib: driver(), telemetry }); await client.query('SELECT 1'); await client.attachRoutingStream({ connect: jest.fn(async () => {}), setOnUpdate: jest.fn() }); await client.close(); expect(telemetry.start).toHaveBeenCalled(); expect(telemetry.stop).toHaveBeenCalled(); });
test('records injected telemetry when its clock is unavailable', async () => { const telemetry = { begin: jest.fn(() => undefined), record: jest.fn(), start: jest.fn(), stop: jest.fn() }; const client = await createDb({ primary: profile, mysqlLib: driver(), telemetry }); await client.query('SELECT 1'); expect(telemetry.record).toHaveBeenCalledWith({ latencyMs: 0 }); await client.close(); });
test('records elapsed latency on successful and failed queries', async () => { let clock = 10; const telemetry = { begin: jest.fn(() => clock), record: jest.fn(), start: jest.fn(), stop: jest.fn() }; let calls = 0; const query = jest.fn(async () => { calls += 1; if (calls > 1) { clock = 14; throw new Error('query failed'); } clock = 13; return [['ok']]; }); const client = await createDb({ primary: profile, mysqlLib: driver({ query }), telemetry, now: () => clock }); await client.query('SELECT 1'); await expect(client.query('SELECT 1')).rejects.toThrow('SQL operation failed'); expect(telemetry.record).toHaveBeenCalledWith({ latencyMs: 3 }); expect(telemetry.record.mock.calls.some(([entry]) => entry.failed === true && entry.latencyMs > 0)).toBe(true); await client.close(); });
test('uses the telemetry start time when it is zero', async () => { const telemetry = { begin: () => 0, record: jest.fn() }; const client = await createDb({ primary: profile, mysqlLib: driver(), telemetry, now: () => 5 }); await client.query('SELECT 1'); expect(telemetry.record).toHaveBeenCalledWith({ latencyMs: 5 }); await client.close(); });

test('resolves credentials and builds routes from a valid bundle', async () => {
  const client = await createDb({ primary: { host: 'fallback', port: 3306, database: 'app' }, bundle, credentialProvider: jest.fn(async () => ({ user: 'u', password: 'p' })), mysqlLib: driver() });
  expect(client.bundle()).toBe(bundle);
  await client.refresh({ ...bundle, bundleVersion: 'v2', routes: { primary: [{ host: 'new', port: 3306 }] } });
  expect(client.bundle().bundleVersion).toBe('v2');
  await client.close();
});

test('handles transaction rollback and stream routing events', async () => {
  const bad = Object.assign(new Error('boom'), { code: 'ER_LOCK_DEADLOCK' });
  const conn = connection(); conn.query.mockRejectedValueOnce(bad);
  const client = await createDb({ primary: profile, bundle, mysqlLib: driver({ getConnection: jest.fn(async () => conn) }) });
  await expect(client.transaction(async (tx) => tx.query('UPDATE x'))).rejects.toThrow();
  const handlers = {}; const stream = { connect: jest.fn(async () => {}), close: jest.fn(), setOnUpdate: jest.fn((handler) => { handlers.update = handler; }) };
  const stop = await client.attachRoutingStream(stream);
  await handlers.update({ type: 'routing.drain', node: 'read' });
  await handlers.update({ type: 'routing.recovery', node: 'read' });
  await handlers.update({ type: 'routing.update', routes: { primary: [{ host: 'new', port: 3306 }] }, database: 'app', bundleVersion: 'v3' });
  stop();
  await expect(client.attachRoutingStream(null)).rejects.toThrow('routing stream');
  await client.close();
});

test('rejects invalid setup and expired refresh bundles', async () => {
  await expect(createDb()).rejects.toThrow('primary connection profile');
  await expect(createDb({ primary: { ...profile, user: '' }, mysqlLib: driver() })).rejects.toThrow('primary.user');
  const client = await createDb({ primary: profile, mysqlLib: driver() });
  const expired = await createDb({ primary: profile, bundle: { ...bundle, expiresAt: new Date(0).toISOString() }, mysqlLib: driver() }); await expired.close();
  await expect(client.refresh({ ...bundle, expiresAt: new Date(0).toISOString() })).rejects.toThrow('expired');
  await client.close();
});

test('retries a retryable balanced query and supports explicit connections and optional stream handlers', async () => {
  const error = Object.assign(new Error('temporary'), { code: 'ECONNRESET' });
  const pool = driver({ query: jest.fn().mockRejectedValueOnce(error).mockResolvedValue([['ok']]) });
  const client = await createDb({ primary: profile, bundle, credentialProvider: async () => ({ user: 'u', password: 'p' }), mysqlLib: pool });
  await client.query('SELECT 1', [], { route: 'balanced' });
  const explicit = { query: jest.fn(async () => ['explicit']), execute: jest.fn(async () => ['explicit']) };
  await client.query('SELECT 1', [], { connection: explicit }); await client.execute('SELECT 1', [], { connection: explicit });
  const stream = { connect: jest.fn(async () => {}) }; await client.attachRoutingStream(stream); await client.close();
});

test('covers non-retryable errors, credential overlays, and refresh without balanced routes', async () => {
  const failure = Object.assign(new Error('bad query'), { code: 'ER_PARSE_ERROR' });
  const client = await createDb({ primary: profile, balanced: { host: 'read', port: 3306 }, credentialProvider: async () => ({ user: 'u', password: 'p' }), mysqlLib: driver({ query: jest.fn(async () => { throw failure; }) }) });
  await expect(client.query('SELECT 1', [], { route: 'balanced' })).rejects.toThrow('SQL operation failed');
  await expect(client.refresh({ ...bundle, routes: { primary: [{ host: 'new', port: 3306 }] } })).resolves.toMatchObject({ bundleVersion: 'v1' });
  await client.close();
});
test('refreshes a bundle with a balanced route and handles stream events without versions', async () => {
  const client = await createDb({ primary: profile, mysqlLib: driver() });
  await expect(client.refresh(bundle)).resolves.toMatchObject({ bundleVersion: 'v1' });
  const handler = {}; await client.attachRoutingStream({ connect: async () => {}, setOnUpdate: (value) => { handler.value = value; } });
  await handler.value({ type: 'routing.update', routes: { primary: [{ host: 'new', port: 3306 }] }, database: 'app' });
  await handler.value({ type: 'routing.resync', bundle: { ...bundle, routes: { primary: [{ host: 'resynced', port: 3306 }] } } });
  await client.close();
});
test('refreshes a primary-only client and processes drain/recovery without a balanced pool', async () => { const client = await createDb({ primary: profile, mysqlLib: driver() }); await client.refresh({ ...bundle, routes: { primary: [{ host: 'new', port: 3306 }] }, bundleVersion: undefined }); const handler = {}; await client.attachRoutingStream({ connect: async () => {}, setOnUpdate: (value) => { handler.value = value; } }); await handler.value({ type: 'routing.drain', node: 'new' }); await handler.value({ type: 'routing.recovery', node: 'new' }); await client.close(); });
test('retries a balanced query when balanced is the default routing policy and tolerates rollback failure', async () => { const retryable = Object.assign(new Error('temporary'), { code: 'ECONNRESET' }); const client = await createDb({ primary: profile, bundle, routing: 'balanced', mysqlLib: driver({ query: jest.fn().mockRejectedValueOnce(retryable).mockResolvedValue([['ok']]) }) }); await expect(client.query('SELECT 1')).resolves.toBeTruthy(); const rollback = connection(); rollback.query.mockRejectedValueOnce(new Error('query')); rollback.rollback.mockRejectedValueOnce(new Error('rollback')); const txClient = await createDb({ primary: profile, mysqlLib: driver({ getConnection: jest.fn(async () => rollback) }) }); await expect(txClient.transaction(async (tx) => tx.query('bad'))).rejects.toThrow(); await txClient.close(); await client.close(); });
test('preserves credentials when a refreshed bundle omits them and supports initial stream resync', async () => { const client = await createDb({ primary: profile, mysqlLib: driver() }); await expect(client.refresh({ ...bundle, credentials: undefined })).resolves.toBeTruthy(); await client.close(); const streamClient = await createDb({ primary: profile, mysqlLib: driver() }); let update; await streamClient.attachRoutingStream({ connect: async () => {}, setOnUpdate: (handler) => { update = handler; } }); await update({ type: 'routing.update', routes: { primary: [{ host: 'new', port: 3306 }] }, database: 'app' }); await streamClient.close(); });
test('changes availability for a selected route without exposing pool internals', async () => { const client = await createDb({ primary: profile, balanced: { host: 'read', port: 3306 }, mysqlLib: driver() }); client.setNodeAvailability('primary', 'db', false); await expect(client.query('UPDATE app SET x=1')).rejects.toThrow('no eligible'); client.setNodeAvailability('primary', 'db', true); await expect(client.query('UPDATE app SET x=1')).resolves.toBeTruthy(); client.setNodeAvailability('balanced', 'read', false); await expect(client.query('SELECT 1', [], { route: 'balanced' })).rejects.toThrow('no eligible'); client.setNodeAvailability('balanced', 'read', true); await client.close(); });

test('uses the active primary credentials and expiry when stream updates omit optional fields', async () => {
  const client = await createDb({ primary: profile, mysqlLib: driver() });
  let update;
  await client.attachRoutingStream({ connect: async () => {}, setOnUpdate: (handler) => { update = handler; } });
  await update({ type: 'routing.update', routes: { primary: [{ host: 'next', port: 3306 }] } });
  expect(client.bundle().routes.primary[0].host).toBe('next');
  await client.close();
});

test('drains both route pools and exposes node lifecycle state', async () => {
  const client = await createDb({ primary: profile, balanced: { host: 'read', port: 3306 }, bundle, mysqlLib: driver() });
  const operation = client.drain('read', 1);
  expect(client.nodeStates().find((node) => node.host === 'read')).toMatchObject({ state: 'draining', available: false });
  await expect(operation.wait()).resolves.toEqual([expect.any(Array), expect.any(Array)]);
  await operation.forceClose();
  await client.close();
});

test('does not retry an uncertain write on another node', async () => {
  const failure = Object.assign(new Error('connection lost'), { code: 'ECONNRESET' });
  const query = jest.fn().mockRejectedValue(failure);
  const client = await createDb({ primary: profile, balanced: { host: 'read', port: 3306 }, bundle, mysqlLib: driver({ query }) });
  await expect(client.query('UPDATE app SET value = 1', [], { route: 'balanced' })).rejects.toThrow();
  expect(query).toHaveBeenCalledTimes(1);
  await client.close();
});

test('does not replace a newer bundle with an older resync', async () => {
  const client = await createDb({ primary: profile, bundle, mysqlLib: driver() });
  await expect(client.refresh({ ...bundle, bundleVersion: 'v0' })).resolves.toMatchObject({ bundleVersion: 'v1' });
  expect(client.bundle().bundleVersion).toBe('v1');
  await client.close();
});

test('accepts first bundle versions and unversioned refreshes', async () => {
  const first = await createDb({ primary: profile, mysqlLib: driver() });
  await expect(first.refresh({ ...bundle, bundleVersion: 2 })).resolves.toMatchObject({ bundleVersion: 2 });
  await expect(first.refresh({ ...bundle, bundleVersion: undefined })).resolves.toMatchObject({ bundleVersion: null });
  await first.close();
});

test('replaces the writer pool and preserves explicit application assignments on refresh', async () => {
  const pools = [];
  const mysqlLib = { createPool: jest.fn((options) => { const pool = { options, query: jest.fn(async () => [[options.host]]), execute: jest.fn(async () => [[options.host]]), getConnection: jest.fn(async () => connection()), end: jest.fn(async () => {}) }; pools.push(pool); return pool; }) };
  const client = await createDb({ primary: profile, mysqlLib });
  await client.refresh({ ...bundle, bundleVersion: 2, writer: { host: 'writer-b', port: 3306 }, failover: [{ host: 'writer-c', port: 3306 }], readers: [{ host: 'reader-b', port: 3306 }], routes: { primary: [{ host: 'writer-b', port: 3306 }], balanced: [{ host: 'reader-b', port: 3306 }] } });
  expect(client.nodeStates().filter((node) => node.route === 'primary').map((node) => node.host)).toEqual(['writer-b', 'writer-c']);
  expect(client.nodeStates().filter((node) => node.route === 'balanced').map((node) => node.host)).toEqual(['reader-b']);
  await expect(client.execute('UPDATE app SET value=1')).resolves.toEqual([['writer-b']]);
  await expect(client.query('SELECT 1')).resolves.toEqual([['reader-b']]);
  await client.close();
});

test('finishes an in-flight query while excluding the drained node from new work', async () => {
  let release;
  const pending = new Promise((resolve) => { release = resolve; });
  const mysqlLib = { createPool: jest.fn((options) => ({ options, query: jest.fn((sql) => options.host === 'writer' && sql === 'pending' ? pending : Promise.resolve([[options.host]])), execute: jest.fn(async () => [[options.host]]), getConnection: jest.fn(async () => connection()), end: jest.fn(async () => {}) })) };
  const client = await createDb({ primary: profile, bundle: { ...bundle, writer: { host: 'writer', port: 3306 }, failover: [{ host: 'backup', port: 3306 }], routes: { primary: [{ host: 'writer', port: 3306 }], balanced: [] } }, mysqlLib });
  const inFlight = client.query('pending', [], { route: 'primary' });
  const drain = client.drain('writer', 90000);
  await expect(client.execute('UPDATE app SET x=1', [], { route: 'primary' })).resolves.toEqual([['backup']]);
  release([['writer']]);
  await expect(inFlight).resolves.toEqual([['writer']]);
  expect(drain.timeoutMs).toBe(45000);
  await client.close();
});

test('applies explicit writer updates delivered through the routing stream', async () => {
  const client = await createDb({ primary: profile, bundle, mysqlLib: driver() });
  let update;
  await client.attachRoutingStream({ connect: async () => {}, setOnUpdate: (handler) => { update = handler; } });
  await update({ type: 'routing.update', writer: { host: 'stream-writer', port: 3306 }, failover: [{ host: 'stream-backup', port: 3306 }], readers: [{ host: 'stream-reader', port: 3306 }], routes: { primary: [{ host: 'stream-writer', port: 3306 }], balanced: [{ host: 'stream-reader', port: 3306 }] }, bundleVersion: 3, database: 'app' });
  expect(client.nodeStates().filter((node) => node.route === 'primary').map((node) => node.host)).toEqual(['stream-writer', 'stream-backup']);
  expect(client.nodeStates().filter((node) => node.route === 'balanced').map((node) => node.host)).toEqual(['stream-reader']);
  await client.close();
});

test('updates one application client without changing another client assignment', async () => {
  const clientA = await createDb({ primary: profile, bundle: { ...bundle, writer: { host: 'app-a-writer' }, failover: [{ host: 'a-backup' }] }, mysqlLib: driver() });
  const clientB = await createDb({ primary: profile, bundle: { ...bundle, writer: { host: 'app-b-writer' }, failover: [{ host: 'b-backup' }] }, mysqlLib: driver() });
  let update;
  await clientA.attachRoutingStream({ connect: async () => {}, setOnUpdate: (handler) => { update = handler; } });
  await update({ type: 'routing.update', writer: { host: 'app-a-new-writer' }, failover: [{ host: 'a-backup' }], bundleVersion: 2, routes: { primary: [{ host: 'app-a-new-writer', port: 3306 }], balanced: bundle.routes.balanced }, database: 'app' });
  expect(clientA.bundle().writer.host).toBe('app-a-new-writer');
  expect(clientB.bundle().writer.host).toBe('app-b-writer');
  await clientA.close(); await clientB.close();
});

test('merges writer-only updates with the active route sets', async () => {
  const client = await createDb({ primary: profile, bundle, mysqlLib: driver() });
  let update;
  await client.attachRoutingStream({ connect: async () => {}, setOnUpdate: (handler) => { update = handler; } });
  await update({ type: 'routing.update', writer: { host: 'writer-only', port: 3306 }, failover: [], bundleVersion: 2 });
  expect(client.nodeStates().find((node) => node.route === 'primary').host).toBe('writer-only');
  await client.close();
});
