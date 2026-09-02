import { expect, test } from '@jest/globals';
import { validateBundle } from '../../src/bundle/index.mjs';

const valid = { apiVersion: 'v1', application: 'app', database: 'logical-db', physicalDatabase: 'elera_db_123', identity: 'runtime', credentials: { username: 'u', password: 'p' }, writer: { host: 'a', port: 3306 }, readers: [], failover: [], bundleVersion: 1, nodeIdentity: 'node-a', ports: { sql: 3306, http: 8080 }, expiresAt: '2030-01-01T00:00:00Z', routes: { primary: [{ host: 'a', port: 3306 }], balanced: [] } };

test('validates expiry', () => {
  expect(() => validateBundle({ ...valid, expiresAt: '2000-01-01T00:00:00Z' })).toThrow('future');
  expect(() => validateBundle({ ...valid, expiresAt: undefined })).toThrow();
  expect(() => validateBundle({ ...valid, expiresAt: 'bad' })).toThrow();
  expect(() => validateBundle({ ...valid, expiresAt: '2030-02-30T00:00:00Z' })).toThrow();
});

test('accepts both supported UTC precisions', () => {
  expect(validateBundle({ ...valid, expiresAt: '2099-01-01T00:00:00.000Z' }).expiresAt).toBe('2099-01-01T00:00:00.000Z');
});

test('validates optional refreshAfter', () => {
  expect(validateBundle({ ...valid, refreshAfter: '2099-01-01T00:00:00Z' }).refreshAfter).toBe('2099-01-01T00:00:00Z');
  expect(() => validateBundle({ ...valid, refreshAfter: 'bad' })).toThrow('refreshAfter');
  expect(() => validateBundle({ ...valid, refreshAfter: '2000-01-01T00:00:00Z' })).toThrow('future');
});
