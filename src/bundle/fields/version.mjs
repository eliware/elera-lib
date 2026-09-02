export function validateBundleVersion(bundle) {
  if (!Number.isSafeInteger(bundle.bundleVersion) || bundle.bundleVersion < 0) throw new TypeError('routing bundle bundleVersion must be a non-negative integer');
}
