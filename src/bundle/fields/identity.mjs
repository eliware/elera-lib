const requiredText = (value, name) => { if (typeof value !== 'string' || value.length === 0) throw new TypeError(`${name} is required`); };

export function validateBundleIdentityFields(bundle) {
  requiredText(bundle.identity, 'routing bundle identity');
  if (bundle.identityId !== undefined) requiredText(bundle.identityId, 'routing bundle identityId');
  if (bundle.credentialName !== undefined) requiredText(bundle.credentialName, 'routing bundle credentialName');
  requiredText(bundle.nodeIdentity, 'routing bundle nodeIdentity');
}
