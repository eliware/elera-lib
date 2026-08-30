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

## Shared boundary

The public package provides complete bundle validation and routing-event
validation. Client lifecycle policy, runtime telemetry collection, version
comparison, writer/failover calculation, SQL errors, bundle retrieval, SQL
pools, credential materialization, Galera management, and CLI or supervisor
workflows belong to their owning packages.

Type declarations in this package describe only shared contract data. Client
and supervisor telemetry types remain in those owning packages unless they are
later adopted by at least two repositories as a common contract.

See `README.md` for the complete export boundary and
`contracts/routing-bundle.schema.json` for the machine-readable contract.
