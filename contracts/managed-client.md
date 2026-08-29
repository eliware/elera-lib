# Managed client contract

This is the application-facing contract for Elera-managed SQL access. It is
separate from low-level programmatic APIs so applications do not need to
know physical SQL hosts, database names, SQL usernames, passwords, or cluster
topology.

## Required application configuration

An application supplies exactly:

```text
ELERA_API_ENDPOINT=http://supervisor-or-load-balancer:8080
ELERA_API_TOKEN=<application-scoped-token>
```

The token identifies the application, database, identity, and permitted
scopes. Multiple databases are represented by multiple client instances and
tokens; the application does not select a database by request argument.

The first authenticated bundle establishes that authorization context. Later
bundle updates must remain within the same application, database, identity,
credential, and scope boundary; a cross-context update is rejected.

## Library responsibilities

The managed client:

1. Retrieve the initial routing bundle over the authenticated REST API.
2. Materialize the returned SQL credentials internally.
3. Route reads and writes according to the bundle.
4. Maintain the routing WebSocket and REST fallback.
5. Apply routing, drain, shutdown, recovery, and bundle-update events.
6. Handle connection failover without exposing topology policy to the app.

The application receives the normal SQL client interface. It does not need to
construct a bundle, provide a credential provider, or configure primary and
balanced SQL hosts.

The corresponding library entry point is `createDb({ endpoint, token })`.
Both properties are optional when `ELERA_API_ENDPOINT` and
`ELERA_API_TOKEN` are present in the process environment. The constructor
reads those variables automatically when arguments are omitted.
The optional transport and driver arguments exist for testing and deployment
integration; applications normally provide only the two required values.

## Supervisor response boundary

The bundle may contain application/database/identity IDs, internal database and
credential material, writer/readers/failover routes, node identity and port
data, version, expiry, and refresh metadata. These values are consumed by the
library and are not application configuration.

Low-level bundle and profile APIs remain available for internal composition and
testing. They are not application configuration and are not used by the
managed application workflow.
