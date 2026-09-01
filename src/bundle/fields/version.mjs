export function validateBundleVersion(bundle) {
  if (bundle.bundleVersion === undefined || (typeof bundle.bundleVersion === 'number' && (!Number.isFinite(bundle.bundleVersion) || !Number.isInteger(bundle.bundleVersion) || bundle.bundleVersion < 0)) || (typeof bundle.bundleVersion === 'string' && !/^\d+$/.test(bundle.bundleVersion.trim())) || !['string', 'number'].includes(typeof bundle.bundleVersion)) throw new TypeError('routing bundle bundleVersion is required');
}
