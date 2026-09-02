export function readNodeValues(node, name) {
  let descriptors;
  try { descriptors = Object.getOwnPropertyDescriptors(node); }
  catch { throw new TypeError(`${name} must contain data properties`); }
  if (Object.values(descriptors).some((descriptor) => !Object.hasOwn(descriptor, 'value'))) throw new TypeError(`${name} must contain data properties`);
  return Object.fromEntries(Object.entries(descriptors).map(([key, descriptor]) => [key, descriptor.value]));
}
