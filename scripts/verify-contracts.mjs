import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import Ajv from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const readJson = async (name) => JSON.parse(await readFile(new URL(`../contracts/${name}`, import.meta.url)));
const digest = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const schema = await readJson('routing-bundle.schema.json');
const fixture = await readJson('routing-bundle.fixture.json');
const expected = {
  schema: 'b7e12f5973cb1dc3292c7fc6518351160de3192e35043aa29276915091fc3b22',
  fixture: '971429b561de4b184d015a9401ce2d2be9a102de334f1c1c7d483a3f55bd2526'
};
const ajv = new Ajv({ allErrors: true, strict: true, allowUnionTypes: true });
addFormats(ajv);
const validate = ajv.compile(schema);
if (!validate(fixture)) throw new Error(`routing bundle fixture does not match schema: ${ajv.errorsText(validate.errors)}`);
if (digest(schema) !== expected.schema || digest(fixture) !== expected.fixture) throw new Error('routing bundle contract drift detected');
console.log('Contract schema and fixture verified'); 
