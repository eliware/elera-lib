# Routing event contract

`validateRoutingEvent` accepts a routing event object. It returns a detached, validated copy. The event must use JSON-compatible values.

## Shared fields

Every event has `type`, `version`, and `generatedAt`. `version` is a non-negative integer. The event type rules can require a value above zero. `generatedAt` must use UTC in this form: `YYYY-MM-DDTHH:mm:ssZ` or `YYYY-MM-DDTHH:mm:ss.sssZ`.

The validator rejects unknown fields. It rejects accessors, symbols, cyclic values, sparse arrays, non-finite numbers, and unsupported object types.

## Event types

| Type               | Required fields                         | Rules                                                                                                  |
| ------------------ | --------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `routing.update`   | Bundle fields                           | `version` must be above zero. The event fields use the [bundle contract](bundle-contract.md).          |
| `routing.topology` | `node`, `context`, `topology`           | `version` must be above zero. `node` must contain non-space text. `topology` has only a `nodes` array. |
| `routing.drain`    | `node`, `context`                       | `node` must contain non-space text. `context` must be a JSON object.                                   |
| `routing.recovery` | `node`, `context`                       | `node` must contain non-space text. `context` must be a JSON object.                                   |
| `routing.shutdown` | `node`, `reason`, `reconnectDeadlineMs` | `node` and `reason` must contain non-space text. The deadline must be a non-negative integer.          |

## Topology context

The `context` object in a `routing.topology` event has these fields:

| Field              | Rule                                                        |
| ------------------ | ----------------------------------------------------------- |
| `nodeIdentity`     | Object with only a non-empty `name` string.                 |
| `ports`            | Object with valid `sql` and `http` ports. `ws` is optional. |
| `clusterCondition` | Non-empty string.                                           |
| `refreshAfter`     | Optional valid UTC date-time.                               |

Each `topology.nodes` item has `nodeId`, `address`, `sqlPort`, `state`, and `draining`. The first four fields must be non-empty strings, except `sqlPort`, which must be an integer from 1 to 65535. `draining` must be a Boolean. Node IDs must be unique.

## Shutdown endpoint

`loadBalancerEndpoint` is optional. When present, it must be an HTTP or HTTPS URL with a host. It cannot include user data, a query, or a fragment. It cannot use localhost, a local address, or an unspecified address.

The validator checks the endpoint text. The consuming application must apply its own connection and network policy.

## Examples

```js
const update = {
  type: "routing.update",
  version: 1,
  generatedAt: "2099-01-01T00:00:00Z",
  ...bundle,
};

const validated = validateRoutingEvent(update);
```

The example assumes that `bundle` follows the [bundle contract](bundle-contract.md). See the [routing event specification](../specs/routing-event-contract.yaml) for event rules and YAML examples.
