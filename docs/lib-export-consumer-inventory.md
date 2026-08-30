# `elera-lib` public export inventory

This inventory reflects direct source imports in the Elera repositories on
2026-08-29. Tests and documentation are noted separately from runtime
consumers. The strict boundary rule is that a helper belongs here only when
at least two repositories genuinely use it.

## Public runtime exports

| Export | Runtime consumers | Ownership |
| --- | --- | --- |
| `validateBundle` | `elera-client`, `elera` | Shared bundle contract |
| `validateRoutingEvent` | `elera-client`, `elera` | Shared event contract |
| `clientDrainTimeout` | `elera-client`, `elera` | Shared lifecycle policy |

`src/index.mjs` is the only public barrel. No application SDK, SQL pool,
supervisor orchestration, CLI administration, telemetry collector, or stream
transport is exported from this package.

## Repository summary

- `elera-client` directly consumes the three shared exports above.
- `elera` directly consumes the three shared exports above.
- `elera-cli` has no current runtime import from `elera-lib`.
- `elera-example` still contains stale imports of the old application-facing
  API and must migrate to `@eliware/elera-client`.

## Boundary decisions

- Bundle and event schemas, validation, and the generic drain-timeout policy
  remain shared because both the client and supervisor consume them.
- Client errors, bundle expiry/version logic, SQL pools, route selection,
  WebSocket/REST orchestration, and client telemetry remain in
  `elera-client`.
- Supervisor assignment, database administration, Galera lifecycle, and
  server telemetry remain in `elera`.
- CLI administration and SQL pass-through behavior remain in `elera-cli`.
- Application behavior remains in `elera-example` or consuming applications.

## Audit notes

- `createRoutingStream` was removed because no repository directly consumes
  it from the shared package; stream transport is client-owned.
- `validateRoutingNode` and related routing internals remain private to their
  owning implementation and are not public shared exports.
- The example application’s stale imports are a consumer migration issue, not
  justification for expanding the shared public API.
- Re-run this inventory whenever exports or direct consumer imports change.
