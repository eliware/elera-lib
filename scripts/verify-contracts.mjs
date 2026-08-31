import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import Ajv from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const readJson = async (name) => JSON.parse(await readFile(new URL(`../contracts/${name}`, import.meta.url)));
const digest = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const schema = await readJson('routing-bundle.schema.json');
const payloadSchema = await readJson('bundle-payload.schema.json');
const fixture = await readJson('routing-bundle.fixture.json');
const eventSchema = await readJson('routing-event.schema.json');
const expected = {
  schema: 'e066403ef67e6fb8a325735674748e420c03e66a2554db30f7fd170c590d8932',
  payloadSchema: 'a2a8b4402bc08628225f5dd21915f6c0853ef51a53512d60b130ca1a3097dbdb',
  fixture: '9c195596673d9f59013758cdf47fee1dbac37af5e8be006f0530395c587539ed',
  eventSchema: '74d4da95c398129ecabdf89465b86b8843e4db07d243b68d2c3b32bab24a6df1'
};
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
