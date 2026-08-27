import { expect, jest, test } from '@jest/globals';
import { bundleNeedsRefresh, bundleExpired } from '../src/bundle.mjs';
import { redactedProfile } from '../src/config.mjs';
import { SqlClientError, asSqlError } from '../src/errors.mjs';
import { createAdminSql } from '../src/admin/sql.mjs';
import { createDbFromBundle } from '../src/client/from-bundle.mjs';
import { selectRouteNodes } from '../src/routing/node-set.mjs';
import { createRoutingStream } from '../src/routing/stream-client.mjs';
import { createSqlVerifier } from '../src/verification/sql.mjs';
import { validateProfile } from '../src/config.mjs';

test('executes default helper arguments', async () => {
  const future = { expiresAt: '2099-01-01' }; expect(bundleExpired(future)).toBe(false); expect(bundleNeedsRefresh(future)).toBe(false); expect(redactedProfile({ host: 'db', database: 'app' })).toMatchObject({ host: 'db' });
  expect(new SqlClientError('x').code).toBe('SQL_CLIENT_ERROR'); expect(asSqlError(new Error('x')).retryable).toBe(false);
  const admin = createAdminSql({ query: jest.fn(async () => [[]]) }); await admin.migration(); expect(selectRouteNodes({ bundle: { ...future, routes: { primary: [{ host: 'db', port: 3306 }] } } })).toHaveLength(1);
  const verifier = createSqlVerifier({ query: jest.fn(async () => [[]]) }); await verifier.account('u'); await verifier.schema('db');
  expect(() => validateProfile()).toThrow(); expect(validateProfile({ host: 'db', database: 'app' }).host).toBe('db');
});

test('creates a database client with the default mysql factory and handles missing event versions', async () => {
  const fake = { createPool: jest.fn(() => ({ query: jest.fn(async () => [[]]), execute: jest.fn(async () => [[]]), getConnection: jest.fn(async () => ({ query: jest.fn(), execute: jest.fn(), beginTransaction: jest.fn(), commit: jest.fn(), rollback: jest.fn(), release: jest.fn() })), end: jest.fn(async () => {}) })) };
  const db = await createDbFromBundle({ bundle: { database: 'app', identity: 'id', credentials: { username: 'u', password: 'p' }, routes: { primary: [{ host: 'db', port: 3306 }] }, expiresAt: '2099-01-01' }, mysqlLib: fake }); await db.close();
  await expect(createDbFromBundle()).rejects.toThrow();
  const stream = createRoutingStream({ endpoint: 'http://db', fetchBundle: async () => ({}), WebSocketImpl: class { constructor() {} } }); await stream.connect(); stream.close();
  await expect(Promise.resolve().then(() => selectRouteNodes())).rejects.toThrow();
  await expect(createSqlVerifier({ query: jest.fn(async () => [[]]) }).all()).resolves.toMatchObject({ verified: false });
});
