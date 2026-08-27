import { bundleExpired } from '../bundle.mjs';
import { createNodePool, createRoutePool } from '../pools.mjs';

const bundleProfiles = (bundle, route, base) => {
  const routes = bundle.routes?.[route] ?? [];
  return routes.map((node) => ({ ...base, host: node.host, port: node.port, weight: node.weight }));
};

const routeProfiles = (bundle, route, fallback, now) => {
  if (!bundle) return [fallback];
  if (bundleExpired(bundle, now())) return [fallback];
  const profiles = bundleProfiles(bundle, route, fallback);
  return profiles.length ? profiles : [fallback];
};

export function createRouteFactory({ bundle, now, mysqlLib, log, quarantineMs }) {
  return (route, fallback) => createRoutePool(routeProfiles(bundle, route, fallback, now).map((profile) => createNodePool({ profile, mysqlLib, log, now, quarantineMs })));
}
