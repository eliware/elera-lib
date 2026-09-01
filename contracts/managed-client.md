# Shared contract boundary

This document describes the bundle and event contract consumed by Elera
components. It is not an application-client API; application-facing SQL
connections belong to `@eliware/elera-client`.

## Routing bundles

The supervisor publishes a complete `v1` bundle containing application,
logical `database`, generated physical SQL schema `physicalDatabase`, identity,
credentials, writer, readers, ordered failover nodes, bundle version, future
expiry, node identity, and service ports. The normalized route arrays are
`routes.primary` and `routes.balanced`.

Route nodes contain `host` and `port`; `host` is trimmed during normalization,
while optional `nodeId` is preserved as supplied. Nodes may have finite,
non-negative numeric `weight`. Route lists are shape-validated views; endpoint
overlap between reader and route views is intentional and is not treated as a
conflict. Additional bundle service ports use the same integer-port validation;
their keys are opaque non-empty service-name strings.

`validateBundle()` rejects missing required fields, malformed nodes or ports,
expired timestamps, writer/failover overlap, and invalid route arrays. Reader
and route-view overlap is allowed because those lists are independent views.
Consumers must validate a complete bundle before using it. Update events carry
a complete replacement bundle. Completeness is enforced by delegating their
bundle fields to `validateBundle()`; consumers decide how to merge any
application-specific state outside this contract.

## Routing events

`validateRoutingEvent()` defines the shared event boundary for routing updates,
topology, drains, recovery, and shutdown. Event handling and transport
orchestration are owned by the consuming client or supervisor; this package
supplies contracts and validation only.

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
