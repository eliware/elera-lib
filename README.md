# @eliware/elera-lib

The alternative SQL client for Eliware applications. It provides generic
primary/balanced MySQL or MariaDB routing without embedding Elera, HAProxy,
backup, or GitOps policy. It is a v0.1.0 alternative to `@eliware/mysql`; the
existing package is intentionally unchanged.

`primary` is the preferred connection path. `balanced` is an optional alternate
path. Both may accept writes; automatic routing sends only conservative,
single-statement read queries to `balanced`. Transactions always use `primary`.

```js
import { createDbFromEnvironment } from '@eliware/elera-lib';
const db = await createDbFromEnvironment();
await db.query('SELECT 1');
await db.close();
```

Environment variables: `MYSQL_PRIMARY_HOST` (or `MYSQL_HOST`),
`MYSQL_PRIMARY_PORT` (or `MYSQL_PORT`), optional `MYSQL_BALANCED_HOST`,
optional `MYSQL_BALANCED_PORT`, `MYSQL_USER`, `MYSQL_PASSWORD`, and
`MYSQL_DATABASE`. Pool settings may be supplied with `MYSQL_CONNECT_TIMEOUT`,
`MYSQL_ACQUIRE_TIMEOUT`, `MYSQL_CONNECTION_LIMIT`, `MYSQL_QUEUE_LIMIT`, and
`MYSQL_SSL`. Configure primary and balanced routes explicitly; applications
should not rely on ambiguous single-endpoint aliases.

Routing bundles passed to `createDbFromBundle` use the normalized shape
`routes.primary` and `routes.balanced`, each containing ordered `{ host, port,
weight }` nodes. A bundle also carries `database`, `identity`, optional
`credentials`, and `expiresAt`; `validateBundle` rejects expired or malformed
route data. The checked-in contract fixture documents the supervisor-facing
wire representation separately.

The implementation accepts optional routing bundles and injected credential
providers, maintains bounded pools per route, supports ordered writer/reader
candidates, bundle refresh, and quarantine of unhealthy nodes. The WebSocket
routing-event transport is implemented as a generic adapter. These are generic
client capabilities: the
library does not know about supervisors, Elera, HAProxy, GitOps, backups, or
CLI commands. Applications provide those integrations through ordinary
configuration and callbacks.

The public client intentionally exposes SQL operations, health, routing,
lifecycle, and optional routing-event synchronization methods. REST and
WebSocket transports are adapters, not supervisor or CLI policy. Underlying
`mysql2` pools and driver objects remain internal implementation details.

For maintenance workflows, `createQuiesceController` provides a generic
connection-admission drain and `createSqlVerifier` provides generic connectivity,
schema, account, and grant checks. Neither API transports or orchestrates dump
contents.

`createMaterializer` supports bounded plaintext use for a caller-provided
operation. It creates a mode-restricted temporary file and removes its entire
temporary directory in a `finally` block; this limits lifetime and cleanup but
does not hide plaintext from the caller. The library does not persist secrets,
age keys, or supervisor-specific artifact metadata.

The package exports the SQL client and environment/bundle factories, query
classification and route selection, routing-bundle validation, generic REST
and WebSocket routing adapters, SQL administration and verification helpers,
and lifecycle helpers for quiescing and temporary materialization. These
helpers remain policy-neutral and do not provision users, manage clusters, or
perform backup/restore orchestration.

## Development

```bash
npm ci
npm test
npm run lint
npm run typecheck
npm run pack
```
