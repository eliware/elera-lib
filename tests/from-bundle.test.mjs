import { createDbFromBundle, profilesFromBundle } from '../src/client/from-bundle.mjs';

const bundle = { database: 'app', identity: 'runtime', credentials: { username: 'u', password: 'p' }, routes: { primary: [{ host: 'writer', port: 3306 }], balanced: [{ host: 'reader', port: 3306 }] }, expiresAt: '2099-01-01T00:00:00Z' };
test('derives generic SQL profiles from a routing bundle', () => { expect(profilesFromBundle(bundle)).toMatchObject({ primary: { host: 'writer', user: 'u', database: 'app' }, balanced: { host: 'reader' } }); });
test('creates a client from only a validated bundle', async () => { const client = await createDbFromBundle({ bundle, mysqlLib: { createPool: () => ({ getConnection: async () => ({ query: async () => [[]], release() {} }), query: async () => [[]], end: async () => {} }) }, log: {} }); expect(client.bundle()).toBe(bundle); await client.close(); });
