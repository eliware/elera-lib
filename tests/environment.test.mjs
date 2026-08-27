import { expect, jest, test } from '@jest/globals';
import { createDbFromEnvironment } from '../src/client/environment.mjs';

test('maps an optional Unix socket from the environment to the primary pool', async () => {
  const createPool = jest.fn(() => ({ query: jest.fn(), execute: jest.fn(), getConnection: jest.fn(), end: jest.fn(async () => {}) }));
  const client = await createDbFromEnvironment({ env: { MYSQL_SOCKET: '/run/mysqld/mysqld.sock', MYSQL_USER: 'root', MYSQL_PASSWORD: 'secret', MYSQL_DATABASE: 'mysql' }, mysqlLib: { createPool }, log: {} });
  expect(createPool).toHaveBeenCalledWith(expect.objectContaining({ socket: '/run/mysqld/mysqld.sock', host: 'localhost' }));
  await client.close();
});

test('maps explicit primary and balanced environment routes without a socket', async () => {
  const createPool = jest.fn(() => ({ query: jest.fn(), execute: jest.fn(), getConnection: jest.fn(), end: jest.fn(async () => {}) }));
  const client = await createDbFromEnvironment({ env: { MYSQL_PRIMARY_HOST: 'writer', MYSQL_PRIMARY_PORT: '3307', MYSQL_BALANCED_PORT: '3308', MYSQL_USER: 'u', MYSQL_PASSWORD: 'p', MYSQL_DATABASE: 'db' }, mysqlLib: { createPool }, log: {} });
  expect(createPool).toHaveBeenNthCalledWith(1, expect.objectContaining({ host: 'writer', port: 3307 }));
  expect(createPool).toHaveBeenNthCalledWith(2, expect.objectContaining({ host: 'writer', port: 3308 }));
  expect(createPool.mock.calls[0][0].socket).toBeUndefined();
  await client.close();
});

test('uses the generic host and port environment names when primary overrides are absent', async () => {
  const createPool = jest.fn(() => ({ query: jest.fn(), execute: jest.fn(), getConnection: jest.fn(), end: jest.fn(async () => {}) }));
  const client = await createDbFromEnvironment({ env: { MYSQL_HOST: 'db', MYSQL_PORT: '3306', MYSQL_USER: 'u', MYSQL_PASSWORD: 'p', MYSQL_DATABASE: 'db' }, mysqlLib: { createPool }, log: {} });
  expect(createPool).toHaveBeenCalledWith(expect.objectContaining({ host: 'db', port: 3306 }));
  await client.close();
});
