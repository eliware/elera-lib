import { bundleExpired } from '../bundle.mjs';
import { createNodePool, createRoutePool } from '../pools.mjs';

const bundleProfiles = (bundle, route, base) => (bundle.routes?.[route] ?? []).map((node) => ({ ...base, host: node.host, port: node.port, weight: node.weight }));

export function createRouteFactory({ bundle, now, mysqlLib, log, quarantineMs }) {
  return (route, fallback) => {
    const profiles = bundle && !bundleExpired(bundle, now()) ? bundleProfiles(bundle, route, fallback) : [];
    return createRoutePool((profiles.length ? profiles : [fallback]).map((profile) => createNodePool({ profile, mysqlLib, log, now, quarantineMs })));
  };
}
