# @eliware/elera-lib

`@eliware/elera-lib` is Elera's lean shared protocol package. Its public API
contains only contracts and pure helpers currently consumed by multiple Elera
repos; internal modules remain non-public until their ownership is resolved.

It provides routing-bundle validation and routing-event validation.

Application code that needs native SQL connections must install
`@eliware/elera-client`. SQL pools, credentials, WebSocket connections,
database selection, backups, CLI commands, and supervisor orchestration are
not part of this package.

Routing bundles use normalized `routes.primary` and `routes.balanced` arrays
containing ordered `{ host, port, weight }` nodes. A bundle may also carry a
writer, readers, ordered failover nodes, application/database/identity scope,
credentials, version, and expiry. `validateBundle` rejects malformed,
expired, duplicated, or conflicting route data.

Routing events are validated before consumers act on them. Client and
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
