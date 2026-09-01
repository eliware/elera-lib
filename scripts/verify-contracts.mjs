import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import Ajv from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const readJson = async (name) => JSON.parse(await readFile(new URL(`../contracts/${name}`, import.meta.url), { encoding: 'utf8' }));
const canonical = (value) => Array.isArray(value) ? value.map(canonical) : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonical(value[key])])) : value;
const digest = (value) => createHash('sha256').update(JSON.stringify(canonical(value))).digest('hex');
const schema = await readJson('routing-bundle.schema.json');
const payloadSchema = await readJson('bundle-payload.schema.json');
const fixture = await readJson('routing-bundle.fixture.json');
const eventSchema = await readJson('routing-event.schema.json');
const expected = {
  schema: '71127414d8019a2a11a36bb41cea9305df6279070886ea56be7dcefc87b28a02',
  payloadSchema: 'e19d0f0d90bca64651b85c176ba89f969e6c95030ff28a40430dc4b0cd61b90d',
  fixture: '43641ac53df62ec0560198eb3ca4ebd995dedc727e322bb872a81fb6e78e5fca',
  eventSchema: 'f683c28f627007502a2625c95d71bece2f936bde565eaaa2df0f1a817c06620d'
};
// These are trusted repository files; validate their internal schemas before reporting drift.
const ajv = new Ajv({ allErrors: true, strict: true, allowUnionTypes: true });
addFormats(ajv);
ajv.addSchema(payloadSchema);
const validate = ajv.compile(schema);
if (!validate(fixture)) throw new Error(`routing bundle fixture does not match schema: ${ajv.errorsText(validate.errors)}`);
ajv.addSchema(schema, 'routing-bundle.schema.json');
const validateEventSchema = ajv.compile(eventSchema);
const eventFixture = { ...fixture, type: 'routing.update', version: 1, generatedAt: '2099-01-01T00:00:00Z' };
if (!validateEventSchema(eventFixture)) throw new Error(`routing event fixture does not match schema: ${ajv.errorsText(validateEventSchema.errors)}`);
if (digest(schema) !== expected.schema || digest(payloadSchema) !== expected.payloadSchema || digest(fixture) !== expected.fixture || digest(eventSchema) !== expected.eventSchema) throw new Error('routing contract drift detected');
console.log('Contract schemas and fixture verified');
