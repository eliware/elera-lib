# @eliware/galera-lib

The successor SQL client for Eliware applications. It provides generic
primary/balanced MySQL or MariaDB routing without embedding Galera, HAProxy,
backup, or GitOps policy.

`primary` is the preferred connection path. `balanced` is an optional alternate
path. Both may accept writes; automatic routing sends only conservative,
single-statement read queries to `balanced`. Transactions always use `primary`.

```js
import { createDbFromEnvironment } from '@eliware/galera-lib';
const db = await createDbFromEnvironment();
await db.query('SELECT 1');
await db.close();
```

Environment variables: `MYSQL_PRIMARY_HOST`, `MYSQL_PRIMARY_PORT`,
`MYSQL_BALANCED_HOST`, `MYSQL_BALANCED_PORT`, `MYSQL_USER`,
`MYSQL_PASSWORD`, and `MYSQL_DATABASE`. `MYSQL_HOST` and `MYSQL_PORT` remain
accepted as primary aliases during migration.
