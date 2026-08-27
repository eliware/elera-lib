const routes = ['primary', 'balanced'];

export function validateBundle(bundle) {
  if (!bundle || typeof bundle !== 'object') throw new TypeError('routing bundle is required');
  if (!bundle.expiresAt || Number.isNaN(Date.parse(bundle.expiresAt))) throw new TypeError('routing bundle expiresAt is required');
  for (const route of routes) {
    if (bundle.routes?.[route] !== undefined && !Array.isArray(bundle.routes[route])) throw new TypeError(`bundle.routes.${route} must be an array`);
    for (const node of bundle.routes?.[route] ?? []) {
      if (!node.host || !Number.isInteger(Number(node.port)) || Number(node.port) < 1 || Number(node.port) > 65535) throw new TypeError(`invalid ${route} bundle node`);
      if (node.weight !== undefined && (!Number.isFinite(Number(node.weight)) || Number(node.weight) < 0)) throw new TypeError(`invalid ${route} bundle weight`);
    }
  }
  return bundle;
}

export function bundleExpired(bundle, now = Date.now()) { return Date.parse(bundle.expiresAt) <= now; }
export function bundleNeedsRefresh(bundle, now = Date.now()) { return bundle.refreshAfter ? Date.parse(bundle.refreshAfter) <= now : bundleExpired(bundle, now); }
