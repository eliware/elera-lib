# API usage

## Install

Use Node.js 26 or later. Install the package in your ESM project:

```sh
npm install @eliware/elera-lib@15
```

The package uses native ESM and exposes no CommonJS entrypoint. It reads no environment variables. It opens no network or database connections.

Use `.mjs` files for native ESM. If you use `.js` files, set `"type": "module"` in your application's `package.json`.

## Import

Import the validators and logger factory from their packages:

```js
import { validateBundle, validateRoutingEvent } from "@eliware/elera-lib";
import { createLogger } from "@eliware/log";
```

The package exports only these two runtime functions. Do not import internal source paths.

Both functions accept an optional second argument with a `logger` property. The library writes no
records when you omit that property. When you inject a logger, it writes `debug` records when
validation starts, `info` records when validation succeeds, and `error` records when validation
fails. Records include the operation and safe result context. Records exclude input values and
error messages.

Inject a logger when you want to control its level, format, or transports:

```js
const logger = createLogger({ level: "debug", format: "json" });
const bundle = validateBundle(input, { logger });
```

The logger supports `error`, `warn`, `info`, `http`, `verbose`, `debug`, and `silly` levels.

## Validate a bundle

Pass a complete bundle object to `validateBundle`. The function returns a detached copy with normalized node values. It does not change the input object.

```js
const bundle = validateBundle({
  apiVersion: "v1",
  application: "billing",
  database: "billing",
  physicalDatabase: "elera_billing",
  identity: "billing-runtime",
  credentials: { username: "billing_runtime", password: "example-only" },
  writer: { host: "elera-0", port: 3306 },
  readers: [],
  failover: [],
  bundleVersion: 1,
  expiresAt: "2099-01-01T00:00:00Z",
  nodeIdentity: "elera-0",
  ports: { sql: 3306, http: 8080 },
  routes: { primary: [], balanced: [] },
});

console.log(bundle.bundleVersion);
```

The function throws `TypeError` when a bundle violates the contract. It rejects unknown fields, accessors, symbols, cyclic values, sparse arrays, non-finite numbers, and unsupported object types. It limits the serialized bundle to 1 MiB. See [bundle contract](bundle-contract.md) for every field and rule.

The validator checks `expiresAt` against the current process clock. It also checks `refreshAfter` against that clock when the field exists. Add a caller-owned clock check when your application needs replay control.

## Validate an event

Pass an event object to `validateRoutingEvent`:

```js
try {
  const event = validateRoutingEvent({
    type: "routing.drain",
    version: 1,
    generatedAt: "2099-01-01T00:00:00Z",
    node: "elera-0",
    context: {},
  });
  console.log(event.type);
} catch (error) {
  console.error(error.message);
}
```

The function returns a detached, validated event. It throws `TypeError` for an unknown event type, invalid fields, invalid timestamps, or unsupported JSON values. It limits the serialized event to 1 MiB. See [routing events](routing-events.md) for each event shape.

`routing.update` carries bundle fields at the event's top level. It does not use a nested `bundle` field.

## TypeScript

The package includes declarations for `RoutingNode`, `RoutingBundle`, `RoutingTopologyEvent`, and both public functions. Import the functions and types from the package root.

`validateBundle` accepts `unknown` and returns a validated `RoutingBundle`. `validateRoutingEvent` accepts and returns `unknown`. Narrow the event result by its `type` field before you read event-specific fields.

```ts
import { validateRoutingEvent, type RoutingTopologyEvent } from "@eliware/elera-lib";

const input: unknown = {
  type: "routing.topology",
  version: 1,
  generatedAt: "2099-01-01T00:00:00Z",
  node: "elera-0",
  context: {
    nodeIdentity: { name: "elera-0" },
    ports: { sql: 3306, http: 8080 },
    clusterCondition: "ready",
  },
  topology: { nodes: [] },
};
const result = validateRoutingEvent(input);
if (isTopologyEvent(result)) console.log(result.topology.nodes.length);

function isTopologyEvent(value: unknown): value is RoutingTopologyEvent {
  return (
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    value.type === "routing.topology"
  );
}
```

The validator checks data only. Your application must authenticate senders, enforce authorization, and apply each event.

## Supported scope

This package validates data. It does not fetch bundles, open a WebSocket, select routes, create a SQL client, drain nodes, or reconnect clients. The consuming application owns those actions.

The validators support a logger option. The package reads no environment variables.
