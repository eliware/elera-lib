# Troubleshooting

## Bundle validation failures

`validateBundle` throws `TypeError` when a bundle breaks a contract rule. Compare the input with the [bundle contract](bundle-contract.md).

Check that the bundle includes every required field. Check that each node has a non-empty `host` and a valid integer `port`.

Check that each node list has unique endpoints. A failover endpoint cannot match the writer endpoint. Route lists may share endpoints with other lists.

Check that `expiresAt` and an optional `refreshAfter` value use UTC timestamps later than the current process time. Use `YYYY-MM-DDTHH:mm:ssZ` or `YYYY-MM-DDTHH:mm:ss.sssZ`.

The validator returns normalized node values in a copy. Read that value to get trimmed node hosts or identifiers.

## Event validation failures

`validateRoutingEvent` throws `TypeError` when an event type, field, timestamp, or value breaks its contract. Compare the event with the [routing event guide](routing-events.md).

Check that `type`, `version`, and `generatedAt` exist. Use a supported event type.

Remove fields that the selected event does not allow.

Check that bundle fields appear at the update event's top level. The validator does not accept a nested `bundle` field.

Check that topology events include the required context and topology fields. Drain and recovery events require a JSON object for `context`.

## Shutdown endpoint failures

The validator checks the endpoint URL format and rejects user data, queries, fragments, and recognized local or private addresses.

The validator does not resolve hostnames or inspect the final connection. Apply network checks in the consuming application with checks for private DNS results.

## Install or test failures

Use Node.js 26 or later. Run `npm ci` from the repository root, then run `npm test`.

Read the first reported error. Follow the rule for the reported file or input.

Do not log credentials. Do not copy live routing data into examples.

## TypeScript errors

The package exports `RoutingNode`, `RoutingBundle`, and `RoutingTopologyEvent` types. Import those types from `@eliware/elera-lib`.

The `validateRoutingEvent` declaration returns `unknown`. Check the event's `type` before you read fields for that event. See [API usage](usage.md) for a type guard example.
