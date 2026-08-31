import { expect, test } from '@jest/globals';
import { validateBundle } from '../../../src/bundle.mjs';
const valid = { apiVersion: 'v1', application: 'app', database: 'logical-db', physicalDatabase: 'elera_db_123', identity: 'runtime', credentials: { username: 'u', password: 'p' }, writer: { host: 'a', port: 3306 }, readers: [], failover: [], bundleVersion: 1, nodeIdentity: 'node-a', ports: { sql: 3306, http: 8080 }, expiresAt: '2030-01-01T00:00:00Z', routes: { primary: [{ host: 'a', port: 3306 }], balanced: [] } };
test('validates credentials', () => {
  expect(() => validateBundle({ ...valid, credentials: undefined })).toThrow();
  expect(() => validateBundle({ ...valid, credentials: { username: '', password: 'p' } })).toThrow();
  expect(() => validateBundle({ ...valid, credentials: { username: 'u', password: undefined } })).toThrow();
});
