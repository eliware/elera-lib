export function validateTopologyEnvelope(event) {
  // Codescope exception: this focused gate checks shape only; validateRoutingEvent supplies the detached snapshot and context semantics.
  if (!event || typeof event !== "object" || Array.isArray(event))
    throw new TypeError("routing topology field is required");
  if (event.type !== "routing.topology") throw new TypeError("routing topology type is invalid");
  for (const key of ["type", "version", "generatedAt", "node", "context", "topology"])
    if (!Object.hasOwn(event, key)) throw new TypeError("routing topology field is required");
  for (const key of Object.keys(event))
    if (!["type", "version", "generatedAt", "node", "context", "topology"].includes(key))
      throw new TypeError("routing topology field is unknown");
  validateEventVersion(event.version, "routing topology", 1);
  validateUtcTimestamp(event.generatedAt, "routing topology generatedAt");
  if (typeof event.node !== "string" || event.node.trim().length === 0)
    throw new TypeError("routing topology node is required");
}
import { validateEventVersion } from "../envelope/version.mjs";
import { validateUtcTimestamp } from "../timestamp.mjs";
