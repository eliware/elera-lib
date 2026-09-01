# Elera library example

`basic-client.mjs` demonstrates the shared `@eliware/elera-lib` bundle-validation
helper. Native SQL application examples belong to `@eliware/elera-client`.

Run it with a complete bundle (including the required generated physical schema):

    ELERA_BUNDLE_JSON='{"apiVersion":"v1","application":"billing","database":"billing","physicalDatabase":"elera_billing","identity":"billing-runtime","credentials":{"username":"billing_runtime","password":"fixture-only"},"writer":{"host":"elera-0","port":3306},"readers":[{"host":"elera-0","port":3306}],"failover":[{"host":"elera-1","port":3306}],"bundleVersion":1,"expiresAt":"2099-01-01T00:00:00Z","nodeIdentity":"elera-0","ports":{"sql":3306,"http":8080},"routes":{"primary":[{"host":"elera-0","port":3306}],"balanced":[{"host":"elera-0","port":3306}]}}' node examples/basic-client.mjs

`ports` requires `sql` and `http` and may include additional integer service
ports for future endpoints.

The program prints routing metadata only; credentials are intentionally omitted
from its output.

The example intentionally reuses the writer endpoint in its reader and route
views; those views are independent and reader overlap is allowed.

The example is infrastructure-neutral. It contains no Docker, Kubernetes,
Supervisor, CLI, Galera, or test-lab setup.
