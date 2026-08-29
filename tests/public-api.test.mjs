import { expect, test } from '@jest/globals';
import * as api from '../src/index.mjs';

test('exports the complete generic client surface', () => {
  for (const name of [
    'createDb', 'createDbFromBundle', 'validateProfile',
    'redactedProfile', 'validateBundle', 'createRoutingStream', 'writerAssignment',
    'failoverNodes', 'createAdminSql', 'createMigrationRunner', 'createSqlVerifier',
    'createQuiesceController', 'createMaterializer', 'createTelemetry',
  ]) expect(api[name]).toEqual(expect.any(Function));
});

test('exports policy constants and helpers with stable values', () => {
  expect(api.CLIENT_DRAIN_TIMEOUT_MS).toBe(45000);
  expect(api.clientDrainTimeout(90000)).toBe(45000);
  expect(api.compareBundleVersions('v2', 'v1')).toBeGreaterThan(0);
});
