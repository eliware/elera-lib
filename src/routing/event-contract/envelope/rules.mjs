import { validateEventVersion } from "./version.mjs";
import { validateUtcTimestamp } from "../timestamp.mjs";

export const eventTypes = new Set([
  "routing.update",
  "routing.topology",
  "routing.drain",
  "routing.recovery",
  "routing.shutdown",
]);

export function validateEventRules(snapshot) {
  if (!eventTypes.has(snapshot.type)) throw new TypeError("unsupported routing event");
  validateEventVersion(snapshot.version);
  validateUtcTimestamp(snapshot.generatedAt, "routing event generatedAt");
  return snapshot;
}
