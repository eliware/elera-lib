import { assertPlainBundle } from './prototype.mjs';
import { assertBundleFields, bundleFields } from './fields.mjs';

export { bundleFields };

export function validateBundleInput(bundle) {
  // codescope ignore: bounded detachment is transport/application policy; this shared helper only validates the detached contract shape.
  if (!bundle || typeof bundle !== 'object') throw new TypeError('routing bundle is required');
  if (Array.isArray(bundle)) throw new TypeError('routing bundle must be an object');
  assertPlainBundle(bundle);
  assertBundleFields(bundle);
}
