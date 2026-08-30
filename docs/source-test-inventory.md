# Elera library source-to-test inventory

This inventory reflects the current working tree. The public entrypoint barrel
is excluded from focused implementation coverage; it is covered by the public
API test. Every other production module has a focused test at the matching
path under `tests/`.

## Barrels

- `src/index.mjs`

## Entrypoints and orchestrators

None. Application-facing transport and orchestration belong to
`@eliware/elera-client`.

## Implementation modules

- `src/bundle.mjs`
- `src/lifecycle/drain-policy.mjs`
- `src/lifecycle/materializer.mjs`
- `src/routing/bundle-fetcher.mjs`
- `src/routing/event-contract.mjs`
- `src/routing/node-validation.mjs`

## Focused source/test mapping

- `src/bundle.mjs` → `tests/bundle.test.mjs`
- `src/lifecycle/drain-policy.mjs` → `tests/lifecycle/drain-policy.test.mjs`
- `src/lifecycle/materializer.mjs` → `tests/lifecycle/materializer.test.mjs`
- `src/routing/bundle-fetcher.mjs` → `tests/routing/bundle-fetcher.test.mjs`
- `src/routing/event-contract.mjs` → `tests/routing/event-contract.test.mjs`
- `src/routing/node-validation.mjs` → no focused test currently present

## Cross-cutting tests

- `tests/cross-cutting/public-api.test.mjs` verifies the public entrypoint
  exports and excludes application-specific APIs.

## Current exception

`src/routing/node-validation.mjs` is a private helper used by bundle
validation, but its former focused test was removed during the boundary
refactor. Add `tests/routing/node-validation.test.mjs` before declaring the
source-to-test convention alignment complete.

## Audit rules

- Paths mirror the source tree without the `src/` segment.
- Barrels receive public-export tests rather than focused implementation tests.
- Cross-cutting tests supplement focused tests; they do not replace them.
- Regenerate this inventory whenever source or test modules are added, moved,
  deleted, or reclassified.
