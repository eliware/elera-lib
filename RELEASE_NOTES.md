# Release notes

## 0.1.2 — Unix-socket connection correction

This patch corrects the mysql2 option used for local MariaDB Unix-domain
socket connections.

### Fixed

- Maps `MYSQL_SOCKET` to mysql2's `socketPath` option so local socket
  connections reach the configured MariaDB socket instead of falling back to
  TCP.
- Removes the obsolete `socket` option from node-pool driver options.

### Validation

- Adds regression coverage for socket-path mapping and option cleanup.
- Maintains 100% statements, branches, functions, and lines coverage with
  zero lint warnings.
- Contract and syntax checks pass.

## 0.1.1 — Runtime integration readiness

This patch prepares the generic client for supervisor control-plane
connections and application-side routing changes. It does not add supervisor,
CLI, Galera, backup, or GitOps policy to the library.

### Connection and routing lifecycle

- Supports optional `MYSQL_SOCKET` Unix-domain socket connections for local
  MariaDB control-plane use while preserving TCP configuration.
- Adds explicit route-node availability control for immediate drain and
  recovery exclusion without exposing pool internals.
- Keeps manually excluded nodes unavailable until explicitly restored, rather
  than allowing a quarantine timer to re-admit them.

### Routing stream behavior

- Reports whether routing updates are currently using WebSocket, REST fallback,
  or have no usable transport.
- Prevents late REST fallback results from changing state after stream shutdown.
- Prevents reconnect scheduling and fallback callbacks from reviving a closed
  stream.

### Validation

- Adds regression coverage for socket environment mapping, route exclusion,
  stream shutdown, fallback state, and child lifecycle behavior.
- Maintains 100% statements, branches, functions, and lines coverage with zero
  lint warnings.

## 0.1.0 — Baseline release

`@eliware/elera-lib` is a generic MariaDB/MySQL client library for applications
that need multiple connection routes without embedding supervisor, HAProxy,
GitOps, backup, or CLI policy.

### SQL client and pooling

- Creates clients from explicit connection profiles or environment variables.
- Creates clients from validated routing bundles.
- Maintains independent bounded pools for primary and balanced routes.
- Keeps the underlying MySQL driver and pool implementation private.
- Supports `query`, `execute`, transactions, health checks, and graceful close.
- Pins transactions to the primary route.
- Preserves credentials while applying refreshed routing bundles.

### Routing and failover

- Classifies conservative, single-statement reads for balanced routing.
- Sends writes and transactions to the primary route by default.
- Supports explicit `primary`, `balanced`, and `auto` route selection.
- Selects ordered, weighted candidate nodes from a routing bundle.
- Quarantines unhealthy nodes and retries retryable connection failures.
- Validates bundle shape and expiry before use.
- Supports bundle refresh and refresh-needed checks.
- Supports node recovery and re-admission after quarantine.

### Routing-event transport

- Provides a generic WebSocket routing-stream adapter.
- Accepts versioned routing updates, drain events, and recovery events.
- Falls back to a caller-provided REST bundle fetch when WebSockets are
  unavailable or fail.
- Sends no SQL statements, credentials, dumps, or application data over the
  event stream.
- Keeps supervisor-specific protocol decisions outside the library.

### Lifecycle and maintenance

- Provides connection-admission quiescing for graceful drains.
- Stops new work while allowing active work to finish.
- Supports deterministic pool shutdown and cleanup.
- Provides bounded temporary-file materialization for caller-provided
  operations, with mode `0600` and recursive cleanup in `finally` blocks.

### Verification and administration

- Provides generic connectivity, schema, account, and grant verification.
- Provides SQL helpers for administrative and migration workflows.
- Exposes structured error classification through `SqlClientError`,
  `classifyError`, and `asSqlError`.
- Supports injected drivers, credential providers, clocks, logging, and stream
  transports for deterministic testing.

### Security and scope

- Redacts passwords and private TLS key material from profile representations.
- Does not persist credentials, bearer tokens, age keys, or plaintext artifacts.
- Does not expose supervisor-specific endpoints or CLI commands as library
  policy.
- Requires applications to provide their own credential and routing adapters.

### Compatibility and validation

- ESM package targeting Node.js 26 or newer.
- TypeScript declarations are included with the package.
- Existing `@eliware/mysql` is not modified or required.
- Strict test coverage is maintained at 100% statements, branches, functions,
  and lines with zero lint warnings.
