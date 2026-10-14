# Release Notes

## 12.0.0 — 2026-10-14

### Breaking changes

- Remove `clientDrainTimeout` from the public API. Keep `validateBundle` and `validateRoutingEvent` as the supported exports. Move client drain policy to its owner.

### Changed

- Validate detached routing bundle and event data. Reject unknown fields, unsafe object properties, invalid timestamps, and unsupported JSON values.
- Keep the bundle and event schemas in sync with runtime validation and checked-in fixtures.
- Add direct tests for every source module. Require full statement, branch, function, and line coverage.
- Align package metadata, npm package contents, CI, and Knit commands with convention version 12.0.
- Add end-user docs for setup, the public API, bundle fields, routing events, and errors.

### Security

- Reject invalid shutdown endpoints, including local, private, and unspecified addresses. Require consumers to apply their own connection policy.

## 0.3.1 — 2026-08-29

### Changed

- Remove the unused routing stream and common package dependency. Keep the public API focused on shared bundle and event validation.
- Update examples and docs to show the shared validation boundary.

## 0.3.0 — 2026-08-29

### Changed

- Define shared routing bundle and event contracts. Remove client, transport, lifecycle, telemetry, and administration behavior from the library.
- Add validation for bundles, updates, topology, drain, recovery, and shutdown events.

## 0.2.0 — 2026-08-29

### Added

- Add a managed database client, bundle retrieval, routing streams, and token-bound context checks.

## 0.1.11 — 2026-08-29

### Changed

- Add public runtime declarations for the earlier package API.

## 0.1.10 — 2026-08-29

### Added

- Add token context validation for application, database, identity, credentials, and scopes.

## 0.1.9 — 2026-08-29

### Added

- Add standalone outage classification and operation telemetry.

## 0.1.8 — 2026-08-28

### Added

- Add client availability status and cluster outage errors.

## 0.1.7 — 2026-08-28

### Added

- Add routing shutdown events, endpoint updates, and reconnect deadlines.

## 0.1.6 — 2026-08-28

### Added

- Add graceful client handoff for routing shutdown events.

## 0.1.5 — 2026-08-28

### Added

- Add optional client telemetry and TypeScript declarations.

## 0.1.4 — 2026-08-28

### Added

- Add writer, failover, and reader routing with node validation.

## 0.1.3 — 2026-08-27

### Added

- Add client-side routing drains, recovery events, stale-event checks, and safe read retries.

## 0.1.2 — 2026-08-27

### Fixed

- Map `MYSQL_SOCKET` to the database driver's `socketPath` option.

## 0.1.1 — 2026-08-27

### Added

- Add local socket support, route-node controls, and routing stream state.

## 0.1.0 — 2026-08-27

### Added

- Add a multi-route SQL client, connection pools, routing, event transport, telemetry, and verification helpers.
