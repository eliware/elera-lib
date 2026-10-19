# Routing event contract

`validateRoutingEvent` accepts a routing event object. It returns a detached, validated copy. The event must use JSON-compatible values.

## Shared fields

Every event has `type`, `version`, and `generatedAt`. The event version must be a non-negative integer. The update and topology event versions must be greater than zero. Other event versions may be zero.

The `generatedAt` field must use UTC in `YYYY-MM-DDTHH:mm:ssZ` format. It may include exactly three fractional second digits before `Z`. The validator rejects invalid dates, local offsets, and other fractional precision. It does not compare `generatedAt` with the current time.

The validator rejects unknown event fields. It rejects accessors, symbols, cyclic values, sparse arrays, non-finite numbers, and unsupported object types. It accepts only JSON-compatible data and limits each serialized event to 1 MiB.

## Event types

| Type               | Required fields                         | Rules                                                                                         |
| ------------------ | --------------------------------------- | --------------------------------------------------------------------------------------------- |
| `routing.update`   | Bundle fields                           | `version` must be greater than zero. Bundle fields appear at the event's top level.           |
| `routing.topology` | `node`, `context`, `topology`           | `version` must be greater than zero. `node` must contain non-space text.                      |
| `routing.drain`    | `node`, `context`                       | `node` must contain non-space text. `context` must be a JSON object.                          |
| `routing.recovery` | `node`, `context`                       | `node` must contain non-space text. `context` must be a JSON object.                          |
| `routing.shutdown` | `node`, `reason`, `reconnectDeadlineMs` | `node` and `reason` must contain non-space text. The deadline must be a non-negative integer. |

The update event uses the complete bundle contract. Bundle fields belong at the event's top level. The validator rejects unlisted event fields.

## Topology context

The `context` object in a `routing.topology` event accepts only these fields:

| Field              | Rule                                                         |
| ------------------ | ------------------------------------------------------------ |
| `nodeIdentity`     | Object with only a non-empty `name` string.                  |
| `ports`            | Object with valid `sql` and `http` values. `ws` is optional. |
| `clusterCondition` | Non-empty string.                                            |
| `refreshAfter`     | Optional valid UTC date-time.                                |

The `topology` object accepts only a `nodes` array. Each node must contain `nodeId`, `address`, `sqlPort`, `state`, and `draining`. The text fields must contain non-space text. The `sqlPort` value must be an integer from 1 through 65535. The `draining` value must be a Boolean. Node IDs must be unique in the array.

The optional topology context `refreshAfter` field must be a valid UTC timestamp. The validator checks its format and calendar value. It does not require this timestamp to be in the future.

The `routing.drain` and `routing.recovery` context values may contain application-specific JSON fields. The validator checks that each context is an object. It does not interpret the context fields.

## Shutdown endpoint

`loadBalancerEndpoint` is optional. When supplied, it must be an HTTP or HTTPS URL with a host. It cannot include user data, a query, or a fragment. The validator rejects localhost, `.local` hostnames, recognized private addresses, unspecified addresses, and nonstandard IP literal formats.

The validator checks URL text. It does not resolve hostnames or inspect the final connection. Your application must enforce its own connection and network policy with checks for DNS results that resolve to private addresses.

## Event examples

Use these examples as event shapes. Replace sample names and timestamps with values from your application.

## Examples

```js
import { validateBundle, validateRoutingEvent } from "@eliware/elera-lib";

const bundle = validateBundle({
  apiVersion: "v1",
  application: "billing",
  database: "billing",
  physicalDatabase: "elera_billing",
  identity: "billing-runtime",
  credentials: { username: "billing_runtime", password: "fixture-only" },
  writer: { host: "elera-0", port: 3306 },
  readers: [],
  failover: [],
  bundleVersion: 1,
  expiresAt: "2099-01-01T00:00:00Z",
  nodeIdentity: "elera-0",
  ports: { sql: 3306, http: 8080 },
  routes: { primary: [], balanced: [] },
});

const update = {
  type: "routing.update",
  version: 1,
  generatedAt: "2099-01-01T00:00:00Z",
  ...bundle,
};

const validated = validateRoutingEvent(update);

const topology = validateRoutingEvent({
  type: "routing.topology",
  version: 1,
  generatedAt: "2099-01-01T00:00:00Z",
  node: "elera-0",
  context: {
    nodeIdentity: { name: "elera-0" },
    ports: { sql: 3306, http: 8080 },
    clusterCondition: "ready",
  },
  topology: {
    nodes: [
      { nodeId: "elera-0", address: "10.0.0.1", sqlPort: 3306, state: "ready", draining: false },
    ],
  },
});

const drain = validateRoutingEvent({
  type: "routing.drain",
  version: 0,
  generatedAt: "2099-01-01T00:00:00Z",
  node: "elera-0",
  context: { cause: "maintenance" },
});

const recovery = validateRoutingEvent({
  type: "routing.recovery",
  version: 0,
  generatedAt: "2099-01-01T00:00:00Z",
  node: "elera-0",
  context: { cause: "recovered" },
});

const shutdown = validateRoutingEvent({
  type: "routing.shutdown",
  version: 1,
  generatedAt: "2099-01-01T00:00:00Z",
  node: "elera-0",
  reason: "maintenance",
  reconnectDeadlineMs: 5000,
  loadBalancerEndpoint: "https://routing.example.com/shutdown",
});
```

The update example assumes that `bundle` follows the [bundle contract](bundle-contract.md). A shutdown endpoint is optional. See the [routing event specification](../specs/routing-event-contract.yaml) for all event rules and YAML examples.
