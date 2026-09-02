export function readPortValues(ports) {
  if (Object.values(Object.getOwnPropertyDescriptors(ports)).some((descriptor) => !Object.hasOwn(descriptor, 'value'))) throw new TypeError('routing bundle ports must contain data properties');
  return Object.fromEntries(Object.entries(Object.getOwnPropertyDescriptors(ports)).map(([name, descriptor]) => [name, descriptor.value]));
}
