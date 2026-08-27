# Release notes

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
