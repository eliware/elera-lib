# API usage

## Install

Install Node.js 26 or later. Install the package in an ESM project:

```sh
npm install @eliware/elera-lib
```

The package has no runtime dependencies. It reads no environment variables and opens no network or database connection.

## Import

Import either public function from the package root:

```js
import { validateBundle, validateRoutingEvent } from "@eliware/elera-lib";
```

The package exports only these two functions. Internal source paths are not public entry points.

## Validate a bundle

Pass a bundle object to `validateBundle`. The function returns a normalized copy. It does not change the input object.

```js
const bundle = validateBundle(input);
console.log(bundle.bundleVersion);
```

The function throws `TypeError` when the object violates the contract. It rejects accessors, symbols, unsupported object types, cyclic values, and JSON values over 1 MiB. See [bundle contract](bundle-contract.md) for all fields and rules.

Bundle expiry uses the current process clock. The `expiresAt` value must be in the future. Use a caller-owned clock check when you need replay control.

## Validate an event

Pass an event object to `validateRoutingEvent`:

```js
try {
  const event = validateRoutingEvent(input);
  console.log(event.type);
} catch (error) {
  console.error(error.message);
}
```

The function returns a detached, validated event. It throws `TypeError` for an unknown event type, invalid fields, invalid timestamps, or unsupported JSON values. See [routing events](routing-events.md) for event shapes.

## TypeScript

The package includes declarations for `RoutingNode`, `RoutingBundle`, `RoutingTopologyEvent`, and both public functions. Import the functions and types from the package root.

`validateRoutingEvent` accepts `unknown` and returns `unknown`. Narrow the result by its `type` field before you use event-specific fields.

## Supported scope

This package validates data. It does not fetch bundles, open a WebSocket, choose routes, create a SQL client, drain nodes, or reconnect clients. The consuming application owns those actions.

The package has no supported runtime options or environment variables.
