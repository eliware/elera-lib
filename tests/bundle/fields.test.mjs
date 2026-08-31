import { expect, test } from '@jest/globals';
import { validateBundle } from '../../src/bundle.mjs';

const valid = { apiVersion: 'v1', application: 'app', database: 'logical-db', physicalDatabase: 'elera_db_123', identity: 'runtime', credentials: { username: 'u', password: 'p' }, writer: { host: 'a', port: 3306 }, readers: [], failover: [], bundleVersion: 1, nodeIdentity: 'node-a', ports: { sql: 3306, http: 8080 }, expiresAt: '2030-01-01T00:00:00Z', routes: { primary: [{ host: 'a', port: 3306 }], balanced: [] } };

test('validates required and optional bundle fields', () => {
  expect(validateBundle(valid)).toBe(valid);
  expect(validateBundle({ ...valid, applicationId: 'app-id', databaseId: 'db-id', identityId: 'identity-id', credentialName: 'runtime', scopes: ['database:read'] })).toBeDefined();
  for (const field of ['apiVersion', 'application', 'database', 'physicalDatabase', 'identity', 'writer', 'readers', 'failover', 'bundleVersion', 'nodeIdentity', 'ports']) { const candidate = { ...valid }; delete candidate[field]; expect(() => validateBundle(candidate)).toThrow(); }
  for (const field of ['applicationId', 'databaseId', 'identityId', 'credentialName']) expect(() => validateBundle({ ...valid, [field]: '' })).toThrow();
  expect(() => validateBundle({ ...valid, scopes: 'database:read' })).toThrow();
  expect(() => validateBundle({ ...valid, scopes: [''] })).toThrow();
  expect(() => validateBundle({ ...valid, scopes: [42] })).toThrow();
  expect(() => validateBundle({ ...valid, credentials: undefined })).toThrow();
  expect(() => validateBundle({ ...valid, credentials: { username: '', password: 'p' } })).toThrow();
  expect(() => validateBundle({ ...valid, credentials: { username: 'u', password: undefined } })).toThrow();
});
