# `elera-lib` alignment drifts

Checklist against the revised Core Flow, supervisor plan, and applicable
repository conventions. This records findings only; it does not itself change
the implementation.

Last reviewed 2026-09-02 against the current worktree. Earlier dates in the
consumer and source inventories record those inventories' own runs; they are
not this document's review date. “Validation gates” means
the repository's configured test, lint, syntax, contract, typecheck, audit, and
package dry-run commands.

## Current status

- [x] Ownership and dependency cleanup are complete locally.
- [x] Public exports and source/test inventory reflect the lean shared boundary.
- [x] Final validation gates pass in the latest local verification run:
  tests, lint, syntax, contracts, typecheck, audit, and package dry-run.

## Actionable drifts

- [x] Update `package.json` metadata: the description now reflects the lean
  contracts-and-validation boundary rather than lifecycle helpers.
- [x] Update `contracts/managed-client.md` to reflect that client lifecycle
  policy, telemetry collection, and client-specific behavior remain outside
  the lean shared package.
- [x] `validateBundle()` rejects malformed and expired `expiresAt` values.
- [x] Remove the unused `@eliware/snowflake` runtime dependency; stable ID
  generation remains owned by the supervisor/CLI layers.
- [x] Removed telemetry declarations from the public shared package; telemetry
  types remain owned by the client and supervisor packages.
- [x] Re-run the export-consumer inventory after the preceding boundary
  decisions and confirm every retained public export has at least two external
  runtime consumers. Verified 2026-09-02; both retained exports have multiple
  external consumers. The bundled example is intentionally excluded because it
  is a validation smoke example, not an external repository consumer.

- [x] Reconcile schema/runtime/type differences for route requiredness and port
  normalization; the shared contract now requires both route arrays and integer
  ports, and includes the credential-free routing.topology event.
- [x] Harden pre-detachment descriptor checks so accessors, symbols, and
  non-enumerable fields cannot be silently discarded by `structuredClone`.
- [x] Reject undeclared credential and topology-identity fields, and reject
  IPv6 loopback, unspecified addresses, and trailing-dot localhost shutdown
  endpoints.
- [x] Confirm `codescope release` passes with no reported issues.

## Verified alignment

- [x] Public runtime exports are limited to bundle and routing-event
  validation.
- [x] No application SQL pool, WebSocket transport, supervisor recovery,
  Galera, CLI administration, backup, or restore implementation is exported.
- [x] Source and focused-test paths are mirrored, with the public barrel
  covered by a cross-cutting test.
- [x] No non-barrel Istanbul ignores were found.
- [x] No local links, copied consumer source, or repository-specific imports
  exist inside the library.
- [x] Tests, lint, typecheck, contracts, audit, syntax, package dry-run, and
  `codescope release` passed in the latest local verification run on 2026-09-02.
