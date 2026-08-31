const requiredText = (value, name) => { if (typeof value !== 'string' || value.length === 0) throw new TypeError(`${name} is required`); };
const optionalText = (value, name) => { if (value !== undefined) requiredText(value, name); };

export function validateBundleFields(bundle) {
  requiredText(bundle.application, 'routing bundle application');
  optionalText(bundle.applicationId, 'routing bundle applicationId');
  requiredText(bundle.database, 'routing bundle database');
  requiredText(bundle.physicalDatabase, 'routing bundle physicalDatabase');
  optionalText(bundle.databaseId, 'routing bundle databaseId');
  requiredText(bundle.identity, 'routing bundle identity');
  optionalText(bundle.identityId, 'routing bundle identityId');
  optionalText(bundle.credentialName, 'routing bundle credentialName');
  if (bundle.scopes !== undefined && (!Array.isArray(bundle.scopes) || bundle.scopes.some((scope) => typeof scope !== 'string' || scope.length === 0))) throw new TypeError('routing bundle scopes must be an array of non-empty strings');
  requiredText(bundle.nodeIdentity, 'routing bundle nodeIdentity');
  if (!bundle.credentials || typeof bundle.credentials !== 'object') throw new TypeError('routing bundle credentials are required');
  requiredText(bundle.credentials.username, 'routing bundle credentials.username');
  if (typeof bundle.credentials.password !== 'string') throw new TypeError('routing bundle credentials.password is required');
  if (bundle.bundleVersion === undefined || !['string', 'number'].includes(typeof bundle.bundleVersion)) throw new TypeError('routing bundle bundleVersion is required');
}
