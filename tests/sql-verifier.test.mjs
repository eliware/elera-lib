import { expect, test } from '@jest/globals';
import { createSqlVerifier } from '../src/verification/sql.mjs';
test('verifies connectivity, schema, and grants without dump transport', async () => { const verifier = createSqlVerifier({ query: async (sql) => sql.startsWith('SHOW') ? [[{ grant: 'GRANT SELECT' }]] : [[{ SCHEMA_NAME: 'app' }]] }); expect((await verifier.all({ database: 'app', user: 'app' })).verified).toBe(true); });
test('requires a query function', () => { expect(() => createSqlVerifier()).toThrow('query function is required'); });
