export function validateBundleInput(bundle) {
  if (!bundle || typeof bundle !== 'object') throw new TypeError('routing bundle is required');
}
