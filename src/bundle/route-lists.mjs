import { validateRoutingNodes } from '../routing/node-validation/index.mjs';

export function validateBundleRouteLists(bundle) {
  if (!bundle.routes || typeof bundle.routes !== 'object' || Array.isArray(bundle.routes)) throw new TypeError('routing bundle routes are required');
  const routes = {};
  // Route sets intentionally overlap role views: primary may contain writer and balanced may contain readers.
  // Intentional: route-list validation checks shape and node validity only; endpoint ownership belongs to the role views.
  for (const route of ['primary', 'balanced']) {
    if (!Array.isArray(bundle.routes[route])) throw new TypeError(`bundle.routes.${route} must be an array`);
    routes[route] = validateRoutingNodes(bundle.routes[route], `routing bundle ${route}`);
  }
  bundle.routes = routes;
  return bundle;
}
