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
  await client.close();
});
test('refreshes a primary-only client and processes drain/recovery without a balanced pool', async () => { const client = await createDb({ primary: profile, mysqlLib: driver() }); await client.refresh({ ...bundle, routes: { primary: [{ host: 'new', port: 3306 }] }, bundleVersion: undefined }); const handler = {}; await client.attachRoutingStream({ connect: async () => {}, setOnUpdate: (value) => { handler.value = value; } }); await handler.value({ type: 'routing.drain', node: 'new' }); await handler.value({ type: 'routing.recovery', node: 'new' }); await client.close(); });
test('retries a balanced query when balanced is the default routing policy and tolerates rollback failure', async () => { const retryable = Object.assign(new Error('temporary'), { code: 'ECONNRESET' }); const client = await createDb({ primary: profile, bundle, routing: 'balanced', mysqlLib: driver({ query: jest.fn().mockRejectedValueOnce(retryable).mockResolvedValue([['ok']]) }) }); await expect(client.query('SELECT 1')).resolves.toBeTruthy(); const rollback = connection(); rollback.query.mockRejectedValueOnce(new Error('query')); rollback.rollback.mockRejectedValueOnce(new Error('rollback')); const txClient = await createDb({ primary: profile, mysqlLib: driver({ getConnection: jest.fn(async () => rollback) }) }); await expect(txClient.transaction(async (tx) => tx.query('bad'))).rejects.toThrow(); await txClient.close(); await client.close(); });
test('preserves credentials when a refreshed bundle omits them and supports initial stream resync', async () => { const client = await createDb({ primary: profile, mysqlLib: driver() }); await expect(client.refresh({ ...bundle, credentials: undefined })).resolves.toBeTruthy(); await client.close(); const streamClient = await createDb({ primary: profile, mysqlLib: driver() }); let update; await streamClient.attachRoutingStream({ connect: async () => {}, setOnUpdate: (handler) => { update = handler; } }); await update({ type: 'routing.update', routes: { primary: [{ host: 'new', port: 3306 }] }, database: 'app' }); await streamClient.close(); });

test('uses the active primary credentials and expiry when stream updates omit optional fields', async () => {
  const client = await createDb({ primary: profile, mysqlLib: driver() });
  let update;
  await client.attachRoutingStream({ connect: async () => {}, setOnUpdate: (handler) => { update = handler; } });
  await update({ type: 'routing.update', routes: { primary: [{ host: 'next', port: 3306 }] } });
  expect(client.bundle().routes.primary[0].host).toBe('next');
  await client.close();
});
