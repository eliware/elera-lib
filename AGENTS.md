# AGENTS.md

## Project

Eliware maintains `@eliware/elera-lib` for shared Elera routing contracts and validation.
Use Node.js 26 or later and native ESM.

## Scope and boundaries

Keep shared routing contracts and validation in this package.

## Layout

Keep runtime code in `src/`, tests in `tests/`, and user documentation in `docs/`.
Keep examples in `examples/` and specifications in `specs/`.

## Development

Keep each source module under 100 lines and each test module under 200 lines.

## Validation

Run `npm test` for aggregate validation.
Run `npm run lint` for lint checks.
Run `npm run audit` for dependency checks.
Run `npm run format` to format maintained files.
Run `npm run format:check` to check formatting.

Run `npm run typecheck` to check declarations.
Run `npm run check` to check the public entry point syntax.
Run `npm run pack` to check package contents.

## Security

Keep credentials, secrets, and private data out of logs and Git.

## Changes

Keep documentation current and follow the shared repository rules.

## Library

Run focused tests first during development.
Run one test file with `npm test -- tests/path/to/example.test.mjs`.
Run multiple test files with `npm test -- tests/path/to/first.test.mjs tests/path/to/second.test.mjs`.
Prevent repeated full-suite runs during development.
Run the full `npm test` suite for final validation before a commit, milestone, or release.

## npm publication

Include `specs/` in the package.
Document installation, entry points, package contents, and release limits in `README.md`.
Run `npm run pack` before release validation.
