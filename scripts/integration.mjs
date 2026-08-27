import { createDb } from '../src/index.mjs';

const db = await createDb({
  primary: {
    host: process.env.GALERA_LIB_TEST_HOST ?? '127.0.0.1',
    port: Number(process.env.GALERA_LIB_TEST_PORT ?? 13306),
    user: process.env.GALERA_LIB_TEST_USER ?? 'galera_lib_test',
    password: process.env.GALERA_LIB_TEST_PASSWORD ?? 'galera_lib_test_password',
    database: process.env.GALERA_LIB_TEST_DATABASE ?? 'galera_lib_test'
  }
});
try {
  const [rows] = await db.query('SELECT 1 AS healthy');
  if (rows[0]?.healthy !== 1) throw new Error('MariaDB smoke query returned an unexpected result');
  console.log('MariaDB integration smoke test passed');
} finally {
  await db.close();
}
