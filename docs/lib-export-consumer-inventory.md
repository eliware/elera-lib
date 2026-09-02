# `elera-lib` public export inventory

This inventory reflects direct source imports in the Elera repositories on
2026-09-02. Tests and documentation are noted separately from runtime
consumers. The strict boundary rule is that a helper belongs here only when
at least two repositories genuinely use it.

## Public runtime exports

| Export | Runtime consumers | Ownership |
| --- | --- | --- |
| `validateBundle` | `elera-client`, `elera` | Shared bundle contract |
| `validateRoutingEvent` | `elera-client`, `elera` | Shared event contract |

`src/index.mjs` is the only public barrel. No application SDK, SQL pool,
supervisor orchestration, CLI administration, telemetry collector, or stream
transport is exported from this package.

## Repository summary

- `elera-client` directly consumes the two shared exports above and owns its
  client-specific drain timeout policy.
- `elera` directly consumes the two shared exports above and owns its local
  supervisor drain timeout policy.
- `elera-cli` has no current runtime import from `elera-lib`.
- `elera-example` uses `@eliware/elera-client` for application behavior; this
  repository's validation-only example imports `validateBundle` directly from
  `@eliware/elera-lib`.

## Boundary decisions

- Bundle and event schemas and validation remain shared because both the client
  and supervisor consume them.
- Client errors, bundle refresh policy, SQL pools, route selection,
  WebSocket/REST orchestration, and client telemetry remain in
  `elera-client`.
- Supervisor assignment, database administration, Galera lifecycle, and
  server telemetry remain in `elera`.
- CLI administration and SQL pass-through behavior remain in `elera-cli`.
- Application behavior remains in `elera-example` or consuming applications.

## Audit notes

- `createRoutingStream` was removed because no repository directly consumes
  it from the shared package; stream transport is client-owned.
- `validateRoutingNode` and related routing internals remain private helpers for
  shared contract enforcement and are not public shared exports.
- The example application does not justify expanding the shared public API;
  application behavior remains in `@eliware/elera-client`.
- Re-run this inventory whenever exports or direct consumer imports change.
- The 1.1.0 release retains the same two-export public boundary; its additional
  changes are internal validation hardening and add no consumer imports.
