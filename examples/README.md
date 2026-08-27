# Elera library example

basic-client.mjs is a minimal consumer application. It imports only the
public @eliware/elera-lib package API, opens a bounded SQL client from
environment configuration, performs a health check and query, and closes the
client in a finally block.

Run it from a published-package consumer project with:

    MYSQL_PRIMARY_HOST=127.0.0.1 MYSQL_USER=app MYSQL_PASSWORD=secret MYSQL_DATABASE=app node examples/basic-client.mjs

The example is intentionally infrastructure-neutral. It does not contain
Docker, Kubernetes, Supervisor, CLI, Galera, or test-lab setup.
