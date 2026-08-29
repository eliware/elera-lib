# @eliware/elera-lib

The alternative SQL client for Eliware applications. It provides generic
primary/balanced MySQL or MariaDB routing without embedding Elera, HAProxy,
backup, or GitOps policy. It is a v0.1.11 alternative to `@eliware/mysql`; the
existing package is intentionally unchanged. The current package version is
0.1.11.

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
`MYSQL_DATABASE`. `MYSQL_SOCKET` optionally selects a Unix-domain socket for
the primary connection, which is useful for local socket-authenticated MariaDB
accounts. Pool settings may be supplied with `MYSQL_CONNECT_TIMEOUT`,
`MYSQL_ACQUIRE_TIMEOUT`, `MYSQL_CONNECTION_LIMIT`, `MYSQL_QUEUE_LIMIT`, and
`MYSQL_SSL`. Configure primary and balanced routes explicitly; applications
should not rely on ambiguous single-endpoint aliases.

See examples/basic-client.mjs for a complete consumer example using only the
public package API. Its usage notes are in examples/README.md.

Routing bundles passed to `createDbFromBundle` use the normalized shape
`routes.primary` and `routes.balanced`, each containing ordered `{ host, port,
weight }` nodes. A bundle may also carry an explicit `writer`, ordered
`failover`, and `readers` assignment. The bundle carries `database`,
`identity`, optional `application`, `credentialName`, `scopes`, and
`credentials`, and `expiresAt`; `validateBundle` rejects
expired, malformed, duplicated, or conflicting route data. The checked-in
contract fixture documents the supervisor-facing wire representation
separately.

The implementation accepts optional routing bundles and injected credential
providers, maintains bounded pools per route, supports ordered writer/reader
candidates, bundle refresh, and quarantine of unhealthy nodes. The WebSocket
routing-event transport is implemented as a generic adapter. Nodes can be
immediately excluded or re-admitted with `client.setNodeAvailability(route,
host, available)`. These are generic client capabilities: the
library does not know about supervisors, Elera, HAProxy, GitOps, backups, or
CLI commands. Applications provide those integrations through ordinary
configuration and callbacks.

An application-scoped token should resolve to one application, database, and
credential context. The library does not select databases or credentials from
request arguments. Callers that already have that authorization context may
pass `tokenContext` to `createDb`; bundle creation and refresh then reject
cross-database, identity, credential, or scope mismatches.

When a route node is drained, the client immediately stops assigning new work
to that node while existing operations continue. The drain window defaults to
45 seconds and is capped at 45 seconds; remaining pool connections are then
force-closed. `client.drain(host)` returns `wait()` and `forceClose()`
operations, while `client.nodeStates()` exposes lifecycle and active-operation
state. Only conservative, single-statement reads are eligible for automatic
retry after a connection failure; uncertain writes are never retried
automatically.

`client.availability()` reports whether a primary route is usable. It returns
`state: 'cluster-unavailable'` when every primary candidate is draining or
unavailable; the `routes` fields report primary and balanced availability
independently. A single-node route fails with the exported
`ServerUnavailableError` using code `SERVER_UNAVAILABLE`; a multi-node route
with no eligible candidates fails with `ClusterUnavailableError` using code
`CLUSTER_UNAVAILABLE`.

When an attached routing stream receives a `routing.shutdown` event, the
client drains the identified node, performs a REST bundle resynchronization,
and closes the retiring WebSocket with restart code `1012`. If the event
contains `loadBalancerEndpoint`, that endpoint replaces the current endpoint
before resynchronization and reconnect. `reconnectDeadlineMs` bounds the
planned reconnect window; after it expires, no new reconnect is scheduled.
Reconnects, failovers, and measured reconnect delay are included in telemetry.
If the WebSocket remains unavailable before the deadline, REST
resynchronization and bounded reconnect backoff continue until the deadline or
until the caller closes the stream.

Routing events are validated before application. Shutdown events may include
`node`, `reason`, `reconnect`, `reconnectDeadlineMs`, and
`loadBalancerEndpoint`; invalid event fields are reported through `onError` and
do not change routing state. `routing.update` replaces the writer and reader
pools atomically, while `routing.drain` excludes only the named node from new
work and allows active operations to finish.

The public client intentionally exposes SQL operations, health, routing,
lifecycle, and optional routing-event synchronization methods. REST and
WebSocket transports are adapters, not supervisor or CLI policy. Underlying
`mysql2` pools and driver objects remain internal implementation details.

For maintenance workflows, `createQuiesceController` provides a generic
connection-admission drain and `createSqlVerifier` provides generic connectivity,
schema, account, and grant checks. Neither API transports or orchestrates dump
contents. The stream reports `websocket`, `rest`, or `disconnected` mode so
callers can observe transport health without implementing transport policy.

Applications may opt into generic in-memory telemetry with
`createDb({ ..., telemetry: true })`. Query, execute, and transaction counts,
failures, retries, in-flight work, and latency are exposed through
`client.telemetry` and sent over an attached routing stream once per second.
Telemetry is observational only; it does not carry SQL or credentials.
The snapshot may include the application, database, credential name, and
scopes associated with the already-authorized client, plus reconnect, failover,
and cumulative reconnect-delay counters. It never includes bearer tokens or
passwords.

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
