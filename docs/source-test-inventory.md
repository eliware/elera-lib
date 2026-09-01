# Elera library source-to-test inventory

The canonical public entrypoint is `src/index.mjs`. Internal modules are
imported from their canonical `index.mjs` files; compatibility entrypoints and
legacy re-export barrels are intentionally not provided.

Tests mirror the source tree under `tests/` without a redundant `src/`
segment. Each production module has a matching test path, including focused
tests for orchestration and public entrypoints. The declaration surface is
covered by `tests/index.d.ts` and the typecheck gate.

Update this inventory whenever source or test modules are added, moved,
deleted, or reclassified.
