import { createManagedDbFromEnvironment, managedOptionsFromEnvironment } from '../../src/client/managed.mjs';

test('reads only the managed endpoint and token variables', () => {
  expect(managedOptionsFromEnvironment({ ELERA_API_ENDPOINT: 'http://vip:8080', ELERA_API_TOKEN: 'token', MYSQL_HOST: 'ignored' })).toEqual({ endpoint: 'http://vip:8080', token: 'token' });
});

test('rejects incomplete managed environment configuration', () => {
  expect(() => managedOptionsFromEnvironment({})).toThrow('ELERA_API_ENDPOINT');
  expect(() => managedOptionsFromEnvironment({ ELERA_API_ENDPOINT: 'http://vip' })).toThrow('ELERA_API_TOKEN');
});

test('passes environment-derived values to the managed factory', async () => {
  const fetchImpl = async () => ({ ok: true, json: async () => ({ database: 'app', identity: 'id', credentials: { username: 'u', password: 'p' }, routes: { primary: [{ host: 'db', port: 3306 }] }, expiresAt: '2099-01-01T00:00:00Z' }) });
  const client = await createManagedDbFromEnvironment({ env: { ELERA_API_ENDPOINT: 'http://vip', ELERA_API_TOKEN: 'token' }, fetchImpl, WebSocketImpl: null, mysqlLib: { createPool: () => ({ query: async () => [[]], execute: async () => [[]], getConnection: async () => ({}), end: async () => {} }) } });
  expect(client.bundle().database).toBe('app');
  await client.close();
});
