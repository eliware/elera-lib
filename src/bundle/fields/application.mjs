import { requiredText } from './required-text.mjs';

export function validateBundleApplicationFields(bundle) {
  requiredText(bundle.application, 'routing bundle application');
  if (bundle.applicationId !== undefined) requiredText(bundle.applicationId, 'routing bundle applicationId');
}
