import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import Ajv from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const readJson = async (name) => JSON.parse(await readFile(new URL(`../contracts/${name}`, import.meta.url)));
const digest = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const schema = await readJson('routing-bundle.schema.json');
const fixture = await readJson('routing-bundle.fixture.json');
const expected = {
  schema: 'ed65201f862035e5b2f54cb661e9499059b6c7c85b405553cbe2d2709134dc15',
  fixture: '5e87099f592148608f9fcc52e2f6fae24a0d35e79e882e6f2860bb6f84def3a0'
};
const ajv = new Ajv({ allErrors: true, strict: true, allowUnionTypes: true });
addFormats(ajv);
const validate = ajv.compile(schema);
if (!validate(fixture)) throw new Error(`routing bundle fixture does not match schema: ${ajv.errorsText(validate.errors)}`);
if (digest(schema) !== expected.schema || digest(fixture) !== expected.fixture) throw new Error('routing bundle contract drift detected');
console.log('Contract schema and fixture verified'); 
