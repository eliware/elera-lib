import { validateBundle } from '../../src/bundle.mjs';
const valid = { apiVersion: 'v1', application: 'app', database: 'logical-db', physicalDatabase: 'elera_db_123', identity: 'runtime', credentials: { username: 'u', password: 'p' }, writer: { host: 'a', port: 3306 }, readers: [], failover: [], bundleVersion: 1, nodeIdentity: 'node-a', ports: { sql: 3306, http: 8080 }, expiresAt: '2030-01-01T00:00:00Z', routes: { primary: [{ host: 'a', port: 3306 }], balanced: [] } };
test('validates bundles', () => { expect(validateBundle(valid)).toBe(valid); });
test('rejects expired bundles', () => { expect(() => validateBundle({ ...valid, expiresAt: '2000-01-01T00:00:00Z' })).toThrow('future'); });
test('rejects malformed bundles and nodes', () => { expect(() => validateBundle()).toThrow(); expect(() => validateBundle({})).toThrow(); expect(() => validateBundle({ ...valid, routes: { primary: 'bad' } })).toThrow(); expect(() => validateBundle({ ...valid, routes: { primary: [{ host: '', port: 3306 }] } })).toThrow(); expect(() => validateBundle({ ...valid, routes: { primary: [{ host: 'a', port: 0 }] } })).toThrow(); expect(() => validateBundle({ ...valid, routes: { primary: [{ host: 'a', port: 3306, weight: -1 }] } })).toThrow(); });
test('accepts routes and rejects invalid balanced routes', () => { expect(validateBundle({ ...valid, routes: { primary: [], balanced: [{ host: 'b', port: 65535, weight: 0 }] } })).toBeTruthy(); expect(() => validateBundle({ ...valid, routes: { primary: [], balanced: [{ host: 'b', port: 70000 }] } })).toThrow(); });
test('validates explicit writer, failover, readers, and node uniqueness', () => { expect(validateBundle({ ...valid, writer: { host: 'w', port: 3306 }, failover: [{ host: 'b', port: 3306 }], readers: [{ host: 'r', port: 3306 }] })).toBeTruthy(); expect(() => validateBundle({ ...valid, writer: { host: '', port: 3306 } })).toThrow('writer'); expect(() => validateBundle({ ...valid, failover: 'bad' })).toThrow('failover'); expect(() => validateBundle({ ...valid, readers: [{ host: 'r', port: 70000 }] })).toThrow('readers'); expect(() => validateBundle({ ...valid, failover: [{ host: 'b', port: 3306 }, { host: 'b', port: 3306 }] })).toThrow('duplicate'); expect(() => validateBundle({ ...valid, writer: { host: 'w', port: 3306 }, failover: [{ host: 'w', port: 3306 }] })).toThrow('duplicates writer'); });
test('rejects each missing required bundle field', () => {
  for (const field of ['apiVersion', 'application', 'database', 'physicalDatabase', 'identity', 'writer', 'readers', 'failover', 'bundleVersion', 'nodeIdentity', 'ports']) {
    const candidate = { ...valid }; delete candidate[field]; expect(() => validateBundle(candidate)).toThrow();
  }
  expect(() => validateBundle({ ...valid, credentials: undefined })).toThrow();
  expect(() => validateBundle({ ...valid, credentials: { username: '', password: 'p' } })).toThrow();
  expect(() => validateBundle({ ...valid, credentials: { username: 'u', password: undefined } })).toThrow();
  expect(() => validateBundle({ ...valid, ports: { sql: 0, http: 8080 } })).toThrow();
  expect(() => validateBundle({ ...valid, expiresAt: undefined })).toThrow();
});
test('validates optional identity and scope metadata when present', () => {
  expect(validateBundle({ ...valid, applicationId: 'app-id', databaseId: 'db-id', identityId: 'identity-id', credentialName: 'runtime', scopes: ['database:read'] })).toBeDefined();
  for (const field of ['applicationId', 'databaseId', 'identityId', 'credentialName']) expect(() => validateBundle({ ...valid, [field]: '' })).toThrow();
  expect(() => validateBundle({ ...valid, scopes: 'database:read' })).toThrow();
  expect(() => validateBundle({ ...valid, scopes: [''] })).toThrow();
  expect(() => validateBundle({ ...valid, scopes: [42] })).toThrow();
});

test('requires both normalized route arrays and integer ports', () => {
  expect(() => validateBundle({ ...valid, routes: undefined })).toThrow('routes');
  expect(() => validateBundle({ ...valid, routes: { primary: [], balanced: 'bad' } })).toThrow('balanced');
  expect(() => validateBundle({ ...valid, ports: { sql: '3306', http: 8080 } })).toThrow('port');
  expect(() => validateBundle({ ...valid, credentials: { username: 'u', password: 1 } })).toThrow('password');
});
