import { validateBundle } from '@eliware/elera-lib';

const bundle = validateBundle(JSON.parse(process.env.ELERA_BUNDLE_JSON ?? '{}'));

console.log(JSON.stringify({
  application: bundle.application,
  database: bundle.database,
  identity: bundle.identity,
  bundleVersion: bundle.bundleVersion,
  writer: bundle.writer,
  readers: bundle.readers,
  failover: bundle.failover,
}));
