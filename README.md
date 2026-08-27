# @eliware/elera-lib

The alternative SQL client for Eliware applications. It provides generic
primary/balanced MySQL or MariaDB routing without embedding Elera, HAProxy,
backup, or GitOps policy. It is being developed as a replacement for
`@eliware/mysql`; the existing package is intentionally unchanged.

`primary` is the preferred connection path. `balanced` is an optional alternate
path. Both may accept writes; automatic routing sends only conservative,
single-statement read queries to `balanced`. Transactions always use `primary`.

```js
import { createDbFromEnvironment } from '@eliware/elera-lib';
const db = await createDbFromEnvironment();
await db.query('SELECT 1');
await db.close();
```

Environment variables: `MYSQL_PRIMARY_HOST`, `MYSQL_PRIMARY_PORT`,
`MYSQL_BALANCED_HOST`, `MYSQL_BALANCED_PORT`, `MYSQL_USER`,
`MYSQL_PASSWORD`, and `MYSQL_DATABASE`. `MYSQL_HOST` and `MYSQL_PORT` remain
accepted as primary aliases during migration.

The implementation accepts optional routing bundles and injected credential
providers, maintains bounded pools per route, supports ordered writer/reader
candidates, bundle refresh, and quarantine of unhealthy nodes. The WebSocket
routing-event transport is a planned adapter in the next routing batch. These
are generic client capabilities: the
library does not know about supervisors, Elera, HAProxy, GitOps, backups, or
CLI commands. Applications provide those integrations through ordinary
configuration and callbacks.

The public client intentionally exposes SQL operations, health, routing,
lifecycle, and planned optional routing-event synchronization methods only. REST and
WebSocket transports are adapters, not supervisor or CLI policy. Underlying
`mysql2` pools and driver objects remain internal implementation details.

## Development

```bash
npm ci
npm test
npm run lint
npm run typecheck
npm run pack
```
