# Agent guidance

Use Node.js 26 native ESM and keep the public entrypoint small. Shared logging,
errors, paths, and lifecycle behavior must come through `@eliware/common`.
Keep routing, pool, credential, and health behavior in focused modules. Tests
belong under `tests/` and mirror `src/`. Do not add Elera supervisor, HAProxy,
GitOps, backup, or CLI policy to this generic SQL library.
