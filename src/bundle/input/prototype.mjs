export function assertPlainBundle(bundle) {
  let prototype;
  try { prototype = Object.getPrototypeOf(bundle); } catch { throw new TypeError('routing bundle must be a plain object'); }
  try {
    const constructor = prototype && Object.getOwnPropertyDescriptor(prototype, 'constructor')?.value;
    if (prototype !== null && (Object.getPrototypeOf(prototype) !== null || constructor?.name !== 'Object')) throw new TypeError('routing bundle must be a plain object');
  } catch { throw new TypeError('routing bundle must be a plain object'); }
}
