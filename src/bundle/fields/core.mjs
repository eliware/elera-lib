const requiredText = (value, name) => { if (typeof value !== 'string' || value.length === 0) throw new TypeError(`${name} is required`); };
const optionalText = (value, name) => { if (value !== undefined) requiredText(value, name); };

export function validateBundleCoreFields(bundle) {
  requiredText(bundle.application, 'routing bundle application');
  optionalText(bundle.applicationId, 'routing bundle applicationId');
  requiredText(bundle.database, 'routing bundle database');
  requiredText(bundle.physicalDatabase, 'routing bundle physicalDatabase');
  optionalText(bundle.databaseId, 'routing bundle databaseId');
  requiredText(bundle.identity, 'routing bundle identity');
  optionalText(bundle.identityId, 'routing bundle identityId');
  optionalText(bundle.credentialName, 'routing bundle credentialName');
  requiredText(bundle.nodeIdentity, 'routing bundle nodeIdentity');
  if (bundle.bundleVersion === undefined || !['string', 'number'].includes(typeof bundle.bundleVersion)) throw new TypeError('routing bundle bundleVersion is required');
}
