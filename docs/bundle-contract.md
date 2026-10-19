# Routing bundle contract

`validateBundle` accepts one plain object that follows the `v1` bundle contract. It returns a detached object with normalized routing nodes.

## Required fields

| Field              | Type          | Rule                                                                                                                                   |
| ------------------ | ------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `apiVersion`       | string        | Must equal `v1`.                                                                                                                       |
| `application`      | string        | Must contain non-space text.                                                                                                           |
| `database`         | string        | Must contain non-space text. This is the logical database name.                                                                        |
| `physicalDatabase` | string        | Must contain non-space text. This is the physical SQL schema name.                                                                     |
| `identity`         | string        | Must contain non-space text.                                                                                                           |
| `credentials`      | object        | Must have only `username` and `password`. Username must contain non-space text. Password must be a string. An empty password is valid. |
| `writer`           | node          | Must contain a valid host and `port` value.                                                                                            |
| `readers`          | node array    | May be empty. Nodes in this list must be unique.                                                                                       |
| `failover`         | node array    | May be empty. Nodes in this list must be unique and must not repeat the writer.                                                        |
| `bundleVersion`    | integer       | Must be zero or greater.                                                                                                               |
| `expiresAt`        | UTC date-time | Must be in the future.                                                                                                                 |
| `nodeIdentity`     | string        | Must contain non-space text.                                                                                                           |
| `ports`            | object        | Must include valid `sql` and `http` port values.                                                                                       |
| `routes`           | object        | Must include `primary` and `balanced` node arrays.                                                                                     |

## Optional fields

| Field            | Type          | Rule                                                             |
| ---------------- | ------------- | ---------------------------------------------------------------- |
| `applicationId`  | string        | Must contain non-space text when supplied.                       |
| `databaseId`     | string        | Must contain non-space text when supplied.                       |
| `identityId`     | string        | Must contain non-space text when supplied.                       |
| `credentialName` | string        | Must contain non-space text when supplied.                       |
| `scopes`         | string array  | Every item must contain non-space text. An empty array is valid. |
| `refreshAfter`   | UTC date-time | Must be a valid future date when supplied.                       |

## Nodes and ports

A `port` is a number that identifies an application endpoint on a host. Each routing node has a `host` string and an integer `port` from 1 through 65535. A node may have a finite `weight` of zero or greater. A node may also have a non-empty `nodeId` string. The validator trims `host` and `nodeId` values in its returned copy.

The validator checks that `host` contains text. It does not resolve the host or test network access. The consuming application owns those checks.

The `ports` object must include `sql` and `http`. It may include other named services. Each name must contain text without leading or trailing whitespace. Each value must be an integer from 1 through 65535.

Each node may contain only `host`, `port`, `weight`, and `nodeId`. The `host` value must contain non-space text. The `weight` value must be finite and non-negative when supplied.

The validator rejects duplicate endpoints in each node list. An endpoint is the combination of `host` and `port`. A failover endpoint cannot match the writer endpoint. Reader and route lists may share endpoints with other roles.

The `routes` object accepts only `primary` and `balanced`. Both values must be arrays of valid nodes. Each route list rejects duplicate endpoints. The two route lists may share endpoints.

## Timestamps

The validator accepts timestamps in `YYYY-MM-DDTHH:mm:ssZ` format. It also accepts exactly three fractional second digits before `Z`. It rejects invalid dates, offsets, and other fractional precision.

`expiresAt` and `refreshAfter` must be later than the current process time. The validator does not compare `refreshAfter` with `expiresAt`. Your application can add its own clock check when replay control is necessary.

The validator does not increment `bundleVersion` or manage bundle updates. The producer owns version assignment.

## Data limits

The validator rejects unknown fields. It rejects symbols, accessors, cyclic values, sparse arrays, non-finite numbers, and unsupported object types. It accepts JSON-compatible data only. The maximum nested value depth is 100.

The serialized bundle limit is 1 MiB. The validator copies the bundle before it returns. Changes to the returned object do not change the input object. Use plain objects or objects with null prototypes.

## Complete example

```js
const input = {
  apiVersion: "v1",
  application: "billing",
  database: "billing",
  physicalDatabase: "elera_billing",
  identity: "billing-runtime",
  credentials: { username: "billing_runtime", password: "example-only" },
  writer: { host: "elera-0", port: 3306 },
  readers: [{ host: "elera-0", port: 3306 }],
  failover: [{ host: "elera-1", port: 3306 }],
  bundleVersion: 1,
  expiresAt: "2099-01-01T00:00:00Z",
  nodeIdentity: "elera-0",
  ports: { sql: 3306, http: 8080 },
  routes: {
    primary: [{ host: "elera-0", port: 3306 }],
    balanced: [{ host: "elera-0", port: 3306 }],
  },
};
```

See the [bundle specification](../specs/bundle-contract.yaml) for the contract rules and YAML examples.
