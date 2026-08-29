# @eliware/elera-lib

`@eliware/elera-lib` is Elera's shared protocol and helper package. It contains
the contracts and policy primitives used by the supervisor, CLI, and
`@eliware/elera-client`.

It provides routing-bundle validation, version comparison, writer assignment,
ordered failover helpers, routing-event validation, shared SQL and availability
errors, the client drain policy, and transport-neutral in-memory telemetry.

Application code that needs native SQL connections must install
`@eliware/elera-client`. SQL pools, credentials, WebSocket connections,
database selection, backups, CLI commands, and supervisor orchestration are
not part of this package.

Routing bundles use normalized `routes.primary` and `routes.balanced` arrays
containing ordered `{ host, port, weight }` nodes. A bundle may also carry a
writer, readers, ordered failover nodes, application/database/identity scope,
credentials, version, and expiry. `validateBundle` rejects malformed,
expired, duplicated, or conflicting route data.

Routing events are validated before consumers act on them. Shared errors
distinguish an unavailable server from an unavailable cluster. The drain policy
caps client drain windows at 45 seconds. Telemetry is observational and never
contains bearer tokens, passwords, SQL, or connection pools.

The supervisor and CLI own policy, persistence, authentication, provisioning,
recovery, and transport orchestration. `elera-lib` supplies reusable contracts
and helpers only.

## Development

```bash
npm ci
npm test
npm run lint
npm run typecheck
npm run pack
```
