export const bundleFields = ['apiVersion', 'application', 'applicationId', 'database', 'physicalDatabase', 'databaseId', 'identity', 'identityId', 'credentialName', 'scopes', 'credentials', 'bundleVersion', 'expiresAt', 'refreshAfter', 'routes', 'writer', 'failover', 'readers', 'nodeIdentity', 'ports'];

export function validateBundleInput(bundle) {
  if (!bundle || typeof bundle !== 'object') throw new TypeError('routing bundle is required');
  if (Array.isArray(bundle)) throw new TypeError('routing bundle must be an object');
  if (![Object.prototype, null].includes(Object.getPrototypeOf(bundle))) throw new TypeError('routing bundle must be a plain object');
  if (Object.keys(bundle).some((key) => !bundleFields.includes(key))) throw new TypeError('routing bundle field is unknown');
}
