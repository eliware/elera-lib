import { validateBundleEndpointNodes } from './endpoint-nodes.mjs';
import { validateBundleRouteNodes } from './route-nodes.mjs';

export function validateBundleRoutes(bundle) {
  if (!bundle.routes || typeof bundle.routes !== 'object') throw new TypeError('routing bundle routes are required');
  validateBundleEndpointNodes(bundle);
  validateBundleRouteNodes(bundle);
}
