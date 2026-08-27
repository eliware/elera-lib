import { createDb } from './create-db.mjs';

export async function createDbFromEnvironment({ env = process.env, ...options } = {}) {
  const primary = { host: env.MYSQL_PRIMARY_HOST ?? env.MYSQL_HOST, port: env.MYSQL_PRIMARY_PORT ?? env.MYSQL_PORT, user: env.MYSQL_USER, password: env.MYSQL_PASSWORD, database: env.MYSQL_DATABASE, options: { connectTimeout: env.MYSQL_CONNECT_TIMEOUT, acquireTimeout: env.MYSQL_ACQUIRE_TIMEOUT, connectionLimit: env.MYSQL_CONNECTION_LIMIT, queueLimit: env.MYSQL_QUEUE_LIMIT, ssl: env.MYSQL_SSL } };
  const balanced = env.MYSQL_BALANCED_PORT ? { host: env.MYSQL_BALANCED_HOST ?? primary.host, port: env.MYSQL_BALANCED_PORT } : undefined;
  return createDb({ ...options, primary, balanced });
}
