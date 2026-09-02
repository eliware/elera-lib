# @eliware/elera-lib

`@eliware/elera-lib` is Elera's lean shared protocol package. Its public API
contains only contracts and pure helpers currently consumed by multiple Elera
repos; internal modules remain non-public until their ownership is resolved.

It provides routing-bundle validation and routing-event validation.

Application code that needs native SQL connections must install
`@eliware/elera-client`. SQL pools, credentials, WebSocket connections,
database selection, backups, CLI commands, and supervisor orchestration are
not part of this package.

Routing bundles preserve the logical `database` label used for authorization
and display and carry the generated physical SQL schema in `physicalDatabase`.
They require normalized `routes.primary` and `routes.balanced` arrays containing
ordered `{ host, port }` nodes with optional `nodeId` and optional finite,
non-negative `weight`; validation trims host values while preserving optional
`nodeId` values as supplied.
Bundles also carry application and identity scope, credentials, version, node
identity, service ports, and a
future `expiresAt` timestamp. `validateBundle` rejects malformed, expired,
duplicated within a role list or writer/failover-conflicting route data;
independent role views may intentionally overlap.

`bundleVersion` is strictly a non-negative safe integer; numeric strings are
not accepted.

Bundle `nodeIdentity` is a required string; topology-event `nodeIdentity` is a
separate opaque object because the two contracts serve different wire formats.

Routing events are validated before consumers act on them. Envelope-only events
are returned unchanged; update events return a new object with normalized bundle
fields. Client and
supervisor lifecycle policies remain in their owning repositories. Telemetry
is owned by the client and supervisor rather than this package.

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
