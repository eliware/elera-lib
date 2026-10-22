# Release Notes

## 15.0.0 — 2026-10-21

### Added

- Add complete bundle and event examples, field rules, validation limits, TypeScript guidance, and troubleshooting steps to the user guides.
- Add optional structured logging to both validators through `@eliware/log` 15.0.0. Inject a logger to receive safe `debug`, `info`, and `error` records with operation context.

### Changed

- Set the package version to 15.0.0 and specification versions to 15.0. Update Eliware Test and npm dependencies.
- Let `validateBundle` accept `unknown` input and return a validated, detached `RoutingBundle`.
- Add an optional logger property to both public validator options. The validators write no records when a caller omits a logger.
- Update CI and npm publication workflows to use current GitHub Actions. Fetch full Git history for CI validation and rename the publish workflow to `npm.yaml`.
- Update Knit deployment to use the configured Git branch when it pulls repository changes.
- Expand and correct end-user documentation, package specifications, and repository guidance.

### Fixed

- Reject undeclared bundle fields before copying input. Reject sparse arrays, non-index array properties, and unsupported event values.
- Normalize IPv4-mapped IPv6 addresses before classifying shutdown endpoints. Reject private and unspecified endpoints. Reject `255.255.255.255`.
- Report serialized byte limits consistently and clarify shutdown endpoint error messages.

## 12.0.0 — 2026-10-14

### Breaking changes

- Remove `clientDrainTimeout` from the public API. Keep `validateBundle` and `validateRoutingEvent` as the supported exports.
- Move client drain policy to its owner package.

### Added

- Add TypeScript declarations for both public validators.
- Add bundle and routing-event specifications in YAML with contract examples.
- Replace standalone JSON contract schemas with YAML specifications.
- Add end-user guides for setup, API use, bundle fields, events, and troubleshooting.
- Add focused tests for all runtime modules. Require full line, branch, statement, and function coverage.

### Changed

- Split bundle and event validation into focused modules. Keep the two public exports stable.
- Validate detached JSON data. Reject unknown fields, accessors, symbols, cycles, sparse arrays, invalid dates, and invalid values.
- Validate bundle fields, ports, routes, expiry dates, and node conflicts.
- Validate update, topology, drain, recovery, and shutdown events.
- Align package metadata, dependencies, package contents, CI, and Knit workflows with convention 12.0.
- Update the README and examples to show the supported package scope.

### Fixed

- Match specification rules to runtime rules for node identity, event types, deadlines, and safe bundle versions.
- Require update events to include a valid event type and timestamp.
- Keep the expiry test valid after 2030.

### Security

- Reject invalid shutdown URLs and local, private, or unspecified address literals.
- Require consumers to apply connection and network policy at the live connection boundary.

## 0.3.1 — 2026-08-29

### Changed

- Remove the routing stream and common package dependency. Keep the public API focused on shared bundle and event validation.
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

- Add standalone outage categories and operation telemetry.

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
