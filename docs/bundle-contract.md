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
| `writer`           | node          | Must contain a valid host and port.                                                                                                    |
| `readers`          | node array    | May be empty. Nodes in this list must be unique.                                                                                       |
| `failover`         | node array    | May be empty. Nodes in this list must be unique and must not repeat the writer.                                                        |
| `bundleVersion`    | integer       | Must be zero or greater.                                                                                                               |
| `expiresAt`        | UTC date-time | Must be in the future.                                                                                                                 |
| `nodeIdentity`     | string        | Must contain non-space text.                                                                                                           |
| `ports`            | object        | Must include valid `sql` and `http` ports.                                                                                             |
| `routes`           | object        | Must include `primary` and `balanced` node arrays.                                                                                     |

## Optional fields

| Field            | Type          | Rule                                      |
| ---------------- | ------------- | ----------------------------------------- |
| `applicationId`  | string        | Must contain non-space text when present. |
| `databaseId`     | string        | Must contain non-space text when present. |
| `identityId`     | string        | Must contain non-space text when present. |
| `credentialName` | string        | Must contain non-space text when present. |
| `scopes`         | string array  | Every item must contain non-space text.   |
| `refreshAfter`   | UTC date-time | Must be a valid future date when present. |

## Nodes and ports

A routing node has a `host` string and an integer `port` from 1 to 65535. It may have a `weight` number of zero or greater and a non-empty `nodeId` string. The validator trims node hosts and identifiers.

`ports` must include `sql` and `http`. It can include other named ports. Each name must contain no leading, trailing, or empty space. Each value must be an integer from 1 to 65535.

`routes` accepts only `primary` and `balanced`. Both values must be arrays of valid nodes. Route views may overlap with the writer, failover, or reader lists. Duplicate nodes within each list are invalid.

## Data limits

The validator rejects unknown fields. It rejects symbols, accessors, cyclic values, sparse arrays, non-finite numbers, and unsupported object types. It accepts JSON-compatible data only.

The serialized bundle limit is 1 MiB. The validator copies the bundle before it returns. Changes to the returned object do not change the input object.

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

Use [the bundle schema](../contracts/routing-bundle.schema.json) and [the payload schema](../contracts/bundle-payload.schema.json) for machine validation.
