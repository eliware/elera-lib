# Shared contract boundary

This document describes the bundle and event contract consumed by Elera
components. It is not an application-client API; application-facing SQL
connections belong to `@eliware/elera-client`.

## Routing bundles

The supervisor publishes a complete `v1` bundle containing application,
database, identity, credentials, writer, readers, ordered failover nodes,
bundle version, expiry, node identity, and service ports. The normalized route
arrays are `routes.primary` and `routes.balanced`.

`validateBundle()` rejects missing required fields, malformed nodes or ports,
expired timestamps, duplicate writer/failover nodes, and invalid route arrays.
Consumers must validate a complete bundle before using it. Partial routing
events must be merged with the active complete bundle by the consumer before
validation.

## Routing events

`validateRoutingEvent()` defines the shared event boundary for routing updates,
drains, recovery, and shutdown. Event handling and transport orchestration are
owned by the consuming client or supervisor; this package supplies contracts
and validation only.

## Shared helpers

The public package provides bundle and node validation, version comparison,
writer/failover calculation, shared SQL errors, client drain policy, and
transport-neutral telemetry. It does not retrieve bundles, open SQL pools,
materialize application credentials, provision databases, manage Galera, or
implement CLI and supervisor workflows.

See `README.md` for the complete export boundary and
`contracts/routing-bundle.schema.json` for the machine-readable contract.
