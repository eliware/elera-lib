# AGENTS.md

## Project

Build @eliware/elera-lib with Node.js 26 or later and native ESM.

## Scope and boundaries

Keep shared routing contracts and validation in this package. Do not publish or deploy during validation.

## Layout

Keep runtime code in src/, tests in tests/, docs in docs/, examples in examples/, and specifications in specs/.

## Development

Keep each source module below 100 lines. Keep each test module below 200 lines. Match each source module with one test module.

## Validation

Run `npm test` for aggregate validation. Run `npm run lint` for lint checks. Run `npm run audit` for package audit checks.
Run `npm run format` to format files. Run `npm run format:check` to check file format. Run `npm run pack` to check package contents.
Run `npm run typecheck` to check declarations.

## Security

Keep credentials, tokens, secrets, and private data out of logs and Git.

## Changes

Keep documentation current. Follow the shared repository rules.

## Library

Export supported APIs only. Keep one test module for each source module.

## npm publication

The public package is @eliware/elera-lib. Include required runtime files and metadata. Run `npm run pack` before publication review.
