import { validateEnvelope } from "./envelope.mjs";
import { validateUpdateEvent } from "./update.mjs";
import { validateContextEvent } from "./lifecycle/context.mjs";
import { validateShutdownEvent } from "./lifecycle/shutdown.mjs";
import { validateTopologyEvent } from "./topology/index.mjs";
import { validateWithLogging } from "../../logging.mjs";

export function validateRoutingEvent(event, options = {}) {
  return validateWithLogging(
    options.logger,
    "validateRoutingEvent",
    () => validate(event),
    (result) => ({ eventType: result.type }),
  );
}

function validate(event) {
  const normalizedEvent = validateEnvelope(event);
  const type = normalizedEvent.type;
  if (type === "routing.topology") return validateTopologyEvent(normalizedEvent);
  if (type === "routing.update") return validateUpdateEvent(normalizedEvent);
  if (type === "routing.drain" || type === "routing.recovery")
    return validateContextEvent(normalizedEvent);
  return validateShutdownEvent(normalizedEvent);
}
