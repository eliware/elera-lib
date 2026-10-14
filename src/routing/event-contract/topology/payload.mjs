import { assertJsonValue } from "../json-value/index.mjs";

export function detachTopologyPayload(payload) {
  assertJsonValue(payload, "routing topology topology");
  let topology;
  try {
    topology = structuredClone(payload);
  } catch {
    throw new TypeError("routing topology topology must contain cloneable JSON-compatible values");
  }
  assertJsonValue(topology, "routing topology topology");
  return topology;
}
