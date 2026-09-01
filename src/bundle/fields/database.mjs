const requiredText = (value, name) => { if (typeof value !== 'string' || value.trim().length === 0) throw new TypeError(`${name} is required`); };

export function validateBundleDatabaseFields(bundle) {
  requiredText(bundle.database, 'routing bundle database');
  requiredText(bundle.physicalDatabase, 'routing bundle physicalDatabase');
  if (bundle.databaseId !== undefined) requiredText(bundle.databaseId, 'routing bundle databaseId');
}
