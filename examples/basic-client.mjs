import { createDbFromEnvironment } from '@eliware/elera-lib';

// Set MYSQL_PRIMARY_HOST, MYSQL_USER, MYSQL_PASSWORD, and MYSQL_DATABASE
// before running this example. The same public API works with a routing bundle.
const db = await createDbFromEnvironment();

try {
  const health = await db.health('primary');
  if (!health.ok) throw new Error('primary SQL route is not healthy');
  const [rows] = await db.query('SELECT 1 AS healthy');
  console.log(JSON.stringify({ health, rows }));
} finally {
  await db.close();
}
