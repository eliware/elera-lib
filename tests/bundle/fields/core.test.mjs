import { expect, test } from '@jest/globals';
import { validateBundle } from '../../../src/bundle/index.mjs';
const valid = { apiVersion: 'v1', application: 'app', database: 'logical-db', physicalDatabase: 'elera_db_123', identity: 'runtime', credentials: { username: 'u', password: 'p' }, writer: { host: 'a', port: 3306 }, readers: [], failover: [], bundleVersion: 1, nodeIdentity: 'node-a', ports: { sql: 3306, http: 8080 }, expiresAt: '2030-01-01T00:00:00Z', routes: { primary: [{ host: 'a', port: 3306 }], balanced: [] } };
test('validates core bundle fields', () => {
  expect(validateBundle(valid)).toEqual(valid);
  // Intentional: this cross-field test checks requiredness through the public contract; focused field tests assert specific rule paths.
  for (const field of ['apiVersion', 'application', 'database', 'physicalDatabase', 'identity', 'writer', 'readers', 'failover', 'bundleVersion', 'nodeIdentity', 'ports']) { const candidate = { ...valid }; delete candidate[field]; expect(() => validateBundle(candidate)).toThrow(); }
  for (const field of ['applicationId', 'databaseId', 'identityId', 'credentialName']) expect(() => validateBundle({ ...valid, [field]: '' })).toThrow();
});
