import { expect, test } from '@jest/globals';
import { validateBundle } from '../../src/bundle/index.mjs';
const valid = { apiVersion: 'v1', application: 'app', database: 'logical-db', physicalDatabase: 'elera_db_123', identity: 'runtime', credentials: { username: 'u', password: 'p' }, writer: { host: 'a', port: 3306 }, readers: [], failover: [], bundleVersion: 1, nodeIdentity: 'node-a', ports: { sql: 3306, http: 8080 }, expiresAt: '2030-01-01T00:00:00Z', routes: { primary: [{ host: 'a', port: 3306 }], balanced: [] } };
test('validates service ports', () => {
  expect(() => validateBundle({ ...valid, ports: { sql: 0, http: 8080 } })).toThrow('port');
  expect(() => validateBundle({ ...valid, ports: { sql: '3306', http: 8080 } })).toThrow('port');
  expect(validateBundle({ ...valid, ports: { sql: 3306, http: 8080, ws: 9000 } })).toBeTruthy();
  expect(() => validateBundle({ ...valid, ports: { sql: 3306 } })).toThrow('http');
  expect(() => validateBundle({ ...valid, ports: { sql: 3306, http: 8080, '   ': 9000 } })).toThrow('name');
});
