# Troubleshooting

## Invalid bundle

Check each required field in the [bundle contract](bundle-contract.md). Confirm that `expiresAt` is a future UTC date-time. Remove unknown fields and non-JSON values.

## Invalid event

Check the event type and required fields in [routing events](routing-events.md). Set `generatedAt` to a valid UTC date-time. Remove fields that the event type does not allow.

## Install or test failure

Use Node.js 26 or later. Run `npm ci` from the repository root. Run `npm test` again. Read the first reported error and follow its rule.

## TypeScript error

Import supported functions and types from `@eliware/elera-lib`. Read the result of `validateRoutingEvent` as `unknown`. Check its `type` before you read event fields.
