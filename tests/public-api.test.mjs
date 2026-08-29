import { expect, test } from '@jest/globals';
import * as api from '../src/index.mjs';

test('exports only shared helpers and supported errors', () => {
  for (const name of ['validateBundle', 'validateRoutingEvent', 'compareBundleVersions', 'writerAssignment', 'failoverNodes', 'clientDrainTimeout', 'createTelemetry', 'SqlClientError', 'ClusterUnavailableError', 'ServerUnavailableError', 'classifyError', 'asSqlError']) {
    expect(api[name]).toBeDefined();
  }
  for (const name of ['createDb', 'createDbFromBundle', 'createRoutingStream', 'createQuiesceController']) {
    expect(api[name]).toBeUndefined();
  }
});

test('exports shared policy helpers', () => {
  expect(api.CLIENT_DRAIN_TIMEOUT_MS).toBe(45000);
  expect(api.clientDrainTimeout(90000)).toBe(45000);
  expect(api.compareBundleVersions).toBeDefined();
});
