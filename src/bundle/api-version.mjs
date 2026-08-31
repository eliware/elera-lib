export function validateBundleApiVersion(bundle) {
  if (bundle.apiVersion !== 'v1') throw new TypeError('routing bundle apiVersion must be v1');
}
