import { expect, test } from '@jest/globals';
import { validateBundle } from '../../src/bundle/index.mjs';
import { validateBundleEndpointConflicts } from '../../src/bundle/endpoint-conflicts.mjs';
const valid = { apiVersion: 'v1', application: 'app', database: 'logical-db', physicalDatabase: 'elera_db_123', identity: 'runtime', credentials: { username: 'u', password: 'p' }, writer: { host: 'a', port: 3306 }, readers: [], failover: [], bundleVersion: 1, nodeIdentity: 'node-a', ports: { sql: 3306, http: 8080 }, expiresAt: '2030-01-01T00:00:00Z', routes: { primary: [{ host: 'a', port: 3306 }], balanced: [] } };
test('rejects endpoint conflicts and duplicates', () => {
  // Intentional: reader and route views may overlap; only writer/failover ownership conflicts are rejected.
  expect(() => validateBundle({ ...valid, failover: [{ host: 'b', port: 3306 }, { host: 'b', port: 3306 }] })).toThrow('duplicate');
  expect(() => validateBundle({ ...valid, writer: { host: 'w', port: 3306 }, failover: [{ host: 'w', port: 3306 }] })).toThrow('duplicates writer');
});

test('allows distinct writer and failover endpoints', () => {
  expect(validateBundle({ ...valid, writer: { host: 'w', port: 3306 }, failover: [{ host: 'b', port: 3306 }] }).writer.host).toBe('w');
});

test('covers endpoint conflict branches directly', () => {
  const bundle = { writer: { host: 'w', port: 1 }, failover: [], readers: [{ host: 'r', port: 2 }] };
  expect(validateBundleEndpointConflicts(bundle)).toBe(bundle);
  expect(() => validateBundleEndpointConflicts({ writer: null, failover: [], readers: [{ host: 'r', port: 2 }] })).toThrow();
  expect(() => validateBundleEndpointConflicts({ writer: { host: 'w', port: 1 }, failover: [{ host: 'w', port: 1 }], readers: [] })).toThrow('duplicates writer');
  expect(validateBundleEndpointConflicts({ writer: { host: 'w', port: 1 }, failover: [], readers: [{ host: 'w', port: 1 }] }).readers).toEqual([{ host: 'w', port: 1 }]);
});
