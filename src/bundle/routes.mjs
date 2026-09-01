import { validateBundleEndpointConflicts } from './endpoint-conflicts.mjs';
import { validateBundleRouteLists } from './route-lists.mjs';

export function validateBundleRoutes(bundle) {
  if (!bundle.routes || typeof bundle.routes !== 'object') throw new TypeError('routing bundle routes are required');
  validateBundleEndpointConflicts(bundle);
  validateBundleRouteLists(bundle);
  return bundle;
}
