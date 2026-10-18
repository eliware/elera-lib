# [![eliware.org](https://eliware.org/logos/brand.png)](https://discord.gg/M6aTR9eTwN)

## @eliware/elera-lib [![npm](https://img.shields.io/npm/v/@eliware/elera-lib)](https://www.npmjs.com/package/@eliware/elera-lib) [![License](https://img.shields.io/github/license/eliware/elera-lib)](https://github.com/eliware/elera-lib/blob/main/LICENSE) [![CI](https://github.com/eliware/elera-lib/actions/workflows/ci.yaml/badge.svg)](https://github.com/eliware/elera-lib/actions/workflows/ci.yaml)

Shared Elera routing contracts and validation

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Setup](#setup)
- [Usage](#usage)
- [Development](#development)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Security](#security)
- [API](#api)
- [Packaging](#packaging)
- [Examples](#examples)
- [Support](#support)
- [Links](#links)
- [License](#license)

## Features

Validate routing bundles and routing events. The package does not connect to databases or manage routing transport.

## Requirements

Use Node.js 26 or later.

## Setup

Install the public package with `npm install @eliware/elera-lib`.

## Usage

Import `validateBundle` or `validateRoutingEvent` from `@eliware/elera-lib`. Read the [documentation index](docs/README.md), [API usage](docs/usage.md), [bundle fields](docs/bundle-contract.md), and [routing events](docs/routing-events.md).
Read [release notes](RELEASE_NOTES.md) for released changes. Read [specifications](specs/README.md) for repository requirements.

## Development

Run `npm ci` to install the locked development packages.

## Testing

Run `npm test` to validate the repository.

## Troubleshooting

Run `npm ci` from the repository root. Then run `npm test`.
Correct the first reported error before you run the test again.

## Security

Do not log credentials or tokens. Do not commit secrets or live routing data.

## API

Read [API usage](docs/usage.md) for the supported functions.

## Packaging

Run `npm run pack` to check package contents.

## Examples

Read [examples](examples/README.md) for a complete bundle example.

## Support

For help, questions, or to chat with the author and community, visit:

[![Discord](https://eliware.org/logos/discord_96.png)](https://discord.gg/M6aTR9eTwN)[![eliware.org](https://eliware.org/logos/eliware_96.png)](https://discord.gg/M6aTR9eTwN)

**[eliware.org on Discord](https://discord.gg/M6aTR9eTwN)**

## Links

- [Home Page](https://eliware.org)
- [GitHub Org](https://github.com/eliware)
- [GitHub Repo](https://github.com/eliware/elera-lib)
- [Bug Reports](https://github.com/eliware/elera-lib/issues)
- [npm](https://www.npmjs.com/package/@eliware/elera-lib)
- [Discord](https://discord.gg/M6aTR9eTwN)

## License

[MIT © Eliware](LICENSE)
