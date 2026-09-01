# Release notes

## 0.3.1 — Shared-boundary cleanup

### Changed

- Removes the unused public routing-stream transport from the shared package;
  stream orchestration remains owned by `@eliware/elera-client`.
- Removes the unused `@eliware/common` runtime dependency.
- Aligns the README, shared contract documentation, source/test inventory, and
  consumer inventory with the current two-export public API.
- Updates the bundled example to demonstrate bundle validation without
  application SQL-client or telemetry-runtime behavior.

### Verification

- Restores focused node-validation coverage at the matching source path.
- Confirms all in-scope implementation modules have focused tests, with no
  non-barrel Istanbul ignores, local links, or repository-specific paths.
- Tests, lint, typecheck, contract validation, audit, and package dry-run with
  lifecycle scripts disabled pass.

## 0.3.0 — Shared protocol and helper boundary

### Breaking changes

- Narrows `@eliware/elera-lib` to shared Elera contracts, validation, routing,
  lifecycle, telemetry, and error helpers.
- Removes the managed SQL client, SQL pools, credential providers, and
  application-facing database orchestration from this package. Those concerns
  belong to `@eliware/elera-client` or repository-specific implementations.
- Removes supervisor- and CLI-specific administration, provisioning, and
  connection behavior from the public library.

### Changed

- Makes routing-bundle validation enforce the complete shared contract,
  including application, database, identity, credentials, writer, readers,
  failover, version, expiry, node identity, service ports, and optional scopes.
  Additional service-port keys are intentionally accepted and individually
  validated so the shared contract can add endpoints without a breaking change.
- Aligns the checked-in routing schema and fixture with the shared wire
  contract.
- Synchronizes the public runtime exports and TypeScript declarations with the
  reduced shared-library boundary.
- Keeps REST/WebSocket transport behavior, routing failover, lifecycle policy,
  and telemetry primitives transport- and application-policy-neutral.

### Verification

- Adds focused validation for the complete routing-bundle contract, routing
  nodes, shared errors, and public exports.
- Removes client-specific tests and implementation from the shared package so
  they can be maintained by `@eliware/elera-client`.
- Contract verification, tests, lint, and coverage checks pass for the shared
  library.

## 0.2.0 — Managed endpoint and token client

### Breaking changes

- Adds a new managed-client workflow; applications using it no longer provide
  SQL hosts, database names, usernames, passwords, or routing profiles.
- Managed bundle updates are now constrained to the authorization context
  established by the initial bundle.

### Added

- Defines the managed application contract using only
  `ELERA_API_ENDPOINT` and `ELERA_API_TOKEN`.
- Adds authenticated `fetchRoutingBundle` REST retrieval with response
  validation and a configurable bundle path.
- Makes `createDb()` the sole application-facing managed workflow. It acquires the
  initial bundle and attaches the routing stream automatically, using explicit
  options or `ELERA_API_ENDPOINT` and `ELERA_API_TOKEN` by default.
- Establishes application, database, identity, credential, and scope context
  from the initial bundle and rejects cross-context updates.
- Adds explicit routing-bundle metadata for application, database, and
  identity IDs, node identity, and service ports.
- Handles routing updates that temporarily remove all eligible writers or
  readers without dereferencing missing routes.
- Prevents concurrent stream connections and reconnects after a shutdown
  deadline.

### API boundary

- The managed factory is the application-facing workflow and accepts only the
  endpoint and application token.

### Verification

- Adds focused bundle-fetcher, managed-client, lifecycle, and
  authorization-boundary tests.
- Static syntax, schema, and diff validation pass for the committed changes.

## 0.1.11 — Public runtime declarations

### Changed

- Publishes declarations for the existing `profilesFromBundle`,
  `createDbFromBundle`, and `validateTokenContext` exports.
- Keeps runtime behavior unchanged while aligning declarations with the
  supported JavaScript entry point.

### Validation

- Typecheck, tests, lint, syntax, contract, and package checks pass.
- Maintains 100% statements, branches, functions, and lines coverage.

## 0.1.10 — Token-bound routing context

### Added

- Adds `validateTokenContext` for enforcing an application token's authorized
  application, database, credential, identity, and scopes against a routing
  bundle.
- Applies that authorization check during initial client creation and every
  subsequent bundle refresh.
- Keeps routing-stream authorization token-only; database and application
  selectors are not sent as query parameters.
- Includes safe application, database, credential, and scope context in
  opt-in in-memory telemetry without exposing tokens or passwords.

### Validation

- Adds focused coverage for matching contexts, rejected cross-database and
  scope mismatches, refresh-time enforcement, and isolated token contexts.
- Maintains 100% statements, branches, functions, and lines coverage with zero
  lint warnings.
- Typecheck, contract, syntax, and package dry-run checks pass.

## 0.1.9 — Standalone outage classification and complete operation telemetry

### Added

- Exposes `ServerUnavailableError` with the stable `SERVER_UNAVAILABLE` code when a standalone SQL route has no eligible server.
- Keeps multi-node route exhaustion classified as `CLUSTER_UNAVAILABLE`.
- Records telemetry for `execute()` and transaction operations alongside query latency and failure metrics.

### Validation

- Adds regression coverage for standalone drain classification and operation telemetry.
- Maintains 100% statements, branches, functions, and lines coverage with zero lint warnings.

## 0.1.8 — Explicit outage state and recovery observability

### Added

