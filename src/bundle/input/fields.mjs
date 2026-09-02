export const bundleFields = ['apiVersion', 'application', 'applicationId', 'database', 'physicalDatabase', 'identity', 'identityId', 'credentialName', 'scopes', 'credentials', 'bundleVersion', 'expiresAt', 'refreshAfter', 'routes', 'writer', 'failover', 'readers', 'nodeIdentity', 'ports'];
const bundleFieldSet = new Set(bundleFields);

export function assertBundleFields(bundle) {
  try {
    if (Reflect.ownKeys(bundle).some((key) => typeof key !== 'string' || !bundleFieldSet.has(key) || !Object.prototype.propertyIsEnumerable.call(bundle, key))) throw new TypeError('routing bundle field is unknown');
  } catch (error) {
    if (error instanceof TypeError && error.message === 'routing bundle field is unknown') throw error;
    throw new TypeError('routing bundle must be a plain object');
  }
}
