import { requiredText } from './required-text.mjs';

export function validateBundleDatabaseFields(bundle) {
  requiredText(bundle.database, 'routing bundle database');
  requiredText(bundle.physicalDatabase, 'routing bundle physicalDatabase');
  if (bundle.databaseId !== undefined) requiredText(bundle.databaseId, 'routing bundle databaseId');
}
