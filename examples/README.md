# Elera library example

`basic-client.mjs` demonstrates the shared `@eliware/elera-lib` contract
helpers. Native SQL application examples belong to `@eliware/elera-client`.

Run it with:

    ELERA_BUNDLE_JSON='{"bundleVersion":1,"expiresAt":"2099-01-01T00:00:00Z","routes":{"primary":[{"host":"elera-0","port":3306}],"balanced":[{"host":"elera-0","port":3306}]}}' node examples/basic-client.mjs

The example is infrastructure-neutral. It contains no Docker, Kubernetes,
Supervisor, CLI, Galera, or test-lab setup.
