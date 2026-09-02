export function readEventDescriptors(event) {
  let descriptors;
  try {
    const prototype = Object.getPrototypeOf(event);
    if (prototype !== Object.prototype && prototype !== null) throw new TypeError('unsupported routing event');
    descriptors = Object.getOwnPropertyDescriptors(event);
    if (Object.values(descriptors).some((descriptor) => !Object.hasOwn(descriptor, 'value'))) throw new TypeError('unsupported routing event');
    if (Reflect.ownKeys(descriptors).some((key) => typeof key !== 'string' || !descriptors[key].enumerable)) throw new TypeError('unsupported routing event');
  } catch { throw new TypeError('unsupported routing event'); }
  return Object.fromEntries(Reflect.ownKeys(descriptors).filter((key) => typeof key === 'string').map((key) => [key, descriptors[key].value]));
}
