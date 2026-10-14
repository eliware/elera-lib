# Source and test inventory

The public entry point is `src/index.mjs`. It exports `validateBundle` and `validateRoutingEvent`.

Each of the 70 runtime modules under `src/` has one matching test under `tests/`. Run `npm test` to check source and test parity, test behavior, and coverage.

The package declarations are in `src/index.d.ts`. Run `npm run typecheck` to check them.
