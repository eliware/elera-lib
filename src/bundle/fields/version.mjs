export function validateBundleVersion(bundle) {
  if (bundle.bundleVersion === undefined || !['string', 'number'].includes(typeof bundle.bundleVersion)) throw new TypeError('routing bundle bundleVersion is required');
}
