import { expect, test } from "@jest/globals";
import { validateRoutingEvent } from "../../../../src/routing/event-contract/index.mjs";
import { validateTopologyContext } from "../../../../src/routing/event-contract/topology/context.mjs";
const event = {
  type: "routing.topology",
  version: 1,
  generatedAt: "2099-01-01T00:00:00.000Z",
  node: "elera-0",
  context: {
    nodeIdentity: { name: "elera-0" },
    ports: { sql: 3306, http: 8080 },
    clusterCondition: "Primary",
    refreshAfter: "2099-01-01T00:01:00.000Z",
  },
  topology: { nodes: [] },
};

function expectInvalidContext(context, message) {
  expect(() => validateTopologyContext(context)).toThrow(message);
}

test("validates topology context", () => {
  expect(validateRoutingEvent(event)).toEqual(event);
  expectInvalidContext(null, "context");
  expectInvalidContext({ ...event.context, nodeIdentity: null }, "nodeIdentity");
  expectInvalidContext({ ...event.context, ports: null }, "ports");
  expectInvalidContext({ ...event.context, ports: { sql: 0 } }, "ports");
  expectInvalidContext({ ...event.context, clusterCondition: "" }, "clusterCondition");
  expectInvalidContext({ ...event.context, refreshAfter: "bad" }, "refreshAfter");
  expectInvalidContext({ ...event.context, extra: true }, "context field");
  expectInvalidContext({ ...event.context, nodeIdentity: [] }, "nodeIdentity");
  expectInvalidContext({ ...event.context, nodeIdentity: {} }, "nodeIdentity");
  expectInvalidContext(
    { ...event.context, nodeIdentity: { name: "n", metadata: {} } },
    "nodeIdentity field",
  );
  expectInvalidContext({ ...event.context, ports: [] }, "ports");
  expectInvalidContext({ ...event.context, ports: { sql: 3306 } }, "ports.http");
  expectInvalidContext(
    { ...event.context, ports: { sql: 3306, http: 8080, mysql: 3306 } },
    "ports field",
  );
});

test("accepts optional ws and millisecond refresh timestamps", () => {
  expect(
    validateRoutingEvent({
      ...event,
      context: {
        ...event.context,
        ports: { sql: 3306, http: 8080, ws: 9000 },
        refreshAfter: "2099-01-01T00:01:00.000Z",
      },
    }),
  ).toBeDefined();
});

test("covers context without optional refreshAfter", () => {
  expect(
    validateTopologyContext({
      nodeIdentity: { name: "n" },
      ports: { sql: 1, http: 2 },
      clusterCondition: "ok",
    }),
  ).toBeDefined();
});

test("covers direct context shape rejection", () => {
  expect(() => validateTopologyContext(null)).toThrow("required");
  const originalClone = globalThis.structuredClone;
  globalThis.structuredClone = () => {
    throw new Error("clone");
  };
  try {
    expect(() => validateTopologyContext({})).toThrow("cloneable");
  } finally {
    globalThis.structuredClone = originalClone;
  }
  expect(
    validateTopologyContext({
      nodeIdentity: { name: "n" },
      ports: { sql: 1, http: 2 },
      clusterCondition: "ok",
      refreshAfter: "2099-01-01T00:01:00Z",
    }),
  ).toBeDefined();
});
