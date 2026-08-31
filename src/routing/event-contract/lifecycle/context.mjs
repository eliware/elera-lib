export function validateContextEvent(event) {
  if (typeof event.node !== 'string' || event.node.length === 0) throw new TypeError(`routing ${event.type.slice(8)} node is required`);
  if (!event.context || typeof event.context !== 'object' || Array.isArray(event.context)) throw new TypeError(`routing ${event.type.slice(8)} context is required`);
  return event;
}
