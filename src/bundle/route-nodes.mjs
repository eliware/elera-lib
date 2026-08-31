import { validateRoutingNodes } from '../routing/node-validation.mjs';

export function validateBundleRouteNodes(bundle) {
  for (const route of ['primary', 'balanced']) {
    if (!Array.isArray(bundle.routes[route])) throw new TypeError(`bundle.routes.${route} must be an array`);
    validateRoutingNodes(bundle.routes[route], `routing bundle ${route}`);
  }
}
