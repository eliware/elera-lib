import { createDb } from './create-db.mjs';
import { validateBundle } from '../bundle.mjs';

export function profilesFromBundle(bundle) {
  const valid = validateBundle(bundle);
  const credentials = valid.credentials ?? {};
  const base = { host: valid.routes.primary[0]?.host, port: valid.routes.primary[0]?.port, user: credentials.username, password: credentials.password, database: valid.database };
  return { primary: base, balanced: valid.routes.balanced?.[0] ? { ...base, host: valid.routes.balanced[0].host, port: valid.routes.balanced[0].port } : undefined };
}

export async function createDbFromBundle({ bundle, ...options } = {}) {
  const profiles = profilesFromBundle(bundle);
  return createDb({ ...options, ...profiles, bundle, identity: bundle.identity });
}