- Exposes `ClusterUnavailableError` with the stable `CLUSTER_UNAVAILABLE` code
  when no eligible SQL node can serve a route.
- Adds `DbClient.availability()` so applications can distinguish an available
  client from a fully unavailable primary route, including per-route status.
- Covers standalone node drain, total primary-route outage, and route recovery.
- Updates the TypeScript declarations for the new runtime API and error type.

### Validation

- Maintains 100% statements, branches, functions, and lines coverage.
- Tests and TypeScript typechecking pass with zero lint warnings.

## 0.1.7 — Routing shutdown contract completion

### Added

- Validates supervisor routing-control events before applying them.
- Supports node-specific shutdown events so only the retiring SQL node is
  drained by the client.
- Honors an optional `loadBalancerEndpoint` supplied during shutdown before
  REST resynchronization and WebSocket reconnect.
- Honors `reconnectDeadlineMs` and stops scheduling reconnect attempts after
  the deadline expires.
- Exposes the active endpoint and reconnect deadline in routing-stream state.
- Publishes typed routing-event declarations for TypeScript consumers.

### Validation

- Adds regression coverage for node-specific shutdown draining, endpoint
  replacement, deadline expiry, malformed events, and reconnect behavior.
- Maintains 100% statements, branches, functions, and lines coverage with
  zero lint warnings.
- Typecheck and diff validation pass.

## 0.1.6 — Graceful routing shutdown handoff

### Added

- Handles supervisor `routing.shutdown` events without exposing supervisor-
  specific internals to applications.
- Drains the affected SQL node so in-flight work can finish while new work is
  routed elsewhere.
- Closes the retiring WebSocket with restart code `1012` and reconnects through
  the configured load-balancer endpoint.
- Performs an immediate REST routing-bundle resynchronization when the stream
  is being retired or temporarily unavailable.
- Tracks intentional reconnects, failovers, and reconnect delay in telemetry.
- Adds regression coverage for shutdown events, close codes, reconnects, REST
  fallback, node draining, and telemetry behavior.

### Validation

- The complete test suite passes with 100% statements, branches, functions,
  and lines coverage.
- Syntax and diff validation pass.

## 0.1.5 — Telemetry and convention alignment

### Added

- Adds opt-in generic in-memory client telemetry for query counts, failures,
  retries, in-flight work, and latency.
- Sends telemetry over an attached routing stream once per second without
  sending SQL text or credentials.
- Adds public TypeScript declarations and smoke coverage for the telemetry and
  public client surface.
- Uses Snowflake identifiers for non-security temporary materialization paths.

### Refactored

- Extracts telemetry timing into a focused client module.
- Reorganizes `create-db` tests under the mirrored `tests/client/create-db/`
  hierarchy while retaining a small cross-cutting contract test.

### Validation

- Tests pass with 100% statements, branches, functions, and lines coverage.
- TypeScript typecheck passes with zero lint warnings.

## 0.1.4 — Explicit writer and failover routing

This release strengthens generic client-side routing for supervisor-provided
bundles. Applications still use the public library API; supervisor and CLI
policy remain outside the package.

### Added

- Supports explicit `writer`, ordered `failover`, and `readers` assignments in
  routing bundles.
- Replaces active writer and reader pools immediately when a valid routing
  update arrives through WebSocket or REST resynchronization.
- Keeps application clients independent so updating one application's bundle
  does not change another client's assignment.
- Selects the writer first and fails over in the supplied order when a node is
  drained or explicitly unavailable.
- Completes in-flight work during drain while excluding the node from new work.
- Enforces a 45-second maximum client-side drain window.

### Fixed and hardened

- Compares numeric and string bundle versions numerically and rejects stale
  updates, including versions such as `v10` versus `v9`.
- Validates routing hosts, ports, weights, duplicate nodes, and writer/failover
  overlap before pool creation.
- Preserves explicit writer, failover, and reader assignments during stream
  refreshes.

### Validation

- Adds integration-style coverage for pool replacement, per-client assignment
  isolation, writer failover, in-flight drain behavior, version ordering,
  WebSocket reconnect, and REST fallback.
- Maintains 100% statements, branches, functions, and lines coverage with zero
  lint warnings.
- Diff validation passes.

## 0.1.3 — Client-side routing drain lifecycle

This patch adds generic client-side handling for supervisor-published routing
drains and topology resynchronization. It does not add Supervisor, CLI, Galera,
backup, or GitOps policy to the library.

### Added

- Tracks active operations and acquired connections per route node.
- Exposes node lifecycle state and client drain status.
- Immediately excludes draining nodes from new work and force-closes remaining
  pool connections after the configurable 45-second default drain window.
- Handles recovery events for primary and balanced routes.
- Retries eligible read operations only; uncertain writes are not retried.
- Rejects stale routing events and applies REST resync bundles through the
  active routing handler.
- Adds WebSocket heartbeat scheduling and cleanup during reconnect and close.

### Validation

- Adds regression coverage for drain completion, forced cutoff, connection
  accounting, safe retry behavior, stale events, REST resync, and heartbeats.
- Maintains 100% statements, branches, functions, and lines coverage with zero
  lint warnings.
- Typecheck and diff validation pass.

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

### Validation

- ESM package targeting Node.js 26 or newer.
- TypeScript declarations are included with the package.
- Strict test coverage is maintained at 100% statements, branches, functions,
  and lines with zero lint warnings.
