# Agent guidance

Use Node.js 26 native ESM and keep the public entrypoint small. Keep shared
routing contracts and lifecycle policy in focused modules. Tests
belong under `tests/` and mirror `src/`. Do not add Elera supervisor, HAProxy,
GitOps, backup, or CLI policy to this generic SQL library.
