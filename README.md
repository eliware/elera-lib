# @eliware/elera-lib

`@eliware/elera-lib` is Elera's lean shared protocol package. Its public API
contains only contracts and pure helpers currently consumed by multiple Elera
repos; internal modules remain non-public until their ownership is resolved.

Its only public runtime exports are `validateBundle` and `validateRoutingEvent`.
`validateBundle` validates and normalizes routing-bundle data, while
`validateRoutingEvent` validates and normalizes the shapes of routing updates,
topology, lifecycle, and shutdown events. Consumers own all resulting event
handling and runtime behavior.

For bundles, `validateBundle` normalizes the ordered `routes.primary` and
`routes.balanced` arrays described below.

Application code that needs native SQL connections must install
`@eliware/elera-client`. SQL pools, credentials, WebSocket connections,
database selection, backups, CLI commands, and supervisor orchestration are
not part of this package.

Routing bundles preserve the logical `database` label used for authorization
and display and carry the generated physical SQL schema in `physicalDatabase`.
They require normalized `routes.primary` and `routes.balanced` arrays containing
ordered `{ host, port }` nodes with optional `nodeId` and optional finite,
non-negative `weight`; validation trims host values and optional `nodeId`
values during normalization.
Bundles also carry application and identity scope, credentials, version, node
identity, service ports, and a
required future `expiresAt` timestamp. `validateBundle` rejects malformed, expired,
duplicates within a role list or writer/failover-conflicting route data;
reader and route-view endpoints may intentionally overlap because those are
independent views.

Bundle validation rejects non-finite numbers (`NaN`, `Infinity`, and
`-Infinity`) before JSON serialization; they are not normalized to `null`.
The shared validator enforces the 1 MiB serialized contract limit after
detachment. Applications and transports remain responsible for pre-allocation
resource limits.

`bundleVersion` is strictly a non-negative safe integer; numeric strings are
not accepted.

Bundle `nodeIdentity` is a required string; topology-event `nodeIdentity` is a
separate opaque object because the two contracts serve different wire formats.

Routing events are validated before consumers act on them. The library returns
detached normalized event objects; update events additionally return normalized
bundle fields. Event handling, client and supervisor lifecycle policies, and
telemetry remain in their owning repositories.

The supervisor owns topology and assignment policy; the CLI owns administration;
and `elera-client` owns SQL pools and application behavior. `elera-lib` supplies
only reusable contracts and helpers shared across those boundaries.

## Development

```bash
npm ci
npm test
npm run lint
npm run check
npm run typecheck
npm run contracts
npm run audit
npm run pack
```
