import { jest } from '@jest/globals';
import { fetchRoutingBundle } from '../../src/routing/bundle-fetcher.mjs';

const bundle = { database: 'app', identity: 'id', credentials: { username: 'u', password: 'p' }, routes: { primary: [{ host: 'db', port: 3306 }] }, expiresAt: '2099-01-01T00:00:00Z' };

test('fetches and validates an authenticated routing bundle', async () => {
  const fetchImpl = jest.fn(async () => ({ ok: true, json: async () => bundle }));
  await expect(fetchRoutingBundle({ endpoint: 'http://vip:8080', token: 'token', fetchImpl })).resolves.toBe(bundle);
  expect(fetchImpl).toHaveBeenCalledWith('http://vip:8080/api/v1/routing/bundle', expect.objectContaining({ headers: expect.objectContaining({ authorization: 'Bearer token' }) }));
});

test('rejects missing credentials, failed responses, and malformed JSON', async () => {
  await expect(fetchRoutingBundle({ endpoint: 'http://vip', fetchImpl: jest.fn() })).rejects.toThrow('token');
  await expect(fetchRoutingBundle({ endpoint: 'http://vip', token: 't', fetchImpl: async () => ({ ok: false, status: 401 }) })).rejects.toThrow('401');
  await expect(fetchRoutingBundle({ endpoint: 'http://vip', token: 't', fetchImpl: async () => ({ ok: true, json: async () => { throw new Error('bad'); } }) })).rejects.toThrow('valid JSON');
});
