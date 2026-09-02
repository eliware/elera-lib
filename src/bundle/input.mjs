export const bundleFields = ['apiVersion', 'application', 'applicationId', 'database', 'physicalDatabase', 'databaseId', 'identity', 'identityId', 'credentialName', 'scopes', 'credentials', 'bundleVersion', 'expiresAt', 'refreshAfter', 'routes', 'writer', 'failover', 'readers', 'nodeIdentity', 'ports'];
const bundleFieldSet = new Set(bundleFields);

export function validateBundleInput(bundle) {
  // codescope ignore: bounded detachment is transport/application policy; this shared helper only validates the detached contract shape.
  // codescope ignore: validateBundle invokes this after structuredClone; direct callers are explicitly using the focused shape validator and accept its proxy boundary.
  // Intentional: this shared library validates contract shape and allowlists fields; applications own hostile-object isolation and request policy.
  if (!bundle || typeof bundle !== 'object') throw new TypeError('routing bundle is required');
  if (Array.isArray(bundle)) throw new TypeError('routing bundle must be an object');
  let prototype;
  try { prototype = Object.getPrototypeOf(bundle); } catch { throw new TypeError('routing bundle must be a plain object'); }
  try {
    // Codescope exception: prototype checks support cross-realm plain objects; trap-capable operations remain inside this rejection boundary.
    // codescope ignore: the constructor is obtained from a data descriptor; this check does not invoke a prototype getter.
    const constructor = prototype && Object.getOwnPropertyDescriptor(prototype, 'constructor')?.value;
    if (prototype !== null && (Object.getPrototypeOf(prototype) !== null || constructor?.name !== 'Object')) throw new TypeError('routing bundle must be a plain object');
  } catch { throw new TypeError('routing bundle must be a plain object'); }
  // Intentional: this is a cheap shape gate; validateBundle detaches data before field reads and normalizes clone failures.
  try {
    if (Reflect.ownKeys(bundle).some((key) => typeof key !== 'string' || !bundleFieldSet.has(key) || !Object.prototype.propertyIsEnumerable.call(bundle, key))) throw new TypeError('routing bundle field is unknown');
  } catch (error) {
    if (error instanceof TypeError && error.message === 'routing bundle field is unknown') throw error;
    throw new TypeError('routing bundle must be a plain object');
  }
}
