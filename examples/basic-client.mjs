import { createDb } from '@eliware/elera-lib';

// Set ELERA_API_ENDPOINT and ELERA_API_TOKEN before running this example.
const db = await createDb();

try {
  const health = await db.health('primary');
  if (!health.ok) throw new Error('primary SQL route is not healthy');
  const [rows] = await db.query('SELECT 1 AS healthy');
  console.log(JSON.stringify({ health, rows }));
} finally {
  await db.close();
}
