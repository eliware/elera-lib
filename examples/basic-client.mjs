import { createTelemetry, validateBundle } from '@eliware/elera-lib';

// Native SQL application examples live in @eliware/elera-client.
const bundle = validateBundle(JSON.parse(process.env.ELERA_BUNDLE_JSON ?? '{}'));
const telemetry = createTelemetry({ application: bundle.application, database: bundle.database });

console.log(JSON.stringify({ bundleVersion: bundle.bundleVersion, telemetry: telemetry.snapshot() }));
