import { expect, test } from '@jest/globals';
import { validateBundle } from '../../src/bundle.mjs';

const valid = { apiVersion: 'v1', application: 'app', database: 'logical-db', physicalDatabase: 'elera_db_123', identity: 'runtime', credentials: { username: 'u', password: 'p' }, writer: { host: 'a', port: 3306 }, readers: [], failover: [], bundleVersion: 1, nodeIdentity: 'node-a', ports: { sql: 3306, http: 8080 }, expiresAt: '2030-01-01T00:00:00Z', routes: { primary: [{ host: 'a', port: 3306 }], balanced: [] } };

test('validates normalized routes and node uniqueness', () => {
  expect(validateBundle({ ...valid, routes: { primary: [], balanced: [{ host: 'b', port: 65535, weight: 0 }] } })).toBeTruthy();
  expect(() => validateBundle({ ...valid, routes: { primary: 'bad' } })).toThrow();
  expect(() => validateBundle({ ...valid, routes: { primary: [], balanced: 'bad' } })).toThrow('balanced');
  expect(() => validateBundle({ ...valid, routes: { primary: [{ host: '', port: 3306 }] } })).toThrow();
  expect(() => validateBundle({ ...valid, routes: { primary: [{ host: 'a', port: 0 }] } })).toThrow();
  expect(() => validateBundle({ ...valid, routes: { primary: [{ host: 'a', port: 3306, weight: -1 }] } })).toThrow();
  expect(() => validateBundle({ ...valid, routes: { primary: [], balanced: [{ host: 'b', port: 70000 }] } })).toThrow();
  expect(() => validateBundle({ ...valid, routes: undefined })).toThrow('routes');
  expect(() => validateBundle({ ...valid, failover: [{ host: 'b', port: 3306 }, { host: 'b', port: 3306 }] })).toThrow('duplicate');
  expect(() => validateBundle({ ...valid, writer: { host: 'w', port: 3306 }, failover: [{ host: 'w', port: 3306 }] })).toThrow('duplicates writer');
});
