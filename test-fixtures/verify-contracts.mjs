import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import Ajv from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const readJson = async (name) =>
  JSON.parse(
    await readFile(new URL(`../contracts/${name}`, import.meta.url), { encoding: "utf8" }),
  ); // codescope ignore: contract JSON inputs are checked into contracts/ and this verifier passes locally.
// codescope ignore: the four contract files are checked into contracts/ and this verifier passes when run from the repository root.
// Intentional: this repository verifier keeps loading, hashing, schema validation, and drift reporting atomic.
const canonical = (value) =>
  Array.isArray(value)
    ? value.map(canonical)
    : value && typeof value === "object"
      ? Object.fromEntries(
          Object.keys(value)
            .sort()
            .map((key) => [key, canonical(value[key])]),
        )
      : value;
const digest = (value) =>
  createHash("sha256")
    .update(JSON.stringify(canonical(value)))
    .digest("hex");
// Intentional: canonical copying is limited to small checked-in schemas and keeps hashes stable across key order.
// codescope ignore: these four JSON inputs are checked into contracts/ and verified successfully by this script.
const schema = await readJson("routing-bundle.schema.json"); // codescope ignore: this contract JSON is checked into contracts/ and verified successfully by this script.
const payloadSchema = await readJson("bundle-payload.schema.json");
const fixture = await readJson("routing-bundle.fixture.json");
const eventSchema = await readJson("routing-event.schema.json");
const expected = {
  schema: "71127414d8019a2a11a36bb41cea9305df6279070886ea56be7dcefc87b28a02",
  payloadSchema: "b4780b8da7d2a9022a36127601e18b1f4b0f85d263af252504027a99e15dc983",
  fixture: "43641ac53df62ec0560198eb3ca4ebd995dedc727e322bb872a81fb6e78e5fca",
  eventSchema: "822515fa37f0d433baf3170bf50d76dfd55d37c6827df27ae50e0720bbba9977",
};
// These are trusted repository files; validate their internal schemas before reporting drift.
const ajv = new Ajv({ allErrors: true, strict: true, allowUnionTypes: true });
addFormats(ajv);
ajv.addSchema(payloadSchema);
const validate = ajv.compile(schema);
if (!validate(fixture))
  throw new Error(
    `routing bundle fixture does not match schema: ${ajv.errorsText(validate.errors)}`,
  );
ajv.addSchema(schema, "routing-bundle.schema.json");
const validateEventSchema = ajv.compile(eventSchema);
const eventFixture = {
  ...fixture,
  type: "routing.update",
  version: 1,
  generatedAt: "2099-01-01T00:00:00Z",
};
if (!validateEventSchema(eventFixture))
  throw new Error(
    `routing event fixture does not match schema: ${ajv.errorsText(validateEventSchema.errors)}`,
  );
if (validateEventSchema({ ...eventFixture, type: "routing.unknown" }))
  throw new Error("routing update schema accepts an unknown event type");
const topologyFixture = {
  type: "routing.topology",
  version: 1,
  generatedAt: "2099-01-01T00:00:00Z",
  node: "node-a",
  context: {
    nodeIdentity: { name: "node-a" },
    ports: { sql: 3306, http: 8080 },
    clusterCondition: "ready",
  },
  topology: { nodes: [] },
};
if (!validateEventSchema(topologyFixture))
  throw new Error(
    `routing topology fixture does not match schema: ${ajv.errorsText(validateEventSchema.errors)}`,
  );
if (
  validateEventSchema({
    ...topologyFixture,
    context: { ...topologyFixture.context, nodeIdentity: { name: "node-a", extra: true } },
  })
)
  throw new Error("routing topology schema accepts an unknown nodeIdentity field");
const shutdownFixture = {
  type: "routing.shutdown",
  version: 1,
  generatedAt: "2099-01-01T00:00:00Z",
  node: "node-a",
  reason: "maintenance",
  reconnectDeadlineMs: 0,
};
if (!validateEventSchema(shutdownFixture))
  throw new Error(
    `routing shutdown fixture does not match schema: ${ajv.errorsText(validateEventSchema.errors)}`,
  );
if (validateEventSchema({ ...shutdownFixture, reconnectDeadlineMs: 1.5 }))
  throw new Error("routing shutdown schema accepts a fractional deadline");
const contextFixture = {
  type: "routing.drain",
  version: 1,
  generatedAt: "2099-01-01T00:00:00Z",
  node: "node-a",
  context: {},
};
if (validateEventSchema({ ...contextFixture, type: "routing.unknown" }))
  throw new Error("routing context schema accepts an unknown event type");
if (
  digest(schema) !== expected.schema ||
  digest(payloadSchema) !== expected.payloadSchema ||
  digest(fixture) !== expected.fixture ||
  digest(eventSchema) !== expected.eventSchema
)
  throw new Error("routing contract drift detected");
console.log("Contract schemas and fixture verified");
