import { validateBundle } from '@eliware/elera-lib';

let bundle;
try {
  bundle = validateBundle(JSON.parse(process.env.ELERA_BUNDLE_JSON ?? '{}'));
} catch (error) {
  console.error(`Invalid ELERA_BUNDLE_JSON: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}

if (bundle) {
  console.log(JSON.stringify({
    // Credentials are deliberately omitted; this example demonstrates routing metadata only.
    application: bundle.application,
    database: bundle.database,
    identity: bundle.identity,
    bundleVersion: bundle.bundleVersion,
    writer: bundle.writer,
    readers: bundle.readers,
    failover: bundle.failover,
  }));
}
