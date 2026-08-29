# Elera library example

`basic-client.mjs` is a minimal managed consumer application. It imports only
the public `@eliware/elera-lib` package API, opens a SQL client from the Elera
endpoint and application token, performs a health check and query, and closes
the client in a `finally` block.

Run it with:

    ELERA_API_ENDPOINT=http://supervisor-or-load-balancer:8080 ELERA_API_TOKEN=application-token node examples/basic-client.mjs

The example is infrastructure-neutral. It contains no Docker, Kubernetes,
Supervisor, CLI, Galera, or test-lab setup.
