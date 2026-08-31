const requiredText = (value, name) => { if (typeof value !== 'string' || value.length === 0) throw new TypeError(`${name} is required`); };

export function validateBundleApplicationFields(bundle) {
  requiredText(bundle.application, 'routing bundle application');
  if (bundle.applicationId !== undefined) requiredText(bundle.applicationId, 'routing bundle applicationId');
}
