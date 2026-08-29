import { expect, test } from '@jest/globals';
import { asSqlError, classifyError, ClusterUnavailableError, ServerUnavailableError } from '../src/errors.mjs';

test('classifies and preserves unavailable server errors', () => {
  const error = new ServerUnavailableError('node down');
  expect(classifyError(error)).toMatchObject({ code: 'SERVER_UNAVAILABLE', retryable: false });
  expect(asSqlError(error)).toBe(error);
});

test('classifies cluster unavailability and unknown failures', () => {
  expect(classifyError(new ClusterUnavailableError('no quorum'))).toMatchObject({ code: 'CLUSTER_UNAVAILABLE', retryable: false });
  expect(classifyError(new Error('unexpected'))).toMatchObject({ retryable: false });
  expect(asSqlError(new Error('wrapped')).message).toBe('SQL operation failed');
});

test('classifies connection and authentication failures', () => {
  expect(classifyError({ code: 'ECONNRESET' })).toMatchObject({ code: 'CONNECTION_ERROR', retryable: true });
  expect(classifyError({ code: 'ER_ACCESS_DENIED_ERROR' })).toMatchObject({ code: 'AUTHENTICATION_ERROR', retryable: false });
});
