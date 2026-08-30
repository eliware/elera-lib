import { validateBundle } from '../src/bundle.mjs';
const valid = { apiVersion: 'v1', application: 'app', database: 'db', identity: 'runtime', credentials: { username: 'u', password: 'p' }, writer: { host: 'a', port: 3306 }, readers: [], failover: [], bundleVersion: 1, nodeIdentity: 'node-a', ports: { sql: 3306, http: 8080 }, expiresAt: '2030-01-01T00:00:00Z', routes: { primary: [{ host: 'a', port: 3306 }] } };
test('validates bundles', () => { expect(validateBundle(valid)).toBe(valid); });
test('rejects malformed bundles and nodes', () => { expect(() => validateBundle()).toThrow(); expect(() => validateBundle({})).toThrow(); expect(() => validateBundle({ ...valid, routes: { primary: 'bad' } })).toThrow(); expect(() => validateBundle({ ...valid, routes: { primary: [{ host: '', port: 3306 }] } })).toThrow(); expect(() => validateBundle({ ...valid, routes: { primary: [{ host: 'a', port: 0 }] } })).toThrow(); expect(() => validateBundle({ ...valid, routes: { primary: [{ host: 'a', port: 3306, weight: -1 }] } })).toThrow(); });
test('accepts optional routes and rejects invalid balanced routes', () => { expect(validateBundle({ ...valid, routes: { balanced: [{ host: 'b', port: 65535, weight: 0 }] } })).toBeTruthy(); expect(() => validateBundle({ ...valid, routes: { balanced: [{ host: 'b', port: 70000 }] } })).toThrow(); });
test('validates explicit writer, failover, readers, and node uniqueness', () => { expect(validateBundle({ ...valid, writer: { host: 'w', port: 3306 }, failover: [{ host: 'b', port: 3306 }], readers: [{ host: 'r', port: 3306 }] })).toBeTruthy(); expect(() => validateBundle({ ...valid, writer: { host: '', port: 3306 } })).toThrow('writer'); expect(() => validateBundle({ ...valid, failover: 'bad' })).toThrow('failover'); expect(() => validateBundle({ ...valid, readers: [{ host: 'r', port: 70000 }] })).toThrow('readers'); expect(() => validateBundle({ ...valid, failover: [{ host: 'b' }, { host: 'b' }] })).toThrow('duplicate'); expect(() => validateBundle({ ...valid, writer: { host: 'w' }, failover: [{ host: 'w' }] })).toThrow('duplicates writer'); });
test('rejects each missing required bundle field', () => {
  for (const field of ['apiVersion', 'application', 'database', 'identity', 'writer', 'readers', 'failover', 'bundleVersion', 'nodeIdentity', 'ports']) {
    const candidate = { ...valid }; delete candidate[field]; expect(() => validateBundle(candidate)).toThrow();
  }
  expect(() => validateBundle({ ...valid, credentials: undefined })).toThrow();
  expect(() => validateBundle({ ...valid, credentials: { username: '', password: 'p' } })).toThrow();
  expect(() => validateBundle({ ...valid, credentials: { username: 'u', password: undefined } })).toThrow();
  expect(() => validateBundle({ ...valid, ports: { sql: 0, http: 8080 } })).toThrow();
  expect(() => validateBundle({ ...valid, expiresAt: undefined })).toThrow();
});
