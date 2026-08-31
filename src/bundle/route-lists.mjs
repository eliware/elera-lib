import { validateRoutingNodes } from '../routing/node-validation.mjs';

export function validateBundleRouteLists(bundle) {
  if (!bundle.routes || typeof bundle.routes !== 'object') throw new TypeError('routing bundle routes are required');
  for (const route of ['primary', 'balanced']) {
    if (!Array.isArray(bundle.routes[route])) throw new TypeError(`bundle.routes.${route} must be an array`);
    validateRoutingNodes(bundle.routes[route], `routing bundle ${route}`);
  }
}
